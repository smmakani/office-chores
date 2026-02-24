import { Router } from 'express';
import { query } from '../db.js';
import { mapOccurrence } from '../mappers.js';
import type { OccurrenceOverride } from '../../src/types/index.js';

const router = Router();

// GET /api/occurrences  → Record<key, OccurrenceOverride>
router.get('/', async (_req, res, next) => {
  try {
    const rows = await query('SELECT * FROM occurrence_overrides');
    const record: Record<string, OccurrenceOverride> = {};
    for (const row of rows) {
      const ov = (mapOccurrence as (row: unknown) => OccurrenceOverride)(row);
      record[ov.key] = ov;
    }
    res.json(record);
  } catch (err) {
    next(err);
  }
});

// PUT /api/occurrences/:key  (upsert)
router.put('/:key', async (req, res, next) => {
  try {
    const key = decodeURIComponent(req.params.key);
    const o = req.body as OccurrenceOverride;
    await query(
      `INSERT INTO occurrence_overrides (
         key, template_id, original_date, rescheduled_date,
         completed, completed_by, completed_at, skipped, completion_note
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (key) DO UPDATE SET
         rescheduled_date = EXCLUDED.rescheduled_date,
         completed        = EXCLUDED.completed,
         completed_by     = EXCLUDED.completed_by,
         completed_at     = EXCLUDED.completed_at,
         skipped          = EXCLUDED.skipped,
         completion_note  = EXCLUDED.completion_note`,
      [
        key,
        o.templateId,
        o.originalDate,
        o.rescheduledDate ?? null,
        o.completed,
        o.completedBy ?? null,
        o.completedAt ?? null,
        o.skipped,
        o.completionNote ?? '',
      ]
    );
    res.json({ key });
  } catch (err) {
    next(err);
  }
});

export default router;
