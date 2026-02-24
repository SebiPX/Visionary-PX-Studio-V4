// @ts-nocheck
// main/index.ts - Router for self-hosted Supabase Edge Runtime
// All handlers must live inside main/ so the edge runtime compiles them.
// Kong strips '/functions/v1/' before forwarding, so pathname is '/gemini-proxy'.

import geminiProxyHandler from './gemini-proxy.ts';

const HANDLERS = {
  'gemini-proxy': geminiProxyHandler,
};

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);

  // Extract function name — robust to both full and stripped paths:
  //   /functions/v1/gemini-proxy  -> gemini-proxy
  //   /gemini-proxy               -> gemini-proxy
  const pathParts = url.pathname
    .split('/')
    .filter((p) => p && p !== 'functions' && p !== 'v1');

  const fnName = pathParts[0] ?? null;

  if (!fnName || !HANDLERS[fnName]) {
    return new Response(
      JSON.stringify({ error: 'Function not found', path: url.pathname, available: Object.keys(HANDLERS) }),
      { status: 404, headers: { 'Content-Type': 'application/json' } },
    );
  }

  try {
    return await HANDLERS[fnName](req);
  } catch (e) {
    console.error(`[main] Error in "${fnName}":`, e);
    return new Response(JSON.stringify({ error: e.message, function: fnName }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
