import { useStore } from '@/store';
import { getInitials } from '@/lib/colors';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PAGE_TITLES: Record<string, string> = {
  calendar: 'Calendar',
  chores: 'Chores',
  members: 'Team Members',
  history: 'History',
};

export function TopBar() {
  const currentPage = useStore((s) => s.currentPage);
  const teamMembers = useStore((s) => s.teamMembers);
  const actingMemberId = useStore((s) => s.actingMemberId);
  const setActingMember = useStore((s) => s.setActingMember);

  const actingMember = teamMembers.find((m) => m.id === actingMemberId);

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-lg font-semibold text-gray-900">{PAGE_TITLES[currentPage]}</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">Acting as:</span>
        <Select
          value={actingMemberId ?? '__none__'}
          onValueChange={(v) => setActingMember(v === '__none__' ? null : v)}
        >
          <SelectTrigger className="w-44">
            <div className="flex items-center gap-2">
              {actingMember && (
                <span
                  className="h-5 w-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                  style={{ backgroundColor: actingMember.color }}
                >
                  {getInitials(actingMember.name)}
                </span>
              )}
              <SelectValue placeholder="Select member" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">— Nobody —</SelectItem>
            {teamMembers.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                <div className="flex items-center gap-2">
                  <span
                    className="h-4 w-4 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                    style={{ backgroundColor: m.color }}
                  >
                    {getInitials(m.name)}
                  </span>
                  {m.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}
