import { nanoid } from 'nanoid';
import type { AuditLogEntry, AuditAction, ID, OccurrenceKey } from '@/types';

const AUDIT_LOG_MAX = 1000;

export interface AuditSlice {
  auditLog: AuditLogEntry[];
  addAuditEntry: (entry: {
    action: AuditAction;
    choreTemplateId: ID | null;
    choreName: string;
    occurrenceKey?: OccurrenceKey | null;
    occurrenceDate?: string | null;
    actorMemberId?: ID | null;
    actorName?: string | null;
    metadata?: Record<string, unknown>;
  }) => void;
}

export function createAuditSlice(
  set: (fn: (state: AuditSlice) => void) => void
): AuditSlice {
  return {
    auditLog: [],

    addAuditEntry(entry) {
      const newEntry: AuditLogEntry = {
        id: nanoid(),
        timestamp: new Date().toISOString(),
        action: entry.action,
        choreTemplateId: entry.choreTemplateId,
        choreName: entry.choreName,
        occurrenceKey: entry.occurrenceKey ?? null,
        occurrenceDate: entry.occurrenceDate ?? null,
        actorMemberId: entry.actorMemberId ?? null,
        actorName: entry.actorName ?? null,
        metadata: entry.metadata ?? {},
      };
      set((state) => {
        state.auditLog.unshift(newEntry);
        if (state.auditLog.length > AUDIT_LOG_MAX) {
          state.auditLog = state.auditLog.slice(0, AUDIT_LOG_MAX);
        }
      });
    },
  };
}
