import { makeOccurrenceKey } from '@/lib/occurrenceKey';
import type { OccurrenceOverride, OccurrenceKey, ID } from '@/types';

export interface OccurrenceSlice {
  occurrenceOverrides: Record<OccurrenceKey, OccurrenceOverride>;
  toggleCompletion: (key: OccurrenceKey, templateId: ID, originalDate: string, actorId: ID | null) => void;
  rescheduleOccurrence: (key: OccurrenceKey, templateId: ID, originalDate: string, newDate: string | null) => void;
  skipOccurrence: (key: OccurrenceKey, templateId: ID, originalDate: string) => void;
}

export function createOccurrenceSlice(
  set: (fn: (state: OccurrenceSlice) => void) => void,
  get: () => OccurrenceSlice
): OccurrenceSlice {
  return {
    occurrenceOverrides: {},

    toggleCompletion(key, templateId, originalDate, actorId) {
      const existing = get().occurrenceOverrides[key];
      const nowCompleted = !(existing?.completed ?? false);
      set((state) => {
        state.occurrenceOverrides[key] = {
          key,
          templateId,
          originalDate,
          rescheduledDate: existing?.rescheduledDate ?? null,
          completed: nowCompleted,
          completedBy: nowCompleted ? actorId : null,
          completedAt: nowCompleted ? new Date().toISOString() : null,
          skipped: existing?.skipped ?? false,
          completionNote: existing?.completionNote ?? '',
        };
      });
    },

    rescheduleOccurrence(key, templateId, originalDate, newDate) {
      set((state) => {
        const existing = state.occurrenceOverrides[key];
        state.occurrenceOverrides[key] = {
          key,
          templateId,
          originalDate,
          rescheduledDate: newDate,
          completed: existing?.completed ?? false,
          completedBy: existing?.completedBy ?? null,
          completedAt: existing?.completedAt ?? null,
          skipped: existing?.skipped ?? false,
          completionNote: existing?.completionNote ?? '',
        };
      });
    },

    skipOccurrence(key, templateId, originalDate) {
      set((state) => {
        const existing = state.occurrenceOverrides[key];
        state.occurrenceOverrides[key] = {
          key,
          templateId,
          originalDate,
          rescheduledDate: existing?.rescheduledDate ?? null,
          completed: existing?.completed ?? false,
          completedBy: existing?.completedBy ?? null,
          completedAt: existing?.completedAt ?? null,
          skipped: true,
          completionNote: existing?.completionNote ?? '',
        };
      });
    },
  };
}

// Keep makeOccurrenceKey in scope for callers
export { makeOccurrenceKey };
