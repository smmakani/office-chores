import { useMemo } from 'react';
import { useStore } from '@/store';
import { expandRecurrence } from '@/lib/recurrence';
import { makeOccurrenceKey } from '@/lib/occurrenceKey';
import { parseISO } from 'date-fns';
import type { ResolvedOccurrence } from '@/types';

export function useResolvedOccurrences(rangeStart: Date, rangeEnd: Date): ResolvedOccurrence[] {
  const choreTemplates = useStore((s) => s.choreTemplates);
  const teamMembers = useStore((s) => s.teamMembers);
  const occurrenceOverrides = useStore((s) => s.occurrenceOverrides);

  return useMemo(() => {
    const memberMap = Object.fromEntries(teamMembers.map((m) => [m.id, m]));
    const results: ResolvedOccurrence[] = [];

    for (const template of choreTemplates) {
      // Skip hard-deleted templates that ended before this window
      if (template.deletedAt && parseISO(template.deletedAt) < rangeStart) continue;

      const dates = expandRecurrence(template, rangeStart, rangeEnd);

      for (const originalDate of dates) {
        const key = makeOccurrenceKey(template.id, originalDate);
        const override = occurrenceOverrides[key];

        if (override?.skipped) continue;

        const displayDate = override?.rescheduledDate ?? originalDate;

        results.push({
          key,
          template,
          assignee: template.assigneeId ? (memberMap[template.assigneeId] ?? null) : null,
          displayDate,
          originalDate,
          completed: override?.completed ?? false,
          completedBy: override?.completedBy ? (memberMap[override.completedBy] ?? null) : null,
          completedAt: override?.completedAt ?? null,
          skipped: false,
          completionNote: override?.completionNote ?? '',
          isRescheduled: !!override?.rescheduledDate,
        });
      }
    }

    return results;
  }, [choreTemplates, teamMembers, occurrenceOverrides, rangeStart, rangeEnd]);
}
