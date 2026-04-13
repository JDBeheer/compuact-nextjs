-- ============================================================
-- Migration 005: Error Logs & Redirects
-- ============================================================

CREATE TABLE IF NOT EXISTS error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip TEXT,
  count INT DEFAULT 1,
  first_seen TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS redirects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_path TEXT UNIQUE NOT NULL,
  to_path TEXT NOT NULL,
  status_code INT DEFAULT 301,
  actief BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE redirects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role error_logs" ON error_logs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Anon insert error_logs" ON error_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read redirects" ON redirects FOR SELECT USING (actief = true);
CREATE POLICY "Service role redirects" ON redirects FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_error_logs_path ON error_logs(path);
CREATE INDEX IF NOT EXISTS idx_error_logs_last_seen ON error_logs(last_seen DESC);
CREATE INDEX IF NOT EXISTS idx_redirects_from ON redirects(from_path);
