import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool, query } from './db.js';
import { runMigration } from './migrate.js';
import { mapMember, mapChore, mapOccurrence, mapAuditEntry } from './mappers.js';
import membersRouter from './routes/members.js';
import choresRouter from './routes/chores.js';
import occurrencesRouter from './routes/occurrences.js';
import auditRouter from './routes/audit.js';
import type { OccurrenceOverride } from '../src/types/index.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/members', membersRouter);
app.use('/api/chores', choresRouter);
app.use('/api/occurrences', occurrencesRouter);
app.use('/api/audit', auditRouter);

// GET /api/init — single startup roundtrip
app.get('/api/init', async (_req, res, next) => {
  try {
    const [memberRows, choreRows, occurrenceRows, auditRows] = await Promise.all([
      query('SELECT * FROM team_members ORDER BY created_at'),
      query('SELECT * FROM chore_templates ORDER BY created_at'),
      query('SELECT * FROM occurrence_overrides'),
      query('SELECT * FROM audit_log ORDER BY timestamp DESC LIMIT 1000'),
    ]);

    const occurrences: Record<string, OccurrenceOverride> = {};
    for (const row of occurrenceRows) {
      const ov = (mapOccurrence as (row: unknown) => OccurrenceOverride)(row);
      occurrences[ov.key] = ov;
    }

    res.json({
      members: memberRows.map(mapMember as (row: unknown) => unknown),
      chores: choreRows.map(mapChore as (row: unknown) => unknown),
      occurrences,
      auditLog: auditRows.map(mapAuditEntry as (row: unknown) => unknown),
    });
  } catch (err) {
    next(err);
  }
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  const message = err instanceof Error ? err.message : 'Internal server error';
  res.status(500).json({ error: message });
});

// ── Boot ──────────────────────────────────────────────────────────────────────
async function start() {
  try {
    await runMigration();
    app.listen(PORT, () => {
      console.log(`[server] Listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('[server] Failed to start:', err);
    await pool.end();
    process.exit(1);
  }
}

start();
