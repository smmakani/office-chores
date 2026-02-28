import { nanoid } from 'nanoid';
import { supabase } from '@/lib/supabase';
import type { ChoreTemplate, RecurrenceRule } from '@/types';

export interface ChoreSlice {
  choreTemplates: ChoreTemplate[];
  addChoreTemplate: (data: {
    name: string;
    description: string;
    assigneeId: string | null;
    recurrence: RecurrenceRule;
    startDate: string;
  }) => ChoreTemplate;
  updateChoreTemplate: (id: string, data: Partial<Omit<ChoreTemplate, 'id' | 'createdAt'>>) => void;
  deleteChoreTemplate: (id: string) => void;
}

export function createChoreSlice(
  set: (fn: (state: ChoreSlice) => void) => void
): ChoreSlice {
  return {
    choreTemplates: [],

    addChoreTemplate(data) {
      const template: ChoreTemplate = {
        id: nanoid(),
        name: data.name.trim(),
        description: data.description.trim(),
        assigneeId: data.assigneeId,
        recurrence: data.recurrence,
        startDate: data.startDate,
        deletedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      set((state) => {
        state.choreTemplates.push(template);
      });
      supabase.from('chore_templates').insert(template).then(undefined, console.error);
      return template;
    },

    updateChoreTemplate(id, data) {
      set((state) => {
        const idx = state.choreTemplates.findIndex((t) => t.id === id);
        if (idx !== -1) {
          Object.assign(state.choreTemplates[idx], data, {
            updatedAt: new Date().toISOString(),
          });
        }
      });
      supabase.from('chore_templates').update(data).eq('id', id).then(undefined, console.error);
    },

    deleteChoreTemplate(id) {
      set((state) => {
        const t = state.choreTemplates.find((t) => t.id === id);
        if (t) t.deletedAt = new Date().toISOString();
      });
      supabase.from('chore_templates').update({ deleted_at: new Date().toISOString() }).eq('id', id).then(undefined, console.error);
    },
  };
}
