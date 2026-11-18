CREATE TABLE IF NOT EXISTS analysis_password_attempt (
    account_key TEXT PRIMARY KEY,
    window_start TIMESTAMPTZ NOT NULL,
    attempts INTEGER NOT NULL CHECK (attempts > 0)
);
