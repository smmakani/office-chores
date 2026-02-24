import { nanoid } from 'nanoid';
import { getColorForIndex } from '@/lib/colors';
import { API_BASE } from '@/lib/api';
import type { TeamMember } from '@/types';

export interface MemberSlice {
  teamMembers: TeamMember[];
  addMember: (name: string) => TeamMember;
  removeMember: (id: string) => void;
}

export function createMemberSlice(
  set: (fn: (state: MemberSlice) => void) => void,
  get: () => MemberSlice
): MemberSlice {
  return {
    teamMembers: [],

    addMember(name: string) {
      const member: TeamMember = {
        id: nanoid(),
        name: name.trim(),
        color: getColorForIndex(get().teamMembers.length),
        createdAt: new Date().toISOString(),
      };
      set((state) => {
        state.teamMembers.push(member);
      });
      fetch(`${API_BASE}/api/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member),
      }).catch(console.error);
      return member;
    },

    removeMember(id: string) {
      set((state) => {
        state.teamMembers = state.teamMembers.filter((m) => m.id !== id);
      });
      fetch(`${API_BASE}/api/members/${id}`, { method: 'DELETE' }).catch(console.error);
    },
  };
}
