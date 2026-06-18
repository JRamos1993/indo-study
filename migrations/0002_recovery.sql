-- Password recovery: a high-entropy recovery key (shown once at signup) whose
-- SHA-256 is stored here, so a user who forgets their password can reset it
-- without email infrastructure.
ALTER TABLE users ADD COLUMN recovery_hash TEXT;
