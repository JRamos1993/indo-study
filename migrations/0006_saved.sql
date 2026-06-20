-- Phrases the learner saves from AI conversations. The SRS state for each lives
-- in card_states (keyed by the same id); this table carries the phrase text so
-- it can be reconstructed on any device.
CREATE TABLE IF NOT EXISTS saved_phrases (
  user_id TEXT NOT NULL,
  id TEXT NOT NULL,
  target TEXT NOT NULL,
  en TEXT NOT NULL DEFAULT '',
  lang TEXT NOT NULL DEFAULT 'id',
  ts INTEGER NOT NULL,
  PRIMARY KEY (user_id, id)
);

CREATE INDEX IF NOT EXISTS idx_saved_user ON saved_phrases (user_id);
