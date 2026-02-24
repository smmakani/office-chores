import { useEffect } from 'react';
import { useStore } from '@/store';
import { AppShell } from '@/components/layout/AppShell';
import { CalendarPage } from '@/pages/CalendarPage';
import { ChoresPage } from '@/pages/ChoresPage';
import { MembersPage } from '@/pages/MembersPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { ContactPage } from '@/pages/ContactPage';

function App() {
  const currentPage = useStore((s) => s.currentPage);
  const isLoading = useStore((s) => s.isLoading);
  const initError = useStore((s) => s.initError);
  const initStore = useStore((s) => s.initStore);

  useEffect(() => {
    localStorage.removeItem('office-chores-v1');
    initStore();
  }, [initStore]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
          <span className="text-sm">Loading…</span>
        </div>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-destructive font-medium">Failed to connect to server</p>
          <p className="text-sm text-muted-foreground max-w-xs">{initError}</p>
          <button
            onClick={() => initStore()}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const page = {
    calendar: <CalendarPage />,
    chores: <ChoresPage />,
    members: <MembersPage />,
    history: <HistoryPage />,
    contact: <ContactPage />,
  }[currentPage];

  return <AppShell>{page}</AppShell>;
}

export default App;
