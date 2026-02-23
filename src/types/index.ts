// ─── Core Identifiers ────────────────────────────────────────────────────────

export type ID = string;

// ─── Team Members ─────────────────────────────────────────────────────────────

export interface TeamMember {
  id: ID;
  name: string;
  color: string;
  createdAt: string;
}

// ─── Recurrence Rule ──────────────────────────────────────────────────────────

export type RecurrenceFrequency = 'none' | 'daily' | 'weekly' | 'monthly';

export interface RecurrenceRule {
  frequency: RecurrenceFrequency;
  daysOfWeek?: number[]; // 0=Sun … 6=Sat; used when frequency === 'weekly'
  dayOfMonth?: number;   // 1-31; used when frequency === 'monthly'
  endDate?: string | null; // "YYYY-MM-DD"; null = forever
}

// ─── Chore Template ───────────────────────────────────────────────────────────

export interface ChoreTemplate {
  id: ID;
  name: string;
  description: string;
  assigneeId: ID | null;
  recurrence: RecurrenceRule;
  startDate: string; // "YYYY-MM-DD"
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Occurrence ───────────────────────────────────────────────────────────────

export type OccurrenceKey = string; // `${templateId}::${"YYYY-MM-DD"}`

export interface OccurrenceOverride {
  key: OccurrenceKey;
  templateId: ID;
  originalDate: string; // "YYYY-MM-DD"
  rescheduledDate: string | null; // "YYYY-MM-DD"
  completed: boolean;
  completedBy: ID | null;
  completedAt: string | null;
  skipped: boolean;
  completionNote: string;
}

// ─── Audit Log ────────────────────────────────────────────────────────────────

export type AuditAction =
  | 'completed'
  | 'uncompleted'
  | 'rescheduled'
  | 'skipped'
  | 'chore_created'
  | 'chore_updated'
  | 'chore_deleted'
  | 'member_added'
  | 'member_removed';

export interface AuditLogEntry {
  id: ID;
  timestamp: string;
  action: AuditAction;
  choreTemplateId: ID | null;
  choreName: string;
  occurrenceKey: OccurrenceKey | null;
  occurrenceDate: string | null;
  actorMemberId: ID | null;
  actorName: string | null;
  metadata: Record<string, unknown>;
}

// ─── App State ────────────────────────────────────────────────────────────────

export interface AppState {
  teamMembers: TeamMember[];
  choreTemplates: ChoreTemplate[];
  occurrenceOverrides: Record<OccurrenceKey, OccurrenceOverride>;
  auditLog: AuditLogEntry[];
}

// ─── Derived Types ────────────────────────────────────────────────────────────

export interface ResolvedOccurrence {
  key: OccurrenceKey;
  template: ChoreTemplate;
  assignee: TeamMember | null;
  displayDate: string; // "YYYY-MM-DD"
  originalDate: string;
  completed: boolean;
  completedBy: TeamMember | null;
  completedAt: string | null;
  skipped: boolean;
  completionNote: string;
  isRescheduled: boolean;
}

// ─── UI State ─────────────────────────────────────────────────────────────────

export type PageName = 'calendar' | 'chores' | 'members' | 'history';
