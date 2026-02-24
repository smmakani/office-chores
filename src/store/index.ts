import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createMemberSlice, type MemberSlice } from './memberSlice';
import { createChoreSlice, type ChoreSlice } from './choreSlice';
import { createOccurrenceSlice, type OccurrenceSlice } from './occurrenceSlice';
import { createAuditSlice, type AuditSlice } from './auditSlice';
import type { PageName } from '@/types';

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
        const res = await fetch('/api/init');
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const data = await res.json() as {
          members: StoreState['teamMembers'];
          chores: StoreState['choreTemplates'];
          occurrences: StoreState['occurrenceOverrides'];
          auditLog: StoreState['auditLog'];
        };
        set((state) => {
          state.teamMembers = data.members;
          state.choreTemplates = data.chores;
          state.occurrenceOverrides = data.occurrences;
          state.auditLog = data.auditLog;
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
