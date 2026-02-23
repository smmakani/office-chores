import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createMemberSlice, type MemberSlice } from './memberSlice';
import { createChoreSlice, type ChoreSlice } from './choreSlice';
import { createOccurrenceSlice, type OccurrenceSlice } from './occurrenceSlice';
import { createAuditSlice, type AuditSlice } from './auditSlice';
import type { PageName } from '@/types';

interface UISlice {
  actingMemberId: string | null;
  currentPage: PageName;
  setActingMember: (id: string | null) => void;
  setCurrentPage: (page: PageName) => void;
}

type StoreState = MemberSlice & ChoreSlice & OccurrenceSlice & AuditSlice & UISlice;

export const useStore = create<StoreState>()(
  persist(
    immer((set, get) => ({
      // Data slices
      ...createMemberSlice(set as Parameters<typeof createMemberSlice>[0], get as Parameters<typeof createMemberSlice>[1]),
      ...createChoreSlice(set as Parameters<typeof createChoreSlice>[0]),
      ...createOccurrenceSlice(set as Parameters<typeof createOccurrenceSlice>[0], get as Parameters<typeof createOccurrenceSlice>[1]),
      ...createAuditSlice(set as Parameters<typeof createAuditSlice>[0]),

      // UI state (not persisted)
      actingMemberId: null,
      currentPage: 'calendar' as PageName,
      setActingMember: (id) => set((state) => { state.actingMemberId = id; }),
      setCurrentPage: (page) => set((state) => { state.currentPage = page; }),
    })),
    {
      name: 'office-chores-v1',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => ({
        teamMembers: state.teamMembers,
        choreTemplates: state.choreTemplates,
        occurrenceOverrides: state.occurrenceOverrides,
        auditLog: state.auditLog,
      }),
    }
  )
);
