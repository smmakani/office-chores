import { Trash2 } from 'lucide-react';
import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/colors';
import type { TeamMember } from '@/types';

interface MemberCardProps {
  member: TeamMember;
}

export function MemberCard({ member }: MemberCardProps) {
  const removeMember = useStore((s) => s.removeMember);
  const addAuditEntry = useStore((s) => s.addAuditEntry);
  const choreTemplates = useStore((s) => s.choreTemplates);
  const actingMemberId = useStore((s) => s.actingMemberId);
  const teamMembers = useStore((s) => s.teamMembers);

  const actor = teamMembers.find((m) => m.id === actingMemberId);
  const assignedChores = choreTemplates.filter(
    (t) => t.assigneeId === member.id && !t.deletedAt
  );

  const handleRemove = () => {
    if (!confirm(`Remove "${member.name}" from the team? Their assigned chores will become unassigned.`)) return;
    removeMember(member.id);
    addAuditEntry({
      action: 'member_removed',
      choreTemplateId: null,
      choreName: '',
      actorMemberId: actingMemberId,
      actorName: actor?.name ?? null,
      metadata: { memberName: member.name },
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-center gap-3 hover:border-gray-300 transition-colors">
      <div
        className="h-14 w-14 rounded-full flex items-center justify-center text-white text-xl font-bold"
        style={{ backgroundColor: member.color }}
      >
        {getInitials(member.name)}
      </div>
      <div className="text-center">
        <p className="font-semibold text-gray-900">{member.name}</p>
        <p className="text-sm text-gray-500">
          {assignedChores.length} chore{assignedChores.length !== 1 ? 's' : ''}
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleRemove}
        className="text-red-500 hover:text-red-600 hover:bg-red-50 w-full"
      >
        <Trash2 className="h-4 w-4 mr-1" /> Remove
      </Button>
    </div>
  );
}
