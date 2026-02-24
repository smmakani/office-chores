# Office Chores — Project Guide

## Project Overview

**Office Chores** is a React SPA for managing recurring team chores with assignment, completion tracking, and audit logging. Runs fully client-side with localStorage persistence. SQLite schema exists for future backend integration.

**Active features:** calendar view, chore templates with recurrence, occurrence overrides (complete/skip/reschedule), team member management, audit log, contact page (placeholder).

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript 5 |
| Build | Vite 7 |
| State | Zustand 5 + Immer + localStorage persist |
| UI primitives | Radix UI (dialog, select, popover, tabs, tooltip, etc.) |
| Styling | Tailwind CSS 4 (via @tailwindcss/vite) |
| Calendar | FullCalendar 6 (react, daygrid, interaction plugins) |
| Date utils | date-fns 4 |
| IDs | nanoid 5 |
| Icons | lucide-react |
| Deploy | Netlify |

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

## Essential Commands

```bash
npm run dev       # Dev server (localhost:5173)
npm run build     # tsc -b + vite build → dist/
npm run preview   # Preview production build
npm run lint      # ESLint
```

No test framework is configured.

## Key Files / Entry Points

- `src/main.tsx` — React entry point
- `src/App.tsx` — Page dispatcher (no router library; switches on `store.currentPage`)
- `src/store/index.ts` — Zustand store composition + persist config (`localStorage key: "office-chores-v1"`)
- `src/types/index.ts` — All domain types: `ChoreTemplate`, `OccurrenceOverride`, `AuditLogEntry`, etc.
- `src/lib/recurrence.ts` — Pure function `expandRecurrence()` for generating occurrence dates
- `src/hooks/useResolvedOccurrences.ts` — Memoized hook combining templates + overrides → `ResolvedOccurrence[]`
- `server/schema.sql` — DB schema (SQLite, WAL mode, FK constraints)

## Known Issues / TODOs

- **ContactPage.tsx:14** — `alert()` placeholder; no backend submission
- **Completion notes** — `completionNote` field exists in types and DB schema but no UI input
- **`rrule` package** — installed but unused; recurrence is custom-implemented in `lib/recurrence.ts`
- **Backend not wired** — `server/schema.sql` is ready but no API layer exists
- **noUnusedLocals/noUnusedParameters** — disabled in `tsconfig.app.json`; could tighten

## Additional Documentation

| File | When to check |
|---|---|
| `.claude/docs/architectural_patterns.md` | State management, routing, data flow, component patterns |
