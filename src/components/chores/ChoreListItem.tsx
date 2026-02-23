import { Pencil, Trash2, RotateCcw } from 'lucide-react';
import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getInitials } from '@/lib/colors';
import type { ChoreTemplate } from '@/types';

const RECURRENCE_LABELS: Record<string, string> = {
  none: 'One-time',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

interface ChoreListItemProps {
  template: ChoreTemplate;
  onEdit: (template: ChoreTemplate) => void;
}

export function ChoreListItem({ template, onEdit }: ChoreListItemProps) {
  const teamMembers = useStore((s) => s.teamMembers);
  const deleteChoreTemplate = useStore((s) => s.deleteChoreTemplate);
  const addAuditEntry = useStore((s) => s.addAuditEntry);
  const actingMemberId = useStore((s) => s.actingMemberId);

  const assignee = teamMembers.find((m) => m.id === template.assigneeId);
  const actor = teamMembers.find((m) => m.id === actingMemberId);

  const handleDelete = () => {
    if (!confirm(`Delete "${template.name}"? Existing completions will be preserved.`)) return;
    deleteChoreTemplate(template.id);
    addAuditEntry({
      action: 'chore_deleted',
      choreTemplateId: template.id,
      choreName: template.name,
      actorMemberId: actingMemberId,
      actorName: actor?.name ?? null,
    });
  };

  const recLabel = RECURRENCE_LABELS[template.recurrence.frequency] ?? template.recurrence.frequency;
  const weeklyDays = template.recurrence.frequency === 'weekly' && template.recurrence.daysOfWeek?.length
    ? ` (${['Su','Mo','Tu','We','Th','Fr','Sa'].filter((_, i) => template.recurrence.daysOfWeek!.includes(i)).join(', ')})`
    : '';

  return (
    <div className="flex items-center gap-4 px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 truncate">{template.name}</span>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {recLabel}{weeklyDays}
          </Badge>
        </div>
        {template.description && (
          <p className="text-sm text-gray-500 truncate mt-0.5">{template.description}</p>
        )}
        <p className="text-xs text-gray-400 mt-0.5">Starts {template.startDate}</p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {assignee ? (
          <div className="flex items-center gap-1.5">
            <span
              className="h-6 w-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
              style={{ backgroundColor: assignee.color }}
            >
              {getInitials(assignee.name)}
            </span>
            <span className="text-sm text-gray-600">{assignee.name}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">Unassigned</span>
        )}

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(template)} title="Edit">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDelete} title="Delete" className="text-red-500 hover:text-red-600 hover:bg-red-50">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
