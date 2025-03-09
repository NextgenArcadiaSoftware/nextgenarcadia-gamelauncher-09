
-- Create a bucket for game thumbnails
INSERT INTO storage.buckets (id, name, public)
VALUES ('game-thumbnails', 'Game Thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Set very permissive policies for the game-thumbnails bucket for testing
CREATE POLICY "Public Access Policy for Game Thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'game-thumbnails');

CREATE POLICY "Public Insert Policy for Game Thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'game-thumbnails');

CREATE POLICY "Public Update Policy for Game Thumbnails"
ON storage.objects FOR UPDATE
USING (bucket_id = 'game-thumbnails');

CREATE POLICY "Public Delete Policy for Game Thumbnails"
ON storage.objects FOR DELETE
USING (bucket_id = 'game-thumbnails');
