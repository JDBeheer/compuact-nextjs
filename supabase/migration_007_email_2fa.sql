-- Email 2FA: add email_2fa_enabled to admin_users
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS email_2fa_enabled BOOLEAN DEFAULT false;

-- Table to store email 2FA verification codes
CREATE TABLE IF NOT EXISTS email_2fa_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE email_2fa_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role email_2fa_codes" ON email_2fa_codes
  FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX idx_email_2fa_codes_lookup
  ON email_2fa_codes (auth_user_id, code, used, expires_at);
