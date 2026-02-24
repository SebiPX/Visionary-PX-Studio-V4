// @ts-nocheck
// main/gemini-proxy.ts
// Gemini API proxy handler — lives inside main/ so it gets compiled by the edge runtime.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY not set in edge function secrets' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { action, model, contents, config, systemInstruction, tools, prompt, image, operation } = body;

    // ---- generateContent (text, images, sketch) ----
    if (action === 'generateContent') {
      const url = `${GEMINI_BASE}/models/${model}:generateContent?key=${apiKey}`;
      const geminiBody: any = { contents };
      if (systemInstruction) {
        geminiBody.systemInstruction = { parts: [{ text: systemInstruction }] };
      }
      if (config) {
        geminiBody.generationConfig = config;
      }
      if (tools) {
        geminiBody.tools = tools;
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiBody),
      });
      const result = await res.json();
      if (!res.ok) {
        return new Response(
          JSON.stringify({ error: result?.error?.message || 'Gemini API error', details: result }),
          { status: res.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ---- generateVideos (VideoStudio) ----
    if (action === 'generateVideos') {
      const url = `${GEMINI_BASE}/models/${model}:predictLongRunning?key=${apiKey}`;
      const geminiBody: any = {
        instances: [{ prompt, ...(image ? { image } : {}) }],
        parameters: config || {},
      };
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiBody),
      });
      const result = await res.json();
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ---- getVideosOperation (polling) ----
    if (action === 'getVideosOperation') {
      const url = `${GEMINI_BASE}/${operation?.name}?key=${apiKey}`;
      const res = await fetch(url);
      const result = await res.json();
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ---- embedContent (ChatBot RAG) ----
    if (action === 'embedContent') {
      const url = `${GEMINI_BASE}/models/${model}:embedContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: { parts: [{ text: contents }] } }),
      });
      const result = await res.json();
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({ error: `Unknown action: ${action}` }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('gemini-proxy error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
