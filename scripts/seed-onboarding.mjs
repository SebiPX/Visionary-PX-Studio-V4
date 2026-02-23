/**
 * seed-onboarding.mjs
 * 
 * One-time script to vectorize the "Need To Know" onboarding document
 * and upsert chunks into the Supabase `onboarding_embeddings` table.
 * 
 * Usage:
 *   node scripts/seed-onboarding.mjs
 * 
 * Prerequisites:
 *   npm install @supabase/supabase-js mammoth dotenv
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import mammoth from 'mammoth';
import { config } from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env.local (Vite convention)
config({ path: path.join(__dirname, '../.env.local') });

// ── Config ─────────────────────────────────────────────────────────────────
const SUPABASE_URL  = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY  = process.env.VITE_SUPABASE_ANON_KEY;   // Service role key is better for seeding
const GEMINI_KEY    = process.env.GEMINI_API_KEY;
const EMBED_MODEL   = 'gemini-embedding-001';               // 768-dim, available on this key
const DOCX_PATH     = path.join(__dirname, '../.temp/Need To Know_Stand Februar 2026.docx');

if (!SUPABASE_URL || !SUPABASE_KEY || !GEMINI_KEY) {
  console.error('❌ Missing env vars. Copy .env.local values.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── 1. Extract text from .docx ─────────────────────────────────────────────
async function extractText() {
  console.log('📄 Extracting text from DOCX...');
  const result = await mammoth.extractRawText({ path: DOCX_PATH });
  return result.value;
}

// ── 2. Chunk by section heading ────────────────────────────────────────────
function chunkByHeading(rawText) {
  // Split on lines that look like headings (short, no sentence-ending punctuation)
  const lines = rawText.split(/\r?\n/);
  const chunks = [];
  let currentHeading = 'Einleitung';
  let currentContent = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Detect heading: short line (< 80 chars), doesn't end with period/comma
    const isHeading = trimmed.length < 80
      && !trimmed.endsWith('.')
      && !trimmed.endsWith(',')
      && !trimmed.match(/^\d+\.\s/)   // skip numbered list items that are long
      && trimmed.split(' ').length < 10;

    if (isHeading && currentContent.length > 0) {
      chunks.push({
        heading: currentHeading,
        content: currentContent.join(' ').replace(/\s+/g, ' ').trim(),
      });
      currentHeading = trimmed;
      currentContent = [];
    } else {
      currentContent.push(trimmed);
    }
  }

  // Push last chunk
  if (currentContent.length > 0) {
    chunks.push({
      heading: currentHeading,
      content: currentContent.join(' ').replace(/\s+/g, ' ').trim(),
    });
  }

  // Filter out empty or tiny chunks
  return chunks.filter(c => c.content.length > 50);
}

// ── 3. Get embedding from Gemini ───────────────────────────────────────────
async function embedText(text) {
  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:embedContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: `models/${EMBED_MODEL}`,
        content: { parts: [{ text }] },
        taskType: 'RETRIEVAL_DOCUMENT',
        outputDimensionality: 768,
      }),
    }
  );
  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Gemini embed error: ${err}`);
  }
  const data = await resp.json();
  return data.embedding.values; // number[]
}

// ── 4. Upsert into Supabase ────────────────────────────────────────────────
async function seed() {
  const rawText = await extractText();
  const chunks  = chunkByHeading(rawText);

  console.log(`✂️  Split into ${chunks.length} chunks`);

  // Clear existing rows
  const { error: delError } = await supabase.from('onboarding_embeddings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (delError) console.warn('⚠️ Delete warning:', delError.message);
  else console.log('🗑️  Cleared old embeddings');

  let success = 0;
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const tokens = Math.round(chunk.content.length / 4); // rough estimate

    process.stdout.write(`  [${i + 1}/${chunks.length}] Embedding "${chunk.heading.slice(0, 40)}"... `);

    try {
      const embedding = await embedText(`${chunk.heading}\n\n${chunk.content}`);

      const { error } = await supabase.from('onboarding_embeddings').insert({
        heading:   chunk.heading,
        content:   chunk.content,
        tokens,
        embedding: `[${embedding.join(',')}]`,
      });

      if (error) {
        console.log(`❌ ${error.message}`);
      } else {
        console.log('✅');
        success++;
      }
    } catch (err) {
      console.log(`❌ ${err.message}`);
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n🎉 Done! ${success}/${chunks.length} chunks seeded into onboarding_embeddings.`);
}

seed().catch(console.error);
