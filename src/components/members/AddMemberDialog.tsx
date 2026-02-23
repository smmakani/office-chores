import { useState } from 'react';
import { useStore } from '@/store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddMemberDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddMemberDialog({ open, onClose }: AddMemberDialogProps) {
  const addMember = useStore((s) => s.addMember);
  const addAuditEntry = useStore((s) => s.addAuditEntry);
  const actingMemberId = useStore((s) => s.actingMemberId);
  const teamMembers = useStore((s) => s.teamMembers);
  const [name, setName] = useState('');

  const actor = teamMembers.find((m) => m.id === actingMemberId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const member = addMember(name.trim());
    addAuditEntry({
      action: 'member_added',
      choreTemplateId: null,
      choreName: '',
      actorMemberId: actingMemberId,
      actorName: actor?.name ?? null,
      metadata: { memberName: member.name },
    });
    setName('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>Enter the person's name to add them to the team.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Name *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alice Smith"
              required
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Add member
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
