-- Web Push subscriptions for due-review reminders. We send no-payload pushes
-- (VAPID-authorized only), so p256dh/auth aren't strictly required, but we keep
-- them for forward-compat. tz_offset (JS getTimezoneOffset, minutes: UTC = local
-- + offset) lets the hourly cron fire at the user's local reminder_hour.
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       TEXT    NOT NULL,
  endpoint      TEXT    NOT NULL UNIQUE,
  p256dh        TEXT,
  auth          TEXT,
  tz_offset     INTEGER NOT NULL DEFAULT 0,
  reminder_hour INTEGER NOT NULL DEFAULT 19,
  created_at    INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_push_user ON push_subscriptions(user_id);
