import { Router } from 'express';
import { query } from '../db.js';
import { mapChore } from '../mappers.js';
import type { ChoreTemplate } from '../../src/types/index.js';

const router = Router();

// GET /api/chores
router.get('/', async (_req, res, next) => {
  try {
    const rows = await query('SELECT * FROM chore_templates ORDER BY created_at');
    res.json(rows.map(mapChore as (row: unknown) => ChoreTemplate));
  } catch (err) {
    next(err);
  }
});

// POST /api/chores
router.post('/', async (req, res, next) => {
  try {
    const t = req.body as ChoreTemplate;
    await query(
      `INSERT INTO chore_templates (
         id, name, description, assignee_id,
         recurrence_frequency, recurrence_days_of_week,
         recurrence_day_of_month, recurrence_end_date,
         start_date, deleted_at, created_at, updated_at
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       ON CONFLICT (id) DO NOTHING`,
      [
        t.id,
        t.name,
        t.description,
        t.assigneeId,
        t.recurrence.frequency,
        t.recurrence.daysOfWeek ? JSON.stringify(t.recurrence.daysOfWeek) : null,
        t.recurrence.dayOfMonth ?? null,
        t.recurrence.endDate ?? null,
        t.startDate,
        t.deletedAt,
        t.createdAt,
        t.updatedAt,
      ]
    );
    res.status(201).json({ id: t.id });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/chores/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const t = req.body as Partial<ChoreTemplate> & { recurrence?: ChoreTemplate['recurrence'] };
    const updatedAt = new Date().toISOString();
    await query(
      `UPDATE chore_templates SET
         name = COALESCE($1, name),
         description = COALESCE($2, description),
         assignee_id = $3,
         recurrence_frequency = COALESCE($4, recurrence_frequency),
         recurrence_days_of_week = $5,
         recurrence_day_of_month = $6,
         recurrence_end_date = $7,
         start_date = COALESCE($8, start_date),
         updated_at = $9
       WHERE id = $10`,
      [
        t.name ?? null,
        t.description ?? null,
        t.assigneeId !== undefined ? t.assigneeId : null,
        t.recurrence?.frequency ?? null,
        t.recurrence?.daysOfWeek ? JSON.stringify(t.recurrence.daysOfWeek) : null,
        t.recurrence?.dayOfMonth ?? null,
        t.recurrence?.endDate ?? null,
        t.startDate ?? null,
        updatedAt,
        req.params.id,
      ]
    );
    res.json({ id: req.params.id });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/chores/:id  (soft-delete)
router.delete('/:id', async (req, res, next) => {
  try {
    const deletedAt = new Date().toISOString();
    await query(
      'UPDATE chore_templates SET deleted_at = $1 WHERE id = $2',
      [deletedAt, req.params.id]
    );
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
