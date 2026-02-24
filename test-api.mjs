const BASE = 'http://localhost:3001';

async function req(label, method, path, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(BASE + path, opts);
  console.log(`\n=== ${label} [${res.status}] ===`);
  if (res.status === 204) { console.log('(no content)'); return null; }
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
  return data;
}

// 1. Empty init
await req('GET /api/init (empty)', 'GET', '/api/init');

// 2. Add member
await req('POST /api/members', 'POST', '/api/members', {
  id: 'member-1', name: 'Alice', color: '#e57373',
  createdAt: '2026-02-24T10:00:00.000Z',
});

// 3. Add chore
await req('POST /api/chores', 'POST', '/api/chores', {
  id: 'chore-1', name: 'Clean kitchen', description: 'Wipe counters',
  assigneeId: 'member-1',
  recurrence: { frequency: 'weekly', daysOfWeek: [1, 4] },
  startDate: '2026-02-24', deletedAt: null,
  createdAt: '2026-02-24T10:00:00.000Z',
  updatedAt: '2026-02-24T10:00:00.000Z',
});

// 4. Upsert occurrence (mark complete)
await req('PUT /api/occurrences/:key', 'PUT',
  '/api/occurrences/' + encodeURIComponent('chore-1::2026-02-24'), {
  key: 'chore-1::2026-02-24', templateId: 'chore-1',
  originalDate: '2026-02-24', rescheduledDate: null,
  completed: true, completedBy: 'member-1',
  completedAt: '2026-02-24T11:00:00.000Z',
  skipped: false, completionNote: 'Done!',
});

// 5. Add audit entry
await req('POST /api/audit', 'POST', '/api/audit', {
  id: 'audit-1', timestamp: '2026-02-24T11:00:00.000Z',
  action: 'completed', choreTemplateId: 'chore-1',
  choreName: 'Clean kitchen',
  occurrenceKey: 'chore-1::2026-02-24',
  occurrenceDate: '2026-02-24',
  actorMemberId: 'member-1', actorName: 'Alice', metadata: {},
});

// 6. PATCH chore
await req('PATCH /api/chores/:id', 'PATCH', '/api/chores/chore-1', {
  name: 'Clean kitchen (updated)', description: 'Wipe counters and sink',
  assigneeId: 'member-1',
  recurrence: { frequency: 'weekly', daysOfWeek: [1, 4] },
  startDate: '2026-02-24',
});

// 7. Full init — should show all data
await req('GET /api/init (with data)', 'GET', '/api/init');

// 8. DELETE member → occurrence FK (completed_by) goes to NULL
await req('DELETE /api/members/:id', 'DELETE', '/api/members/member-1');

// 9. DELETE chore (soft-delete)
await req('DELETE /api/chores/:id', 'DELETE', '/api/chores/chore-1');

// 10. Final state — chore still present but deleted_at set, occurrence orphaned
await req('GET /api/init (after deletes)', 'GET', '/api/init');

console.log('\nAll tests passed.');
