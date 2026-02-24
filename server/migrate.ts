import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { pool } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function runMigration(): Promise<void> {
  const sql = readFileSync(join(__dirname, 'schema.pg.sql'), 'utf-8');
  await pool.query(sql);
  console.log('[migrate] Schema applied successfully');
}
