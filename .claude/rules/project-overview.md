# Project Overview

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

## Essential Commands

```bash
npm run dev       # Dev server (localhost:5173)
npm run build     # tsc -b + vite build → dist/
npm run preview   # Preview production build
npm run lint      # ESLint
```

No test framework is configured.
