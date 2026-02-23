import { format, parseISO } from 'date-fns';
import {
  CheckCircle,
  XCircle,
  Calendar,
  SkipForward,
  Plus,
  Pencil,
  Trash2,
  UserPlus,
  UserMinus,
} from 'lucide-react';
import type { AuditLogEntry, AuditAction } from '@/types';

const ACTION_CONFIG: Record<
  AuditAction,
  { icon: React.FC<{ className?: string }>; color: string; label: (e: AuditLogEntry) => string }
> = {
  completed: {
    icon: CheckCircle,
    color: 'text-green-500',
    label: (e) => `Completed "${e.choreName}"${e.occurrenceDate ? ` on ${e.occurrenceDate}` : ''}`,
  },
  uncompleted: {
    icon: XCircle,
    color: 'text-orange-500',
    label: (e) => `Marked "${e.choreName}" incomplete${e.occurrenceDate ? ` on ${e.occurrenceDate}` : ''}`,
  },
  rescheduled: {
    icon: Calendar,
    color: 'text-blue-500',
    label: (e) => {
      const { from, to } = (e.metadata ?? {}) as { from?: string; to?: string };
      return `Rescheduled "${e.choreName}"${from && to ? ` from ${from} to ${to}` : ''}`;
    },
  },
  skipped: {
    icon: SkipForward,
    color: 'text-gray-400',
    label: (e) => `Skipped "${e.choreName}"${e.occurrenceDate ? ` on ${e.occurrenceDate}` : ''}`,
  },
  chore_created: {
    icon: Plus,
    color: 'text-indigo-500',
    label: (e) => `Created chore "${e.choreName}"`,
  },
  chore_updated: {
    icon: Pencil,
    color: 'text-indigo-400',
    label: (e) => `Updated chore "${e.choreName}"`,
  },
  chore_deleted: {
    icon: Trash2,
    color: 'text-red-500',
    label: (e) => `Deleted chore "${e.choreName}"`,
  },
  member_added: {
    icon: UserPlus,
    color: 'text-green-500',
    label: (e) => `Added team member "${(e.metadata?.memberName as string) ?? ''}"`,
  },
  member_removed: {
    icon: UserMinus,
    color: 'text-red-500',
    label: (e) => `Removed team member "${(e.metadata?.memberName as string) ?? ''}"`,
  },
};

interface AuditLogEntryRowProps {
  entry: AuditLogEntry;
}

export function AuditLogEntryRow({ entry }: AuditLogEntryRowProps) {
  const config = ACTION_CONFIG[entry.action];
  const Icon = config?.icon ?? CheckCircle;
  const color = config?.color ?? 'text-gray-400';
  const label = config?.label(entry) ?? entry.action;

  let timeStr = '';
  try {
    timeStr = format(parseISO(entry.timestamp), 'MMM d, yyyy h:mm a');
  } catch {
    timeStr = entry.timestamp;
  }

  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${color}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800">{label}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {entry.actorName && (
            <span className="text-xs text-gray-500">by {entry.actorName}</span>
          )}
          <span className="text-xs text-gray-400">{timeStr}</span>
        </div>
      </div>
    </div>
  );
}
