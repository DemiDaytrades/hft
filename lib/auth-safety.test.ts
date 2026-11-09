export {};
const { test } = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');
let forced = 1;
let databaseRole: string | undefined;
let session: any = { user: { id: 'member', role: 'student' } };
let membership: any = { subscriptionStatus: 'active' };
let options: any;
let writes = 0;
let providerConfigured = true;
let mailResult: any = { data: { id: 'mail' }, error: null };
const db = { prepare: () => ({ bind() { return this; }, async first() { return { ...membership, id: session?.user.id, must_change_password: forced, lifecycle_status: "ACTIVE", banned: 0, role: databaseRole ?? session?.user.role }; }, async run() { writes++; return {}; } }) };
const original = Module._load;
Module._load = function(id: string, ...args: any[]) {
  if (id === 'react') return { cache: (fn: any) => fn };
  if (id === 'next/headers') return { headers: async () => new Headers() };
  if (id === 'next/navigation') return { redirect: (path: string) => { throw new Error(`redirect:${path}`); } };
  if (id === '@opennextjs/cloudflare') return { getCloudflareContext: () => ({ env: { DB: db, BETTER_AUTH_SECRET: 'test', BETTER_AUTH_URL: 'https://example.test' } }) };
  if (id === 'better-auth') return { betterAuth: (config: any) => { options = config; return { api: { getSession: async () => session } }; } };
  if (id === 'better-auth/api') return { createAuthMiddleware: (fn: any) => fn, APIError: class APIError extends Error { constructor(_status: string, body: any) { super(body.message); } } };
  if (id === 'better-auth/plugins/admin') return { admin: () => ({}) };
  if (id === 'better-auth/plugins/admin/access') return {};
  if (id === 'better-auth/next-js') return { nextCookies: () => ({}) };
  if (id === '@/lib/communications/providers') return { getResend: () => providerConfigured ? ({ emails: { send: async () => mailResult } }) : null };
  if (id === './membership') return { getMembership: async () => membership, hasStudentAccess: (m: any) => m?.subscriptionStatus === 'active' || m?.comp === true };
  return original.call(this, id, ...args);
};
const dal = require('./dal');
const auth = require('./auth');
auth.getAuth();
test('forced setup blocks page and API even for paid membership, without blocking raw session gate', async () => {
  assert.equal((await dal.requireUser()).id, 'member');
  await assert.rejects(dal.requireActiveMember(), /redirect:\/account\/change-password/);
  await assert.rejects(dal.requireMemberApiUser(new Headers()), (e: any) => e.status === 403);
});
test('fresh setup state permits paid and comp, rejects expired access, handles unauthenticated', async () => {
  forced = 0;
  assert.equal((await dal.requireMemberApiUser(new Headers())).id, 'member');
  membership = { comp: true };
  assert.equal((await dal.requireMemberApiUser(new Headers())).id, 'member');
  membership = null;
  await assert.rejects(dal.requireMemberApiUser(new Headers()), (e: any) => e.status === 403);
  session = null;
  await assert.rejects(dal.requireMemberApiUser(new Headers()), (e: any) => e.status === 401);
  session = { user: { id: 'staff', role: 'admin' } };
  assert.equal((await dal.requireMemberApiUser(new Headers())).id, 'staff');
});
test('only successful password changes and completed resets clear setup', async () => {
  writes = 0;
  await options.hooks.after({ path: '/change-password', context: { returned: { message: 'bad password' }, session } });
  await options.hooks.after({ path: '/request-password-reset', context: { returned: { status: true }, session } });
  assert.equal(writes, 0);
  await options.hooks.after({ path: '/change-password', context: { returned: { token: null, user: session.user }, session } });
  assert.equal(writes, 1);
  await options.emailAndPassword.onPasswordReset({ user: session.user });
  assert.equal(writes, 2);
});
test('reset callback detects a provider-reported delivery error', async () => {
  mailResult = { error: { message: 'delivery rejected' }, data: null };
  await assert.rejects(options.emailAndPassword.sendResetPassword({ user: { id: 'member', email: 'member@example.test' }, url: 'https://example.test/reset' }), /Could not send/);
});

test('direct change-password cannot retain the temporary password while clearing setup', async () => {
  await assert.rejects(options.hooks.before({ path: '/change-password', body: { currentPassword: 'temporary', newPassword: 'temporary' } }), /different/);
});

test('reset requests fail before token generation when email provider is missing', async () => {
  providerConfigured = false;
  await assert.rejects(options.hooks.before({ path: '/request-password-reset' }), /not configured/);
});

test('generic permanent-delete auth endpoints are disabled pending retention policy', async () => {
  await assert.rejects(options.hooks.before({ path: '/admin/remove-user' }), /Permanent deletion is disabled/);
  await assert.rejects(options.hooks.before({ path: '/delete-user' }), /Permanent deletion is disabled/);
  await assert.rejects(options.hooks.before({ path: '/delete-user/callback' }), /Permanent deletion is disabled/);
});

test('a stale admin session cannot retain staff privileges after database role removal', async () => {
 databaseRole='student';membership=null;session={user:{id:'staff',role:'admin'}};
 await assert.rejects(dal.requireAdmin(), /redirect:\/dashboard/);
 await assert.rejects(dal.requireMemberApiUser(new Headers()), (e:any)=>e.status===403);
 databaseRole=undefined;
});
