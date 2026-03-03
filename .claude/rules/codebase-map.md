# Codebase Map

## Key Directories

```
src/
  pages/          # One file per route: CalendarPage, ChoresPage, MembersPage, HistoryPage, ContactPage
  components/
    calendar/     # CalendarView, OccurrenceActionsMenu
    chores/       # ChoreFormDialog, ChoreListItem, RecurrenceEditor
    history/      # AuditLogEntryRow
    layout/       # AppShell, Sidebar, TopBar
    members/      # MemberCard, AddMemberDialog
    ui/           # Radix-based primitives (button, dialog, input, select, etc.)
  store/          # Zustand slices: index.ts, choreSlice, memberSlice, occurrenceSlice, auditSlice
  hooks/          # useResolvedOccurrences.ts
  lib/            # Pure utilities: recurrence.ts, occurrenceKey.ts, colors.ts, utils.ts
  types/          # index.ts — all TypeScript interfaces
server/
  schema.sql      # SQLite schema (not yet wired to app)
```

## Key Files / Entry Points

- `src/main.tsx` — React entry point
- `src/App.tsx` — Page dispatcher (no router library; switches on `store.currentPage`)
- `src/store/index.ts` — Zustand store composition + persist config (`localStorage key: "office-chores-v1"`)
- `src/types/index.ts` — All domain types: `ChoreTemplate`, `OccurrenceOverride`, `AuditLogEntry`, etc.
- `src/lib/recurrence.ts` — Pure function `expandRecurrence()` for generating occurrence dates
- `src/hooks/useResolvedOccurrences.ts` — Memoized hook combining templates + overrides → `ResolvedOccurrence[]`
- `server/schema.sql` — DB schema (SQLite, WAL mode, FK constraints)

## Additional Documentation

| File | When to check |
|---|---|
| `.claude/docs/architectural_patterns.md` | State management, routing, data flow, component patterns |
