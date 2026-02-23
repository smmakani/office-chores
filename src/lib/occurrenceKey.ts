import type { ID, OccurrenceKey } from '@/types';

export function makeOccurrenceKey(templateId: ID, date: string): OccurrenceKey {
  return `${templateId}::${date}`;
}

export function parseOccurrenceKey(key: OccurrenceKey): { templateId: ID; date: string } {
  const [templateId, date] = key.split('::');
  return { templateId, date };
}
