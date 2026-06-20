-- Privacy-respecting product analytics + client error tracking.
-- We store the opaque user_id (no email/name/IP) and a random client anon_id so
-- we can measure retention and funnels without identifying anyone. `props` is a
-- small JSON blob, server-validated and size-capped on ingest.
CREATE TABLE IF NOT EXISTS events (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  ts          INTEGER NOT NULL,   -- epoch ms, server-stamped
  day         TEXT    NOT NULL,   -- UTC YYYY-MM-DD, server-derived
  name        TEXT    NOT NULL,   -- e.g. app_open, session_complete, error
  user_id     TEXT,               -- opaque user id when signed in (FK-less, nullable)
  anon_id     TEXT,               -- random client id for logged-out retention
  session_id  TEXT,               -- per-tab client session
  lang        TEXT,               -- study language at the time
  props       TEXT,               -- small JSON blob (capped server-side)
  ua          TEXT                -- coarse hint only: 'mobile' | 'desktop'
);
CREATE INDEX IF NOT EXISTS idx_events_day ON events(day);
CREATE INDEX IF NOT EXISTS idx_events_name_day ON events(name, day);
CREATE INDEX IF NOT EXISTS idx_events_user ON events(user_id);

-- Owner flag so the metrics dashboard can be gated to the account owner without
-- putting an email in the repo or adding another secret. Set to 1 via D1 for the
-- owner account.
ALTER TABLE users ADD COLUMN is_admin INTEGER NOT NULL DEFAULT 0;
