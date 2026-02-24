import type { TeamMember, ChoreTemplate, OccurrenceOverride, AuditLogEntry, AuditAction, RecurrenceFrequency } from '../src/types/index.js';

// ── DB row shapes ─────────────────────────────────────────────────────────────

interface MemberRow {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

interface ChoreRow {
  id: string;
  name: string;
  description: string;
  assignee_id: string | null;
  recurrence_frequency: RecurrenceFrequency;
  recurrence_days_of_week: number[] | null;
  recurrence_day_of_month: number | null;
  recurrence_end_date: string | null;
  start_date: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface OccurrenceRow {
  key: string;
  template_id: string;
  original_date: string;
  rescheduled_date: string | null;
  completed: boolean;
  completed_by: string | null;
  completed_at: string | null;
  skipped: boolean;
  completion_note: string;
}

interface AuditRow {
  id: string;
  timestamp: string;
  action: AuditAction;
  chore_template_id: string | null;
  chore_name: string;
  occurrence_key: string | null;
  occurrence_date: string | null;
  actor_member_id: string | null;
  actor_name: string | null;
  metadata: Record<string, unknown>;
}

// ── Mappers ───────────────────────────────────────────────────────────────────

export function mapMember(row: MemberRow): TeamMember {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    createdAt: row.created_at,
  };
}

export function mapChore(row: ChoreRow): ChoreTemplate {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    assigneeId: row.assignee_id,
    recurrence: {
      frequency: row.recurrence_frequency,
      daysOfWeek: row.recurrence_days_of_week ?? undefined,
      dayOfMonth: row.recurrence_day_of_month ?? undefined,
      endDate: row.recurrence_end_date ?? null,
    },
    startDate: row.start_date,
    deletedAt: row.deleted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapOccurrence(row: OccurrenceRow): OccurrenceOverride {
  return {
    key: row.key,
    templateId: row.template_id,
    originalDate: row.original_date,
    rescheduledDate: row.rescheduled_date,
    completed: row.completed,
    completedBy: row.completed_by,
    completedAt: row.completed_at,
    skipped: row.skipped,
    completionNote: row.completion_note,
  };
}

export function mapAuditEntry(row: AuditRow): AuditLogEntry {
  return {
    id: row.id,
    timestamp: row.timestamp,
    action: row.action,
    choreTemplateId: row.chore_template_id,
    choreName: row.chore_name,
    occurrenceKey: row.occurrence_key,
    occurrenceDate: row.occurrence_date,
    actorMemberId: row.actor_member_id,
    actorName: row.actor_name,
    metadata: row.metadata ?? {},
  };
}
