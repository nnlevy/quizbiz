CREATE TABLE IF NOT EXISTS utility_directory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  utility_name TEXT NOT NULL,
  city TEXT,
  state TEXT,
  county TEXT,
  service_area TEXT,
  website_url TEXT,
  billing_url TEXT,
  phone_number TEXT,
  oversight_department TEXT,
  oversight_url TEXT,
  assistance_url TEXT,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_utility_directory_name
  ON utility_directory (utility_name);

CREATE INDEX IF NOT EXISTS idx_utility_directory_location
  ON utility_directory (city, state, county);
