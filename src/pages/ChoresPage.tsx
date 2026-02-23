import { useState } from 'react';
import { Plus, ClipboardList } from 'lucide-react';
import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import { ChoreListItem } from '@/components/chores/ChoreListItem';
import { ChoreFormDialog } from '@/components/chores/ChoreFormDialog';
import type { ChoreTemplate } from '@/types';

export function ChoresPage() {
  const choreTemplates = useStore((s) => s.choreTemplates);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ChoreTemplate | null>(null);

  const activeTemplates = choreTemplates.filter((t) => !t.deletedAt);

  const handleEdit = (template: ChoreTemplate) => {
    setEditingTemplate(template);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingTemplate(null);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Chores</h2>
          <p className="text-sm text-gray-500 mt-0.5">{activeTemplates.length} active chore{activeTemplates.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" /> Add chore
        </Button>
      </div>

      {activeTemplates.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <ClipboardList className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">No chores yet</p>
          <p className="text-sm mt-1">Add your first chore to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {activeTemplates.map((t) => (
            <ChoreListItem key={t.id} template={t} onEdit={handleEdit} />
          ))}
        </div>
      )}

      <ChoreFormDialog open={dialogOpen} onClose={handleClose} editingTemplate={editingTemplate} />
    </div>
  );
}
