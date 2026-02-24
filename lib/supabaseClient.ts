import { createClient } from '@supabase/supabase-js';

// Get environment variables (Vite uses import.meta.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

console.log('🔧 Initializing Supabase client');
console.log('   URL:', supabaseUrl);

// Create Supabase client with optimized settings
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
        flowType: 'pkce', // Use PKCE flow for better security
    },
    global: {
        headers: {
            'X-Client-Info': 'visionary-px-studio@1.0.0',
        },
    },
});

console.log('✅ Supabase client ready');

/**
 * Converts an internal Supabase Storage URL (http://host:8000/storage/...)
 * to the public HTTPS URL (https://host/storage/...) served by Nginx Proxy Manager.
 * Falls back to VITE_SUPABASE_PUBLIC_URL if provided.
 */
export const normalizeStorageUrl = (url: string): string => {
    // Allow explicit override via env var
    const publicBase = import.meta.env.VITE_SUPABASE_PUBLIC_URL as string | undefined;
    if (publicBase) {
        return url.replace(supabaseUrl, publicBase);
    }
    // Auto-normalize: http://host:PORT/... → https://host/...
    return url.replace(/^http:\/\/([^/:]+):\d+(\/.*)?$/, 'https://$1$2');
};

