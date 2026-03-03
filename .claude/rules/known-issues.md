# Known Issues / TODOs

- **ContactPage.tsx:14** — `alert()` placeholder; no backend submission
- **Completion notes** — `completionNote` field exists in types and DB schema but no UI input
- **`rrule` package** — installed but unused; recurrence is custom-implemented in `lib/recurrence.ts`
- **Backend not wired** — `server/schema.sql` is ready but no API layer exists
- **noUnusedLocals/noUnusedParameters** — disabled in `tsconfig.app.json`; could tighten
