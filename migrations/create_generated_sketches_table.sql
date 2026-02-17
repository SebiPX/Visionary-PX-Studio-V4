-- Create generated_sketches table for Sketch Studio
CREATE TABLE IF NOT EXISTS generated_sketches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Sketch data (base64 encoded canvas image)
    sketch_data TEXT NOT NULL,
    
    -- Generated image (base64 or storage URL)
    generated_image_url TEXT,
    
    -- Generation settings
    context TEXT NOT NULL,
    style TEXT NOT NULL,
    
    -- Edit history (array of edit instructions)
    edit_history JSONB DEFAULT '[]'::jsonb,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_generated_sketches_user_id ON generated_sketches(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_sketches_created_at ON generated_sketches(created_at DESC);

-- Enable Row Level Security
ALTER TABLE generated_sketches ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own sketches"
    ON generated_sketches FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sketches"
    ON generated_sketches FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sketches"
    ON generated_sketches FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sketches"
    ON generated_sketches FOR DELETE
    USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_generated_sketches_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_generated_sketches_updated_at
    BEFORE UPDATE ON generated_sketches
    FOR EACH ROW
    EXECUTE FUNCTION update_generated_sketches_updated_at();
