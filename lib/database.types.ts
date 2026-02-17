// TypeScript types for Supabase database schema
// Generated from schema.sql

export interface Profile {
    id: string; // UUID
    created_at: string; // ISO timestamp
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    role: string | null;
    billable_hourly_rate: number | null;
    internal_cost_per_hour: number | null;
    weekly_hours: number | null;
    client_id: string | null;
}

export interface ChatSession {
    id: string; // UUID
    user_id: string; // UUID
    title: string | null;
    bot_id: string | null;
    messages: Message[];
    created_at: string;
    updated_at: string;
}

export interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

export interface StoryAsset {
    id: string;
    type: 'actor' | 'environment' | 'product';
    name: string;
    description: string;
    image_url: string;
    source: 'upload' | 'ai-generated';
    created_at: string;
}

export interface StoryShot {
    id: string;
    order: number;

    // Basis-Informationen
    scene_number: string; // z.B. "4A"
    title: string; // Kurzbeschreibung
    description: string; // Was passiert in diesem Moment
    location: string; // Wo wird gedreht (Innen/Außen, spezifischer Ort)

    // Visuelle Gestaltung (Kamera & Bild)
    framing: string; // Einstellungsgröße: 'wide-shot' | 'medium-shot' | 'close-up' | 'extreme-close-up' | 'establishing'
    camera_angle: string; // 'eye-level' | 'high-angle' | 'low-angle' | 'birds-eye' | 'dutch-angle'
    camera_movement: string; // 'static' | 'pan' | 'tilt' | 'dolly' | 'zoom' | 'handheld' | 'gimbal' | 'crane'
    focal_length: string; // Objektiv/Brennweite z.B. "24mm", "50mm", "85mm"

    // Technische & Logistische Details
    lighting: string; // 'day' | 'night' | 'artificial' | 'natural' | 'mixed'
    equipment: string; // Benötigtes Equipment
    audio_notes: string; // Dialog, MOS (Motor Only Shot), etc.
    estimated_duration: number; // Voraussichtliche Dauer in Minuten

    // Storyboard-spezifisch
    movement_notes: string; // Pfeile für Bewegung (Kamera oder Schauspieler)
    vfx_notes: string; // Green Screen, digitale Effekte

    // Asset-Referenzen
    actors: string[]; // Asset IDs
    environment: string; // Asset ID
    products: string[]; // Asset IDs

    // Zusätzliche Notizen
    notes: string;
    image_url?: string; // Optional: Skizze/Preview

    duration: number; // Shot-Dauer in Sekunden (für Timeline)
    created_at: string;
}

export interface StoryboardSession {
    id: string;
    user_id: string;
    title: string | null;
    concept: string | null;
    target_duration: number | null;
    num_shots: number | null;
    config: {
        story_text?: string;
        genre?: string;
        mood?: string;
        target_audience?: string;
        [key: string]: any;
    };
    assets: StoryAsset[];
    shots: StoryShot[];
    created_at: string;
    updated_at: string;
}

export interface GeneratedImage {
    id: string;
    user_id: string;
    prompt: string | null;
    style: string | null;
    image_url: string;
    config: {
        aspectRatio?: string;
        mode?: string;
        referenceImage?: string;
        [key: string]: any;
    };
    created_at: string;
}

export interface GeneratedVideo {
    id: string;
    user_id: string;
    prompt: string | null;
    model: string | null;
    video_url: string;
    thumbnail_url: string | null;
    config: {
        duration?: number;
        aspectRatio?: string;
        cameraMovement?: string;
        [key: string]: any;
    };
    created_at: string;
}

export interface GeneratedThumbnail {
    id: string;
    user_id: string;
    prompt: string | null;
    platform: string | null;
    image_url: string;
    config: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface GeneratedText {
    id: string;
    user_id: string;
    content: string;
    topic: string | null;
    platform: string | null;
    audience: string | null;
    tone: string | null;
    config: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface GeneratedSketch {
    id: string;
    user_id: string;
    sketch_data: string;
    generated_image_url: string | null;
    context: string;
    style: string;
    edit_history: any[];
    created_at: string;
    updated_at: string;
}

// Database table names
export type Tables =
    | 'profiles'
    | 'chat_sessions'
    | 'storyboard_sessions'
    | 'generated_images'
    | 'generated_videos'
    | 'generated_thumbnails'
    | 'generated_sketches';

