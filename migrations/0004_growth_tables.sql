CREATE TABLE IF NOT EXISTS growth_events (
  id TEXT PRIMARY KEY,
  ts INTEGER NOT NULL,
  event_type TEXT NOT NULL,
  platform TEXT,
  session_id TEXT,
  user_id TEXT,
  ip_hash TEXT,
  user_agent_hash TEXT,
  ref_code TEXT,
  share_token_id TEXT,
  page TEXT,
  meta_json TEXT
);

CREATE TABLE IF NOT EXISTS share_tokens (
  id TEXT PRIMARY KEY,
  created_ts INTEGER NOT NULL,
  expires_ts INTEGER NOT NULL,
  platform TEXT NOT NULL,
  variant_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  user_id TEXT,
  ip_hash TEXT,
  state TEXT NOT NULL,
  finalize_ts INTEGER,
  finalize_reason TEXT,
  ref_code TEXT NOT NULL,
  credits_awarded INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS credit_awards_ledger (
  id TEXT PRIMARY KEY,
  ts INTEGER NOT NULL,
  award_type TEXT NOT NULL,
  platform TEXT,
  user_id TEXT,
  session_id TEXT,
  share_token_id TEXT,
  credits INTEGER NOT NULL,
  status TEXT NOT NULL,
  reason TEXT,
  date_bucket TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS referral_attribution (
  id TEXT PRIMARY KEY,
  ts INTEGER NOT NULL,
  ref_code TEXT NOT NULL,
  landing_path TEXT NOT NULL,
  session_id TEXT NOT NULL,
  user_id TEXT,
  ip_hash TEXT,
  first_seen_ts INTEGER NOT NULL,
  last_seen_ts INTEGER NOT NULL,
  conversions INTEGER DEFAULT 0
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_share_tokens_ref_code
  ON share_tokens(ref_code);

CREATE INDEX IF NOT EXISTS idx_growth_events_type_ts
  ON growth_events(event_type, ts);

CREATE UNIQUE INDEX IF NOT EXISTS idx_credit_awards_user_bucket
  ON credit_awards_ledger(award_type, platform, user_id, date_bucket)
  WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_credit_awards_session_bucket
  ON credit_awards_ledger(award_type, platform, session_id, date_bucket)
  WHERE session_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_referral_attribution_unique
  ON referral_attribution(ref_code, session_id);
