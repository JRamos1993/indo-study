-- Lilt social + accounts + cross-device sync schema (Cloudflare D1 / SQLite).
-- Applied with: wrangler d1 migrations apply lilt --local | --remote
-- Design notes:
--   * Timestamps are epoch milliseconds stored as INTEGER.
--   * Booleans are INTEGER 0/1.
--   * The app is offline/local-first; these tables are the cross-device
--     source of truth, reconciled last-write-wins per row by updated_at.
--   * Privacy: social tables (circle_activity) hold only aggregate counts,
--     never item ids, answers, or grades.

-- ── Accounts ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,                  -- uuid
  email         TEXT NOT NULL,
  email_norm    TEXT NOT NULL UNIQUE,              -- lower(trim(email)) for lookup
  password_hash TEXT NOT NULL,                     -- base64 PBKDF2-SHA256 derived key
  password_salt TEXT NOT NULL,                     -- base64 per-user salt
  password_iter INTEGER NOT NULL DEFAULT 210000,   -- iteration count (rehash on change)
  display_name  TEXT NOT NULL,
  handle        TEXT UNIQUE,                        -- @handle for Circle (nullable until set)
  created_at    INTEGER NOT NULL,
  updated_at    INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id          TEXT PRIMARY KEY,                    -- sha256(opaque token) — token never stored
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  INTEGER NOT NULL,
  expires_at  INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL,
  user_agent  TEXT
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- ── Per-user settings (mirrors lib/settings.ts) ──────────────────────────────
CREATE TABLE IF NOT EXISTS user_settings (
  user_id           TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  study_language    TEXT NOT NULL DEFAULT 'id',
  daily_goal        INTEGER NOT NULL DEFAULT 20,    -- card count (legacy)
  daily_goal_minutes INTEGER NOT NULL DEFAULT 10,   -- minutes preset (5/10/15/30)
  new_per_day       INTEGER NOT NULL DEFAULT 15,
  target_retention  REAL NOT NULL DEFAULT 0.9,
  default_direction TEXT NOT NULL DEFAULT 'auto',   -- 'auto' | 'id2en' | 'en2id'
  theme             TEXT NOT NULL DEFAULT 'system', -- 'system' | 'light' | 'dark'
  learning_focus    TEXT NOT NULL DEFAULT 'balanced',
  share_activity    INTEGER NOT NULL DEFAULT 1,     -- share aggregate activity with circles
  updated_at        INTEGER NOT NULL
);

-- ── Progress sync (FSRS card state, one row per user+item) ───────────────────
CREATE TABLE IF NOT EXISTS card_states (
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id       TEXT NOT NULL,                      -- e.g. 'u01-greetings-s1-i1'
  stability     REAL NOT NULL,
  difficulty    REAL NOT NULL,
  due_at        INTEGER NOT NULL,
  last_reviewed INTEGER,                            -- null = new/unseen
  reps          INTEGER NOT NULL DEFAULT 0,
  lapses        INTEGER NOT NULL DEFAULT 0,
  updated_at    INTEGER NOT NULL,                   -- LWW reconciliation key
  PRIMARY KEY (user_id, item_id)
);
CREATE INDEX IF NOT EXISTS idx_cards_user ON card_states(user_id);
CREATE INDEX IF NOT EXISTS idx_cards_user_due ON card_states(user_id, due_at);

-- ── Daily activity (drives streak, progress page, leaderboard projection) ────
CREATE TABLE IF NOT EXISTS daily_activity (
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day        TEXT NOT NULL,                         -- 'YYYY-MM-DD' (user-local)
  reviews    INTEGER NOT NULL DEFAULT 0,
  new_count  INTEGER NOT NULL DEFAULT 0,
  minutes    INTEGER NOT NULL DEFAULT 0,            -- capped server-side (<=1440)
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, day)
);
CREATE INDEX IF NOT EXISTS idx_activity_user ON daily_activity(user_id);

-- ── Friends ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS friendships (
  id           TEXT PRIMARY KEY,
  requester_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  addressee_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','blocked')),
  created_at   INTEGER NOT NULL,
  updated_at   INTEGER NOT NULL,
  UNIQUE (requester_id, addressee_id)
);
CREATE INDEX IF NOT EXISTS idx_friend_addressee ON friendships(addressee_id, status);
CREATE INDEX IF NOT EXISTS idx_friend_requester ON friendships(requester_id, status);

CREATE TABLE IF NOT EXISTS invites (
  code        TEXT PRIMARY KEY,                     -- short shareable code
  inviter_id  TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  INTEGER NOT NULL,
  expires_at  INTEGER NOT NULL,
  accepted_by TEXT REFERENCES users(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_invites_inviter ON invites(inviter_id);

-- ── Circles (small study groups) ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS circles (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  owner_id   TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  join_code  TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS circle_members (
  circle_id TEXT NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  user_id   TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role      TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner','member')),
  joined_at INTEGER NOT NULL,
  PRIMARY KEY (circle_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_circle_members_user ON circle_members(user_id);

CREATE TABLE IF NOT EXISTS circle_goals (
  circle_id    TEXT NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  week_start   TEXT NOT NULL,                        -- ISO Monday 'YYYY-MM-DD'
  target_words INTEGER NOT NULL,
  created_at   INTEGER NOT NULL,
  PRIMARY KEY (circle_id, week_start)
);

-- Aggregate-only activity projection for leaderboards / "studied today".
-- Never contains item ids, answers, or grades.
CREATE TABLE IF NOT EXISTS circle_activity (
  circle_id  TEXT NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day        TEXT NOT NULL,
  reviews    INTEGER NOT NULL DEFAULT 0,
  minutes    INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (circle_id, user_id, day)
);
CREATE INDEX IF NOT EXISTS idx_circle_activity_day ON circle_activity(circle_id, day);

-- ── Rate limiting (auth endpoints) ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rate_limits (
  key          TEXT PRIMARY KEY,                    -- e.g. 'login:<ip>' or 'signup:<ip>'
  count        INTEGER NOT NULL DEFAULT 0,
  window_start INTEGER NOT NULL                     -- epoch ms of current window
);
