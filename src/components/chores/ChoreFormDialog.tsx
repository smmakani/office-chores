import { useState, useEffect } from 'react';
import { format } from 'date-fns';
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RecurrenceEditor } from './RecurrenceEditor';
import type { ChoreTemplate, RecurrenceRule } from '@/types';

interface ChoreFormDialogProps {
  open: boolean;
  onClose: () => void;
  editingTemplate?: ChoreTemplate | null;
}

const DEFAULT_RECURRENCE: RecurrenceRule = { frequency: 'none' };

export function ChoreFormDialog({ open, onClose, editingTemplate }: ChoreFormDialogProps) {
  const teamMembers = useStore((s) => s.teamMembers);
  const addChoreTemplate = useStore((s) => s.addChoreTemplate);
  const updateChoreTemplate = useStore((s) => s.updateChoreTemplate);
  const addAuditEntry = useStore((s) => s.addAuditEntry);
  const actingMemberId = useStore((s) => s.actingMemberId);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [recurrence, setRecurrence] = useState<RecurrenceRule>(DEFAULT_RECURRENCE);
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    if (editingTemplate) {
      setName(editingTemplate.name);
      setDescription(editingTemplate.description);
      setAssigneeId(editingTemplate.assigneeId);
      setRecurrence(editingTemplate.recurrence);
      setStartDate(editingTemplate.startDate);
    } else {
      setName('');
      setDescription('');
      setAssigneeId(null);
      setRecurrence(DEFAULT_RECURRENCE);
      setStartDate(format(new Date(), 'yyyy-MM-dd'));
    }
  }, [editingTemplate, open]);

  const actor = teamMembers.find((m) => m.id === actingMemberId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingTemplate) {
      updateChoreTemplate(editingTemplate.id, { name, description, assigneeId, recurrence, startDate });
      addAuditEntry({
        action: 'chore_updated',
        choreTemplateId: editingTemplate.id,
        choreName: name,
        actorMemberId: actingMemberId,
        actorName: actor?.name ?? null,
      });
    } else {
      const template = addChoreTemplate({ name, description, assigneeId, recurrence, startDate });
      addAuditEntry({
        action: 'chore_created',
        choreTemplateId: template.id,
        choreName: name,
        actorMemberId: actingMemberId,
        actorName: actor?.name ?? null,
      });
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingTemplate ? 'Edit Chore' : 'Add Chore'}</DialogTitle>
          <DialogDescription>
            {editingTemplate ? 'Update chore details.' : 'Create a new chore and assign it to a team member.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Name *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Clean the kitchen"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details..."
              rows={2}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Assign to</label>
            <Select
              value={assigneeId ?? '__unassigned__'}
              onValueChange={(v) => setAssigneeId(v === '__unassigned__' ? null : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__unassigned__">Unassigned</SelectItem>
                {teamMembers.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Start date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="flex h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              required
            />
          </div>
          <RecurrenceEditor value={recurrence} onChange={setRecurrence} />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              {editingTemplate ? 'Save changes' : 'Add chore'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
