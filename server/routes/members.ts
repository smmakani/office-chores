import { Router } from 'express';
import { query } from '../db.js';
import { mapMember } from '../mappers.js';

const router = Router();

// GET /api/members
router.get('/', async (_req, res, next) => {
  try {
    const rows = await query('SELECT * FROM team_members ORDER BY created_at');
    res.json(rows.map(mapMember as (row: unknown) => unknown));
  } catch (err) {
    next(err);
  }
});

// POST /api/members
router.post('/', async (req, res, next) => {
  try {
    const { id, name, color, createdAt } = req.body as {
      id: string;
      name: string;
      color: string;
      createdAt: string;
    };
    await query(
      `INSERT INTO team_members (id, name, color, created_at)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO NOTHING`,
      [id, name, color, createdAt]
    );
    res.status(201).json({ id });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/members/:id
router.delete('/:id', async (req, res, next) => {
  try {
    await query('DELETE FROM team_members WHERE id = $1', [req.params.id]);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
