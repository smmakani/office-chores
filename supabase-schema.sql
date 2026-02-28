-- Supabase/PostgreSQL schema for Office Chores
-- Run this in Supabase SQL Editor to create tables

-- Team Members
CREATE TABLE IF NOT EXISTS team_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- Chore Templates
CREATE TABLE IF NOT EXISTS chore_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  assignee_id TEXT REFERENCES team_members(id) ON DELETE SET NULL,
  recurrence_frequency TEXT NOT NULL DEFAULT 'none'
    CHECK(recurrence_frequency IN ('none','daily','weekly','monthly')),
  recurrence_days_of_week TEXT,  -- JSON array
  recurrence_day_of_month INTEGER,
  recurrence_end_date TEXT,
  start_date TEXT NOT NULL,
  deleted_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Occurrence Overrides
CREATE TABLE IF NOT EXISTS occurrence_overrides (
  key TEXT PRIMARY KEY,
  template_id TEXT NOT NULL REFERENCES chore_templates(id) ON DELETE CASCADE,
  original_date TEXT NOT NULL,
  rescheduled_date TEXT,
  completed INTEGER NOT NULL DEFAULT 0,
  completed_by TEXT REFERENCES team_members(id) ON DELETE SET NULL,
  completed_at TEXT,
  skipped INTEGER NOT NULL DEFAULT 0,
  completion_note TEXT NOT NULL DEFAULT ''
);

-- Audit Log
CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  action TEXT NOT NULL
    CHECK(action IN (
      'completed','uncompleted','rescheduled','skipped',
      'chore_created','chore_updated','chore_deleted',
      'member_added','member_removed'
    )),
  chore_template_id TEXT REFERENCES chore_templates(id) ON DELETE SET NULL,
  chore_name TEXT NOT NULL,
  occurrence_key TEXT,
  occurrence_date TEXT,
  actor_member_id TEXT REFERENCES team_members(id) ON DELETE SET NULL,
  actor_name TEXT,
  metadata TEXT NOT NULL DEFAULT '{}'
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_chore_templates_assignee ON chore_templates(assignee_id);
CREATE INDEX IF NOT EXISTS idx_chore_templates_deleted ON chore_templates(deleted_at);
CREATE INDEX IF NOT EXISTS idx_occurrence_overrides_template ON occurrence_overrides(template_id);
CREATE INDEX IF NOT EXISTS idx_occurrence_overrides_original_date ON occurrence_overrides(original_date);
CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON audit_log(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_chore ON audit_log(chore_template_id);

-- Enable Row Level Security (optional - adjust as needed)
-- ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE chore_templates ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE occurrence_overrides ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
