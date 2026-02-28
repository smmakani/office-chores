# Supabase Migration - Implementation Plan

## Goal
Replace the current PostgreSQL + Express backend with Supabase for data persistence.

## Current Architecture
- Express server on port 3001
- PostgreSQL database (local or Render)
- Zustand store with optimistic updates -> fire-and-forget API calls
- Vite proxy: `/api` -> `http://localhost:3001`

## Target Architecture
- Supabase (PostgreSQL + auto-generated REST API)
- Remove Express server entirely
- Client calls Supabase directly via `@supabase/supabase-js`
- Keep Zustand with same optimistic update pattern

## Implementation Steps - COMPLETED

### 1. Install Supabase client ✅
```bash
npm install @supabase/supabase-js
```

### 2. Configure Supabase client ✅
- Created `src/lib/supabase.ts` with Supabase client initialization
- Uses environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

### 3. Create Supabase client module ✅
`src/lib/supabase.ts`:
- Initialize Supabase client with URL and anon key from env
- Export typed client

### 4. Update store to use Supabase ✅
- Updated `src/store/index.ts` to fetch from Supabase tables directly
- Slices make Supabase calls for CRUD operations

### 5. Update API layer ✅
- Slices now use Supabase client directly

### 6. Remove server code ✅
- Deleted `server/` directory

### 7. Update package.json ✅
- No server scripts in package.json
- Dependencies cleaned up

### 8. Update environment files ✅
- `.env` and `.env.example` contain Supabase credentials template
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` configured

### 9. Update Vite config ✅
- No `/api` proxy needed (Vite config has no proxy configured)

### 10. Database setup ✅
- App is ready to connect to Supabase

---

## Final Instructions

To complete the migration and run the app:

1. **Set up Supabase project:**
   - Create a new Supabase project at https://supabase.com
   - Go to Settings > API to get your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

2. **Configure environment:**
   - Open `.env` in the project root
   - Replace the placeholder values with your actual Supabase credentials

3. **Create database tables:**
   - Go to Supabase Dashboard > SQL Editor
   - Copy and run the contents of `schema.sql` to create tables (members, chores, occurrences, audit_log)

4. **Run the app:**
   ```bash
   npm run dev
   ```

5. **Test:**
   - The app will load data from Supabase on startup
   - All CRUD operations will persist directly to Supabase
