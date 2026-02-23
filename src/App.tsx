import { useStore } from '@/store';
import { AppShell } from '@/components/layout/AppShell';
import { CalendarPage } from '@/pages/CalendarPage';
import { ChoresPage } from '@/pages/ChoresPage';
import { MembersPage } from '@/pages/MembersPage';
import { HistoryPage } from '@/pages/HistoryPage';

function App() {
  const currentPage = useStore((s) => s.currentPage);

  const page = {
    calendar: <CalendarPage />,
    chores: <ChoresPage />,
    members: <MembersPage />,
    history: <HistoryPage />,
  }[currentPage];

  return <AppShell>{page}</AppShell>;
}

export default App;
