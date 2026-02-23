import { Calendar, ClipboardList, Users, History, Mail } from 'lucide-react';
import { useStore } from '@/store';
import { cn } from '@/lib/utils';
import type { PageName } from '@/types';

const NAV_ITEMS: { page: PageName; label: string; icon: React.FC<{ className?: string }> }[] = [
  { page: 'calendar', label: 'Calendar', icon: Calendar },
  { page: 'chores', label: 'Chores', icon: ClipboardList },
  { page: 'members', label: 'Team', icon: Users },
  { page: 'history', label: 'History', icon: History },
  { page: 'contact', label: 'Contact Us', icon: Mail },
];

export function Sidebar() {
  const currentPage = useStore((s) => s.currentPage);
  const setCurrentPage = useStore((s) => s.setCurrentPage);

  return (
    <aside className="w-56 shrink-0 bg-gray-900 flex flex-col h-full">
      <div className="px-4 py-5 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-indigo-400" />
          <span className="text-white font-semibold text-lg">Office Chores</span>
        </div>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {NAV_ITEMS.map(({ page, label, icon: Icon }) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              currentPage === page
                ? 'bg-indigo-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
