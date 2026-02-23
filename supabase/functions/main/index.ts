// @ts-nocheck
// main/index.ts - Required router entrypoint for self-hosted Supabase Edge Runtime
// Kong API gateway strips '/functions/v1/' before forwarding to the edge runtime,
// so url.pathname will be just '/gemini-proxy' (not '/functions/v1/gemini-proxy').

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);

  // Extract function name — robust to both full and stripped paths:
  //   /functions/v1/gemini-proxy  -> gemini-proxy
  //   /gemini-proxy               -> gemini-proxy
  const pathParts = url.pathname
    .split('/')
    .filter((p) => p && p !== 'functions' && p !== 'v1');

  const fnName = pathParts[0] ?? null;

  if (!fnName) {
    return new Response(JSON.stringify({ error: 'No function name in path', path: url.pathname }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const module = await import(`./${fnName}/index.ts`);
    const handler = module.default ?? module.handler;
    if (typeof handler !== 'function') {
      throw new Error(`Function "${fnName}" does not export a default handler`);
    }
    return handler(req);
  } catch (e) {
    console.error(`[main] Error routing to "${fnName}":`, e);
    return new Response(JSON.stringify({ error: e.message, function: fnName }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
