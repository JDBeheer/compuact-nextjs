-- Helper function for updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Admin users table: maps Supabase auth users to CMS roles
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE NOT NULL,  -- references auth.users(id)
  email TEXT NOT NULL,
  naam TEXT,
  rol TEXT NOT NULL DEFAULT 'redacteur' CHECK (rol IN ('beheerder', 'redacteur')),
  actief BOOLEAN DEFAULT true,
  totp_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role admin_users" ON admin_users
  FOR ALL USING (auth.role() = 'service_role');

-- Allow authenticated users to read their own record
CREATE POLICY "Users read own record" ON admin_users
  FOR SELECT USING (auth.uid() = auth_user_id);

CREATE TRIGGER admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
