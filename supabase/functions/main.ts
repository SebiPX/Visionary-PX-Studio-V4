// @ts-nocheck
// main.ts - Required router entrypoint for self-hosted Supabase Edge Runtime
// The edge runtime starts with this file and routes requests to individual functions.
// See: https://supabase.com/docs/guides/functions/deploy#self-hosting-edge-functions

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);

  // Path format: /functions/v1/<function-name>[/...]
  const parts = url.pathname.split('/functions/v1/');
  const fnName = parts.length > 1 ? parts[1].split('/')[0] : null;

  if (!fnName) {
    return new Response(JSON.stringify({ error: 'No function name in path' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const module = await import(`./${fnName}/index.ts`);
    // Support both default export and named handler export
    const handler = module.default ?? module.handler;
    if (typeof handler !== 'function') {
      throw new Error(`Function ${fnName} does not export a default handler`);
    }
    return handler(req);
  } catch (e) {
    console.error(`[main] Error loading function "${fnName}":`, e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
