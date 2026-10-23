ALTER TABLE enquiry_limits ADD COLUMN expires_at INTEGER NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS enquiry_limits_expiry ON enquiry_limits(expires_at);
