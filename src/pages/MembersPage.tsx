import { useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import { MemberCard } from '@/components/members/MemberCard';
import { AddMemberDialog } from '@/components/members/AddMemberDialog';

export function MembersPage() {
  const teamMembers = useStore((s) => s.teamMembers);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
          <p className="text-sm text-gray-500 mt-0.5">{teamMembers.length} member{teamMembers.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" /> Add member
        </Button>
      </div>

      {teamMembers.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Users className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">No team members yet</p>
          <p className="text-sm mt-1">Add team members to start assigning chores.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {teamMembers.map((m) => (
            <MemberCard key={m.id} member={m} />
          ))}
        </div>
      )}

      <AddMemberDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
}
