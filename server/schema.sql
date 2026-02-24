PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- ── Team Members ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team_members (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  color      TEXT NOT NULL,
  created_at TEXT NOT NULL   -- ISO 8601
);

-- ── Chore Templates ───────────────────────────────────────────────────────────
-- RecurrenceRule is stored flat (no separate table) for simplicity.
-- recurrence_days_of_week is a JSON array string (e.g. "[1,3,5]"), nullable.
CREATE TABLE IF NOT EXISTS chore_templates (
  id                        TEXT PRIMARY KEY,
  name                      TEXT NOT NULL,
  description               TEXT NOT NULL DEFAULT '',
  assignee_id               TEXT REFERENCES team_members(id) ON DELETE SET NULL,
  recurrence_frequency      TEXT NOT NULL DEFAULT 'none'
                              CHECK(recurrence_frequency IN ('none','daily','weekly','monthly')),
  recurrence_days_of_week   TEXT,           -- JSON array | NULL
  recurrence_day_of_month   INTEGER,        -- 1-31 | NULL
  recurrence_end_date       TEXT,           -- YYYY-MM-DD | NULL
  start_date                TEXT NOT NULL,  -- YYYY-MM-DD
  deleted_at                TEXT,           -- ISO 8601 | NULL (soft-delete)
  created_at                TEXT NOT NULL,
  updated_at                TEXT NOT NULL
);

-- ── Occurrence Overrides ──────────────────────────────────────────────────────
-- Key format: "{templateId}::{YYYY-MM-DD}" (matches OccurrenceKey in TS)
CREATE TABLE IF NOT EXISTS occurrence_overrides (
  key              TEXT PRIMARY KEY,   -- "{templateId}::{YYYY-MM-DD}"
  template_id      TEXT NOT NULL REFERENCES chore_templates(id) ON DELETE CASCADE,
  original_date    TEXT NOT NULL,      -- YYYY-MM-DD
  rescheduled_date TEXT,               -- YYYY-MM-DD | NULL
  completed        INTEGER NOT NULL DEFAULT 0,  -- 0 | 1
  completed_by     TEXT REFERENCES team_members(id) ON DELETE SET NULL,
  completed_at     TEXT,               -- ISO 8601 | NULL
  skipped          INTEGER NOT NULL DEFAULT 0,  -- 0 | 1
  completion_note  TEXT NOT NULL DEFAULT ''
);

-- ── Audit Log ─────────────────────────────────────────────────────────────────
-- metadata stored as JSON string.
-- chore_template_id / actor_member_id use SET NULL so log entries survive
-- deletion of the referenced row.
CREATE TABLE IF NOT EXISTS audit_log (
  id                 TEXT PRIMARY KEY,
  timestamp          TEXT NOT NULL,   -- ISO 8601
  action             TEXT NOT NULL    -- AuditAction enum value
                       CHECK(action IN (
                         'completed','uncompleted','rescheduled','skipped',
                         'chore_created','chore_updated','chore_deleted',
                         'member_added','member_removed'
                       )),
  chore_template_id  TEXT REFERENCES chore_templates(id) ON DELETE SET NULL,
  chore_name         TEXT NOT NULL,
  occurrence_key     TEXT,            -- NULL when action is not occurrence-specific
  occurrence_date    TEXT,            -- YYYY-MM-DD | NULL
  actor_member_id    TEXT REFERENCES team_members(id) ON DELETE SET NULL,
  actor_name         TEXT,            -- snapshot at time of action
  metadata           TEXT NOT NULL DEFAULT '{}'   -- JSON
);

-- ── Indexes ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_chore_templates_assignee
  ON chore_templates(assignee_id);

CREATE INDEX IF NOT EXISTS idx_chore_templates_deleted
  ON chore_templates(deleted_at);

CREATE INDEX IF NOT EXISTS idx_occurrence_overrides_template
  ON occurrence_overrides(template_id);

CREATE INDEX IF NOT EXISTS idx_occurrence_overrides_original_date
  ON occurrence_overrides(original_date);

CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp
  ON audit_log(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_audit_log_chore
  ON audit_log(chore_template_id);
