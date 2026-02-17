import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { GeneratedImage, GeneratedVideo, GeneratedThumbnail, ChatSession, GeneratedText, GeneratedSketch } from '../lib/database.types';

type ContentType = 'image' | 'video' | 'thumbnail' | 'text' | 'sketch';

interface SaveImageData {
    prompt: string;
    style?: string;
    image_url: string;
    config?: Record<string, any>;
}

interface SaveVideoData {
    prompt: string;
    model?: string;
    video_url: string;
    thumbnail_url?: string;
    config?: Record<string, any>;
}

interface SaveThumbnailData {
    prompt: string;
    platform?: string;
    image_url: string;
    config?: Record<string, any>;
}

interface SaveChatData {
    title: string;
    bot_id: string;
    messages: Array<{ role: 'user' | 'assistant'; content: string }>;
}

interface SaveTextData {
    content: string;
    topic?: string;
    platform?: string;
    audience?: string;
    tone?: string;
    config?: Record<string, any>;
}

interface SaveSketchData {
    sketch_data: string;
    generated_image_url: string;
    context: string;
    style: string;
    edit_history?: any[];
}

export const useGeneratedContent = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Save generated image
    const saveImage = async (data: SaveImageData) => {
        setLoading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { error: insertError } = await supabase
                .from('generated_images')
                .insert({
                    user_id: user.id,
                    prompt: data.prompt,
                    style: data.style || null,
                    image_url: data.image_url,
                    config: data.config || {},
                });

            if (insertError) throw insertError;
            return { success: true };
        } catch (err: any) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Save generated video
    const saveVideo = async (data: SaveVideoData) => {
        setLoading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { error: insertError } = await supabase
                .from('generated_videos')
                .insert({
                    user_id: user.id,
                    prompt: data.prompt,
                    model: data.model || null,
                    video_url: data.video_url,
                    thumbnail_url: data.thumbnail_url || null,
                    config: data.config || {},
                });

            if (insertError) throw insertError;
            return { success: true };
        } catch (err: any) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Save generated thumbnail
    const saveThumbnail = async (data: SaveThumbnailData) => {
        setLoading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { error: insertError } = await supabase
                .from('generated_thumbnails')
                .insert({
                    user_id: user.id,
                    prompt: data.prompt,
                    platform: data.platform || null,
                    image_url: data.image_url,
                    config: data.config || {},
                });

            if (insertError) throw insertError;
            return { success: true };
        } catch (err: any) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Save chat session
    const saveChat = async (data: SaveChatData) => {
        setLoading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { error: insertError } = await supabase
                .from('chat_sessions')
                .insert({
                    user_id: user.id,
                    title: data.title,
                    bot_id: data.bot_id,
                    messages: data.messages,
                });

            if (insertError) throw insertError;
            return { success: true };
        } catch (err: any) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Save generated text
    const saveText = async (data: SaveTextData) => {
        setLoading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { error: insertError } = await supabase
                .from('generated_texts')
                .insert({
                    user_id: user.id,
                    content: data.content,
                    topic: data.topic || null,
                    platform: data.platform || null,
                    audience: data.audience || null,
                    tone: data.tone || null,
                    config: data.config || {},
                });

            if (insertError) throw insertError;
            return { success: true };
        } catch (err: any) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Load chat sessions
    const loadChatSessions = async (limit = 50) => {
        setLoading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data, error: fetchError } = await supabase
                .from('chat_sessions')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (fetchError) throw fetchError;

            return { success: true, data };
        } catch (err: any) {
            setError(err.message);
            return { success: false, error: err.message, data: [] };
        } finally {
            setLoading(false);
        }
    };

    // Load history for a specific content type
    const loadHistory = async (type: ContentType, limit = 50) => {
        setLoading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const tableName = type === 'image'
                ? 'generated_images'
                : type === 'video'
                    ? 'generated_videos'
                    : type === 'thumbnail'
                        ? 'generated_thumbnails'
                        : type === 'sketch'
                            ? 'generated_sketches'
                            : 'generated_texts';

            const { data, error: fetchError } = await supabase
                .from(tableName)
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (fetchError) throw fetchError;

            return { success: true, data };
        } catch (err: any) {
            setError(err.message);
            return { success: false, error: err.message, data: [] };
        } finally {
            setLoading(false);
        }
    };

    // Delete content by ID
    const deleteContent = async (id: string, type: ContentType) => {
        setLoading(true);
        setError(null);

        try {
            const tableName = type === 'image'
                ? 'generated_images'
                : type === 'video'
                    ? 'generated_videos'
                    : type === 'thumbnail'
                        ? 'generated_thumbnails'
                        : type === 'sketch'
                            ? 'generated_sketches'
                            : 'generated_texts';

            const { error: deleteError } = await supabase
                .from(tableName)
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;
            return { success: true };
        } catch (err: any) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Save generated sketch
    const saveSketch = async (data: SaveSketchData) => {
        setLoading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { error: insertError } = await supabase
                .from('generated_sketches')
                .insert({
                    user_id: user.id,
                    sketch_data: data.sketch_data,
                    generated_image_url: data.generated_image_url,
                    context: data.context,
                    style: data.style,
                    edit_history: data.edit_history || [],
                });

            if (insertError) throw insertError;
            return { success: true };
        } catch (err: any) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Load sketch history
    const loadSketchHistory = async (limit: number = 20): Promise<GeneratedSketch[]> => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('generated_sketches')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data || [];
        } catch (err: any) {
            console.error('Error loading sketch history:', err);
            return [];
        }
    };

    return {
        loading,
        error,
        saveImage,
        saveVideo,
        saveThumbnail,
        saveText,
        saveChat,
        saveSketch,
        loadChatSessions,
        loadHistory,
        loadSketchHistory,
        deleteContent,
    };
};
