export {};
const { test } = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');
let fail = true;
let resets: any[] = [];
let passwordWrites = 0;
const original = Module._load;
Module._load = function(id: string, ...args: any[]) {
  if (id === '@/lib/auth') return { getAuth: () => ({ api: {
    requestPasswordReset: async (args: any) => { resets.push(args); if (fail) throw new Error('private provider error'); return {status: true}; },
    setUserPassword: async () => { passwordWrites++; },
  } }) };
  if (id === '@/lib/dal') return { requireAdmin: async () => ({ id: 'staff' }) };
  if (id === 'next/headers') return { headers: async () => new Headers({ host: 'attacker.test' }) };
  if (id === 'next/cache') return { revalidatePath: () => {} };
  if (id === 'next/server') return { NextResponse: { json: (body: any, options: any) => Response.json(body, options) } };
  if (id === '@opennextjs/cloudflare') return { getCloudflareContext: () => ({ env: { DB: { prepare: () => ({ bind() { return this; }, first: async () => ({ id:'member', email: 'member@example.test' }) }) } } }) };
  if (id === '@/lib/auth-rate-limit-simple') return { hitRateLimit: () => false };
  if (id === '@/lib/invites' || id === '@/lib/communications') return {};
  return original.call(this, id, ...args);
};
const route = require('../app/api/admin/member-recovery/route');
const action = require('../app/(app)/admin/users/actions');
test('admin recovery reports failure, never replaces credentials, and uses a trusted relative reset destination', async () => {
  const request = () => new Request('https://example.test/api/admin/member-recovery', { method: 'POST', body: JSON.stringify({action:'send_reset', email:'member@example.test'}) });
  const failed = await route.POST(request());
  assert.equal(failed.status, 503);
  assert.equal((await failed.json()).ok, false);
  assert.equal(passwordWrites, 0);
  fail = false;
  assert.equal((await route.POST(request())).status, 200);
  assert.equal(resets[1].body.redirectTo, '/reset-password');
  assert.deepEqual(await action.sendMemberPasswordReset('member'), {ok:true});
  assert.equal(passwordWrites, 0);
  assert.equal(resets[2].body.redirectTo, '/reset-password');
});
