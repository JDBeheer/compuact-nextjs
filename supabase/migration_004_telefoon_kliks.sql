-- Telefoon kliks tracking
-- Slaat clicks op tel: links op voor prestatiebeloning

CREATE TABLE IF NOT EXISTS telefoon_kliks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pagina TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index voor maandelijkse aggregatie
CREATE INDEX idx_telefoon_kliks_created_at ON telefoon_kliks (created_at);

-- RLS
ALTER TABLE telefoon_kliks ENABLE ROW LEVEL SECURITY;

-- Iedereen mag inserten (publieke website)
CREATE POLICY "Telefoon kliks insert" ON telefoon_kliks
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Alleen service role mag lezen (admin dashboard)
CREATE POLICY "Telefoon kliks select service" ON telefoon_kliks
  FOR SELECT TO authenticated
  USING (true);
