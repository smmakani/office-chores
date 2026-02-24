import { Router } from 'express';
import { query } from '../db.js';
import { mapAuditEntry } from '../mappers.js';
import type { AuditLogEntry } from '../../src/types/index.js';

const router = Router();

// GET /api/audit  (limit 1000, newest first)
router.get('/', async (_req, res, next) => {
  try {
    const rows = await query(
      'SELECT * FROM audit_log ORDER BY timestamp DESC LIMIT 1000'
    );
    res.json(rows.map(mapAuditEntry as (row: unknown) => AuditLogEntry));
  } catch (err) {
    next(err);
  }
});

// POST /api/audit
router.post('/', async (req, res, next) => {
  try {
    const e = req.body as AuditLogEntry;
    await query(
      `INSERT INTO audit_log (
         id, timestamp, action, chore_template_id, chore_name,
         occurrence_key, occurrence_date, actor_member_id, actor_name, metadata
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (id) DO NOTHING`,
      [
        e.id,
        e.timestamp,
        e.action,
        e.choreTemplateId ?? null,
        e.choreName,
        e.occurrenceKey ?? null,
        e.occurrenceDate ?? null,
        e.actorMemberId ?? null,
        e.actorName ?? null,
        JSON.stringify(e.metadata ?? {}),
      ]
    );
    res.status(201).json({ id: e.id });
  } catch (err) {
    next(err);
  }
});

export default router;
