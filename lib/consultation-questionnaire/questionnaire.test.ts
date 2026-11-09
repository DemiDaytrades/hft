// @ts-nocheck -- behavioral fixtures intentionally model a minimal D1 interface.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');
const path = require('node:path');
function load(file, mocks = {}) {
  const full = path.resolve(file);
  const original = Module._load;
  for (const key of Object.keys(require.cache)) if (key.includes('/consultation-questionnaire/')) delete require.cache[key];
  delete require.cache[full];
  Module._load = function(name, ...args) {
    if (Object.hasOwn(mocks, name)) return mocks[name];
    return original.call(this, name, ...args);
  };
  try { return require(full); } finally { Module._load = original; }
}
const privateData = { instructorNotes: 'secret', strengthsIdentified: 'private', areasToFocus: 'private', recommendedStart: 'private', personalizedPlan: 'private', actionItems: 'private', futureSecret: 'private' };
function service(status = 'draft') {
  let writes = 0;
  const row = { id: 'q1', user_id: 'u1', status, data: JSON.stringify({ aboutYourself: 'old', motivation: 'keep', ...privateData }) };
  const db = { prepare(sql) { return { bind(...args) { return { async first() { return args.includes('foreign') ? null : row; }, async run() { writes++; if (sql.startsWith('UPDATE')) row.data = args[0]; return {meta:{changes:1}}; } }; } }; } };
  db.batch = async statements => { const results=[]; for (const stmt of statements) results.push(await stmt.run()); return results; };
  return { api: load('lib/consultation-questionnaire/index.ts', { '@opennextjs/cloudflare': { getCloudflareContext: () => ({ env: { DB: db } }) } }), row, writes: () => writes };
}
test('student reads contain only allowlisted answer fields', async () => {
  const { api } = service();
  assert.deepEqual((await api.getQuestionnaireForUser('u1')).data, { aboutYourself: 'old', motivation: 'keep' });
});
test('student draft updates preserve private and omitted stored answers', async () => {
  const { api, row } = service();
  const result = await api.saveQuestionnaireDraft({ id: 'q1', userId: 'u1', data: { aboutYourself: 'new', instructorNotes: 'overwrite', futureSecret: 'overwrite' } });
  assert.deepEqual(JSON.parse(row.data), { aboutYourself: 'new', motivation: 'keep', ...privateData });
  assert.deepEqual(result.data, { aboutYourself: 'new', motivation: 'keep' });
});
test('submitted student records reject save and submit without writes', async () => {
  const { api, writes } = service('submitted');
  for (const method of ['saveQuestionnaireDraft', 'submitQuestionnaire']) await assert.rejects(api[method]({ id: 'q1', userId: 'u1', data: {} }), /submitted/i);
  assert.equal(writes(), 0);
});
test('student launch POST denies every action without accessing questionnaire storage', async () => {
  const api = load('app/api/consultation/questionnaire/route.ts', { 'next/server': { NextResponse: { json: (body, options) => ({ body, status: options?.status || 200 }) } }, '@/lib/dal': { requireActiveMember: async () => ({ id: 'u1' }) }, '@/lib/consultation-questionnaire': new Proxy({}, { get() { throw new Error('storage accessed'); } }) });
  for (const action of ['create', 'get-or-create', 'save', 'submit']) {
    const response = await api.POST(new Request('https://example.test', { method: 'POST', body: JSON.stringify({ action }) }));
    assert.equal(response.status, 403);
  }
});
test('student serializer drops nested private keys and malformed bill values', () => {
  const { studentQuestionnaireData } = load('lib/consultation-questionnaire/student-data.ts');
  assert.deepEqual(studentQuestionnaireData({ customBills: [{ id: 'b', name: 'Rent', amount: '12', secret: 'hidden' }], aboutYourself: { secret: true } }), { customBills: [{ id: 'b', name: 'Rent', amount: '12' }] });
  assert.deepEqual(studentQuestionnaireData({ customBills: 'malformed' }), {});
});
test('foreign questionnaire IDs reject without writes', async () => {
  const { api, writes } = service();
  for (const method of ['saveQuestionnaireDraft', 'submitQuestionnaire']) await assert.rejects(api[method]({ id: 'foreign', userId: 'u1', data: {} }), /not found/i);
  assert.equal(writes(), 0);
});
test('student projection preserves observed multiselect arrays without widening private shapes', () => {
  const { studentQuestionnaireData } = load('lib/consultation-questionnaire/student-data.ts');
  const values = { marketsTraded: ['Forex'], platformsUsed: ['MT5'], learningMethods: ['Reading'], preferredStudyTimes: ['Morning'], learningPrefs: ['Hands-on practice'], accountabilityPrefs: ['Weekly check-ins'], devices: ['Mobile'], focusAreas: ['Risk Management'] };
  assert.deepEqual(studentQuestionnaireData({ ...values, instructorNotes: ['secret'], unknownArray: ['secret'], motivation: ['malformed'], devicesOther: [{ secret: true }] }), values);
  assert.deepEqual(studentQuestionnaireData({ learningPrefs: ['Reading', { secret: 'nested' }], accountabilityPrefs: [7] }), {});
});
