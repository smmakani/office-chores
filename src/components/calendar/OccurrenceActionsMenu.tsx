import { useEffect, useRef } from 'react';
import { CheckCircle, XCircle, SkipForward, Pencil } from 'lucide-react';
import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import type { ResolvedOccurrence } from '@/types';

interface OccurrenceActionsMenuProps {
  occurrence: ResolvedOccurrence;
  anchorEl: HTMLElement;
  onClose: () => void;
}

export function OccurrenceActionsMenu({ occurrence, anchorEl, onClose }: OccurrenceActionsMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleCompletion = useStore((s) => s.toggleCompletion);
  const skipOccurrence = useStore((s) => s.skipOccurrence);
  const addAuditEntry = useStore((s) => s.addAuditEntry);
  const setCurrentPage = useStore((s) => s.setCurrentPage);
  const actingMemberId = useStore((s) => s.actingMemberId);
  const teamMembers = useStore((s) => s.teamMembers);
  const actor = teamMembers.find((m) => m.id === actingMemberId);

  // Position the menu near the anchor element
  const rect = anchorEl.getBoundingClientRect();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) && !anchorEl.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose, anchorEl]);

  const handleToggleComplete = () => {
    toggleCompletion(occurrence.key, occurrence.template.id, occurrence.originalDate, actingMemberId);
    addAuditEntry({
      action: occurrence.completed ? 'uncompleted' : 'completed',
      choreTemplateId: occurrence.template.id,
      choreName: occurrence.template.name,
      occurrenceKey: occurrence.key,
      occurrenceDate: occurrence.originalDate,
      actorMemberId: actingMemberId,
      actorName: actor?.name ?? null,
    });
    onClose();
  };

  const handleSkip = () => {
    skipOccurrence(occurrence.key, occurrence.template.id, occurrence.originalDate);
    addAuditEntry({
      action: 'skipped',
      choreTemplateId: occurrence.template.id,
      choreName: occurrence.template.name,
      occurrenceKey: occurrence.key,
      occurrenceDate: occurrence.originalDate,
      actorMemberId: actingMemberId,
      actorName: actor?.name ?? null,
    });
    onClose();
  };

  const handleEditChore = () => {
    setCurrentPage('chores');
    onClose();
  };

  const top = Math.min(rect.bottom + 4, window.innerHeight - 200);
  const left = Math.min(rect.left, window.innerWidth - 240);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 w-56 bg-white rounded-lg border border-gray-200 shadow-lg py-1"
      style={{ top, left }}
    >
      <div className="px-3 py-2 border-b border-gray-100">
        <p className="font-medium text-sm text-gray-900 truncate">{occurrence.template.name}</p>
        <p className="text-xs text-gray-500">{occurrence.displayDate}</p>
      </div>
      <div className="py-1">
        <button
          onClick={handleToggleComplete}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {occurrence.completed ? (
            <><XCircle className="h-4 w-4 text-orange-500" /> Mark incomplete</>
          ) : (
            <><CheckCircle className="h-4 w-4 text-green-500" /> Mark complete</>
          )}
        </button>
        <button
          onClick={handleSkip}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <SkipForward className="h-4 w-4 text-gray-400" /> Skip this occurrence
        </button>
        <button
          onClick={handleEditChore}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Pencil className="h-4 w-4 text-gray-400" /> Edit chore
        </button>
      </div>
    </div>
  );
}
