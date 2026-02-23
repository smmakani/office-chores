import { useState } from 'react';
import { History } from 'lucide-react';
import { useStore } from '@/store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AuditLogEntryRow } from '@/components/history/AuditLogEntryRow';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AuditAction } from '@/types';

const ACTION_LABELS: Record<AuditAction | 'all', string> = {
  all: 'All actions',
  completed: 'Completed',
  uncompleted: 'Marked incomplete',
  rescheduled: 'Rescheduled',
  skipped: 'Skipped',
  chore_created: 'Chore created',
  chore_updated: 'Chore updated',
  chore_deleted: 'Chore deleted',
  member_added: 'Member added',
  member_removed: 'Member removed',
};

export function HistoryPage() {
  const auditLog = useStore((s) => s.auditLog);
  const teamMembers = useStore((s) => s.teamMembers);
  const [filterMember, setFilterMember] = useState('all');
  const [filterAction, setFilterAction] = useState<AuditAction | 'all'>('all');

  const filtered = auditLog.filter((e) => {
    if (filterMember !== 'all' && e.actorMemberId !== filterMember) return false;
    if (filterAction !== 'all' && e.action !== filterAction) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">History</h2>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} entries</p>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <Select value={filterMember} onValueChange={setFilterMember}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Filter by member" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All members</SelectItem>
            {teamMembers.map((m) => (
              <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterAction} onValueChange={(v) => setFilterAction(v as AuditAction | 'all')}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(ACTION_LABELS) as (AuditAction | 'all')[]).map((a) => (
              <SelectItem key={a} value={a}>{ACTION_LABELS[a]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <History className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">No history yet</p>
          <p className="text-sm mt-1">Actions you take will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 px-4">
          <ScrollArea className="max-h-[calc(100vh-280px)]">
            {filtered.map((entry) => (
              <AuditLogEntryRow key={entry.id} entry={entry} />
            ))}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
