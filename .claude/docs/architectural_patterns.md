# Architectural Patterns

## 1. State Management — Zustand Slice Pattern

State is split into domain slices, each in its own file, and composed in `src/store/index.ts`.

**Pattern:**
- Each slice is a factory function `(set, get) => ({ ...state, ...actions })`
- All slices spread into a single `useStore` hook
- Immer middleware allows direct mutations inside `set()` calls
- Persist middleware serializes to `localStorage` under key `"office-chores-v1"`

**Files:** `src/store/index.ts`, `src/store/choreSlice.ts`, `src/store/memberSlice.ts`, `src/store/occurrenceSlice.ts`, `src/store/auditSlice.ts`

**UI state** (non-persisted): `actingMemberId`, `currentPage` live in `index.ts` outside the persisted block.

---

## 2. Custom Page Router (No React Router)

Navigation uses a `currentPage` string in the store rather than a URL router.

**Pattern:**
- `src/App.tsx` renders a component based on `store.currentPage`
- `Sidebar.tsx` calls `store.setCurrentPage(pageName)` on nav click
- Valid pages: `"calendar" | "chores" | "members" | "history" | "contact"` (union type in `src/types/index.ts`)

**Implication:** No URL params, no deep linking, no browser history. Simple switch-case dispatch.

---

## 3. Occurrence Key System

Occurrences are identified by a composite key: `${templateId}::${YYYY-MM-DD}`.

**Pattern:**
- `src/lib/occurrenceKey.ts` exports `makeOccurrenceKey()` and `parseOccurrenceKey()`
- `occurrenceOverrides` in the store is a `Record<OccurrenceKey, OccurrenceOverride>` — O(1) lookup
- Key is stored as primary key in the DB schema (`server/schema.sql`)
- Used in: `occurrenceSlice.ts`, `useResolvedOccurrences.ts`, `CalendarView.tsx`, `OccurrenceActionsMenu.tsx`

---

## 4. Recurrence Expansion + Resolution Hook

Occurrence data is derived (not stored) from templates + overrides.

**Pattern:**
1. `src/lib/recurrence.ts` — `expandRecurrence(template, rangeStart, rangeEnd)` returns `string[]` (ISO date strings). Pure function, no side effects.
2. `src/hooks/useResolvedOccurrences.ts` — Calls `expandRecurrence`, then merges with stored overrides → `ResolvedOccurrence[]`. Memoized with `useMemo`.

**ResolvedOccurrence** (`src/types/index.ts`): combines template fields + generated date + override (completed, skipped, rescheduledDate, etc.).

---

## 5. Acting Member Pattern (Audit Attribution)

Instead of authentication, a "who am I acting as" selector drives audit attribution.

**Pattern:**
- `TopBar.tsx` renders a member selector that sets `store.actingMemberId`
- All write actions read `store.actingMemberId` + member name to stamp `auditLogEntry.actorName`
- `src/store/auditSlice.ts` appends entries with max cap (`AUDIT_LOG_MAX = 1000`)
- Used in: all slice actions that mutate chore/occurrence/member state

---

## 6. Radix UI + CVA Component Pattern

UI primitives wrap Radix UI with Tailwind variants via Class Variance Authority.

**Pattern:**
- `src/components/ui/*.tsx` — thin wrappers around Radix primitives
- `cva()` defines variant maps (e.g., `button.tsx` has `default | ghost | outline | destructive` variants)
- `cn()` from `src/lib/utils.ts` merges Tailwind classes (`clsx` + `tailwind-merge`)
- Components accept `className` prop for local overrides
- Used across all feature components and pages

---

## 7. Dialog-Driven Forms

Modal creation/editing flows use Radix Dialog with controlled state.

**Pattern:**
- Parent component holds `open: boolean` state
- Passes `open` + `onClose` + optional `initialData` to dialog component
- Dialog component manages its own form state internally
- On submit: calls store action, then `onClose()`
- Examples: `ChoreFormDialog.tsx`, `AddMemberDialog.tsx`

---

## 8. Soft Delete for Chores

Deleting a chore sets `deletedAt` timestamp rather than removing the record.

**Pattern:**
- `ChoreTemplate.deletedAt?: string` in `src/types/index.ts`
- Store filter: active chores `filter(c => !c.deletedAt)` in list views
- Occurrence overrides and audit entries retain `choreTemplateId` reference
- Mirrors DB schema: `deleted_at` column in `chore_templates` table (`server/schema.sql`)
