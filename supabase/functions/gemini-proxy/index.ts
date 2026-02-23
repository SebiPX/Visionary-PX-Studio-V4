import "@supabase/functions-js/edge-runtime.d.ts"
import { GoogleGenAI } from "npm:@google/genai";
import { createClient } from "npm:@supabase/supabase-js";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Verify user (Optional but good for security)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    // Use anon key for user verification, but this is an edge function, so maybe it's configured automatically.
    // Deno edge functions run with SUPABASE_URL and SUPABASE_ANON_KEY injected
    const supabase = createClient(supabaseUrl, supabaseKey);
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
       return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const payload = await req.json()
    const { action, ...options } = payload;
    const apiKey = Deno.env.get('GEMINI_API_KEY');

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in Edge Function secrets.");
    }

    const ai = new GoogleGenAI({ apiKey });

    let result;

    if (action === 'generateContent') {
         // Chat, Text, Image, Sketch uses generateContent
         result = await ai.models.generateContent({
            model: options.model,
            contents: options.contents,
            config: options.config,
            systemInstruction: options.systemInstruction // used in some places
         });
    } else if (action === 'generateVideos') {
         // VideoStudio
         result = await ai.models.generateVideos({
            model: options.model,
            prompt: options.prompt,
            image: options.image,
            config: options.config
         });
    } else if (action === 'getVideosOperation') {
         // Polling videos
         result = await ai.operations.getVideosOperation({ operation: options.operation });
    } else if (action === 'embedContent') {
         const model = ai.models;
         result = await model.embedContent({
             model: options.model,
             contents: options.contents
         });
    } else if (action === 'chatCreate') {
         // Unfortunately `create` returns an object with methods in the SDK (`sendMessageStream`). 
         // We can't maintain stateful chat objects across serverless executions like this easily,
         // We must adapt the proxy to handle stateless chats by sending full message history 
         // instead of using `.chats.create()`. 
         // In frontend ChatBot, we might have to refactor to send full history.
         throw new Error("Stateful chats via proxy not supported yet");
    } else {
        throw new Error(`Unknown action: ${action}`);
    }

    // Convert complex SDK objects to standard objects to be JSON serialized
    const serializedResult = JSON.parse(JSON.stringify(result));

    return new Response(
      JSON.stringify(serializedResult),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  } catch (err: any) {
    console.error("Function error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
})
