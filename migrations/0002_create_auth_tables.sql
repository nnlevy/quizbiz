CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  provider_user_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  avatar_url TEXT,
  created_at TEXT NOT NULL,
  last_login TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_provider_user_id
  ON users (provider_user_id);

CREATE INDEX IF NOT EXISTS idx_users_email
  ON users (email);

CREATE TABLE IF NOT EXISTS auth_sessions (
  session_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id
  ON auth_sessions (user_id);

CREATE INDEX IF NOT EXISTS idx_auth_sessions_expires_at
  ON auth_sessions (expires_at);

CREATE TABLE IF NOT EXISTS oauth_states (
  state TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_oauth_states_expires_at
  ON oauth_states (expires_at);
