import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { supabase } from '@/lib/supabase';
import { createMemberSlice, type MemberSlice } from './memberSlice';
import { createChoreSlice, type ChoreSlice } from './choreSlice';
import { createOccurrenceSlice, type OccurrenceSlice } from './occurrenceSlice';
import { createAuditSlice, type AuditSlice } from './auditSlice';
import type { PageName, OccurrenceOverride } from '@/types';

interface UISlice {
  actingMemberId: string | null;
  currentPage: PageName;
  isLoading: boolean;
  initError: string | null;
  setActingMember: (id: string | null) => void;
  setCurrentPage: (page: PageName) => void;
  initStore: () => Promise<void>;
}

type StoreState = MemberSlice & ChoreSlice & OccurrenceSlice & AuditSlice & UISlice;

export const useStore = create<StoreState>()(
  immer((set, get) => ({
    // Data slices
    ...createMemberSlice(set as Parameters<typeof createMemberSlice>[0], get as Parameters<typeof createMemberSlice>[1]),
    ...createChoreSlice(set as Parameters<typeof createChoreSlice>[0]),
    ...createOccurrenceSlice(set as Parameters<typeof createOccurrenceSlice>[0], get as Parameters<typeof createOccurrenceSlice>[1]),
    ...createAuditSlice(set as Parameters<typeof createAuditSlice>[0]),

    // UI state
    actingMemberId: null,
    currentPage: 'calendar' as PageName,
    isLoading: true,
    initError: null,
    setActingMember: (id) => set((state) => { state.actingMemberId = id; }),
    setCurrentPage: (page) => set((state) => { state.currentPage = page; }),

    async initStore() {
      set((state) => { state.isLoading = true; state.initError = null; });
      try {
        const [membersRes, choresRes, occurrencesRes, auditRes] = await Promise.all([
          supabase.from('team_members').select('*').order('created_at'),
          supabase.from('chore_templates').select('*').order('created_at'),
          supabase.from('occurrence_overrides').select('*'),
          supabase.from('audit_log').select('*').order('timestamp', { ascending: false }).limit(1000),
        ]);

        if (membersRes.error) throw membersRes.error;
        if (choresRes.error) throw choresRes.error;
        if (occurrencesRes.error) throw occurrencesRes.error;
        if (auditRes.error) throw auditRes.error;

        const occurrences: Record<string, unknown> = {};
        for (const row of occurrencesRes.data ?? []) {
          occurrences[row.key] = row;
        }

        set((state) => {
          state.teamMembers = membersRes.data ?? [];
          state.choreTemplates = (choresRes.data ?? []).map((t: Record<string, unknown>) => ({
            id: t.id as string,
            name: t.name as string,
            description: t.description as string,
            assigneeId: t.assigneeId as string | null ?? t.assignee_id as string | null ?? null,
            recurrence: typeof t.recurrence === 'string' ? JSON.parse(t.recurrence) : t.recurrence,
            startDate: t.startDate as string ?? t.start_date as string,
            deletedAt: t.deletedAt as string | null ?? t.deleted_at as string | null ?? null,
            createdAt: t.createdAt as string ?? t.created_at as string,
            updatedAt: t.updatedAt as string ?? t.updated_at as string,
          }));
          state.occurrenceOverrides = occurrences as Record<string, OccurrenceOverride>;
          state.auditLog = auditRes.data ?? [];
          state.isLoading = false;
        });
      } catch (err) {
        set((state) => {
          state.isLoading = false;
          state.initError = err instanceof Error ? err.message : 'Unknown error';
        });
      }
    },
  }))
);
