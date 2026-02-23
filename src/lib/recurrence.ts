import {
  addMonths,
  eachDayOfInterval,
  format,
  parseISO,
  isAfter,
  isBefore,
} from 'date-fns';
import type { ChoreTemplate } from '@/types';

/**
 * Expands a chore template's recurrence into a list of "YYYY-MM-DD" date strings
 * that fall within [rangeStart, rangeEnd]. Pure function — no store access.
 */
export function expandRecurrence(
  template: ChoreTemplate,
  rangeStart: Date,
  rangeEnd: Date
): string[] {
  const { recurrence, startDate, deletedAt } = template;
  const anchor = parseISO(startDate);

  // Cap by whichever limit comes first: rangeEnd, deletedAt, or recurrence.endDate
  let effectiveEnd = rangeEnd;
  if (deletedAt) {
    const d = parseISO(deletedAt);
    if (d < effectiveEnd) effectiveEnd = d;
  }
  if (recurrence.endDate) {
    const d = parseISO(recurrence.endDate);
    if (d < effectiveEnd) effectiveEnd = d;
  }

  const windowStart = anchor > rangeStart ? anchor : rangeStart;
  if (isAfter(windowStart, effectiveEnd)) return [];

  const dates: string[] = [];

  if (recurrence.frequency === 'none') {
    if (!isBefore(anchor, rangeStart) && !isAfter(anchor, rangeEnd)) {
      dates.push(format(anchor, 'yyyy-MM-dd'));
    }
    return dates;
  }

  if (recurrence.frequency === 'daily') {
    eachDayOfInterval({ start: windowStart, end: effectiveEnd }).forEach((d) => {
      dates.push(format(d, 'yyyy-MM-dd'));
    });
    return dates;
  }

  if (recurrence.frequency === 'weekly') {
    const targetDays = new Set(recurrence.daysOfWeek ?? []);
    eachDayOfInterval({ start: windowStart, end: effectiveEnd }).forEach((d) => {
      if (targetDays.has(d.getDay())) {
        dates.push(format(d, 'yyyy-MM-dd'));
      }
    });
    return dates;
  }

  if (recurrence.frequency === 'monthly') {
    const targetDay = recurrence.dayOfMonth ?? anchor.getDate();
    let cursor = new Date(windowStart.getFullYear(), windowStart.getMonth(), targetDay);
    // If that day in the start month is before windowStart, advance one month
    if (cursor < windowStart) cursor = addMonths(cursor, 1);
    while (cursor <= effectiveEnd) {
      if (!isBefore(cursor, rangeStart)) {
        dates.push(format(cursor, 'yyyy-MM-dd'));
      }
      cursor = addMonths(cursor, 1);
    }
    return dates;
  }

  return dates;
}
