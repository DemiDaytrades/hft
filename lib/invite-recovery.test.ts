export {};
const { test } = require("node:test");
const assert = require("node:assert/strict");
const Module = require("node:module");
let writes = 0;
let redeemed = 0;
let provisioned = 0;
let notification: any;
const original = Module._load;
Module._load = function(id: string, ...args: any[]) {
  if (id === "next/headers") return { headers: async () => new Headers({ host: "example.test" }) };
  if (id === "next/server") return { NextResponse: { json: (body: any, opts: any) => Response.json(body, opts) } };
  if (id === "@/lib/dal") return { requireAdmin: async () => ({ id: "admin1" }) };
  if (id === "@/lib/auth") return { getAuth: () => ({ api: {} }) };
  if (id === "@/lib/affiliates") return {};
  if (id === "@/lib/auth-rate-limit-simple") return { hitRateLimit: () => false };
  if (id === "@/lib/membership") return { findUserByEmail: async () => ({ id: "s1", email: "member@example.test" }) };
  if (id === "@/lib/complimentary-invitation") return {
    resendComplimentaryInvitation: async (_db: unknown, _actor: unknown, params: any) => {
      assert.deepEqual(params, { email: "member@example.test", channels: ["email"] });
      notification = { inviteUrl: "https://example.test/invite/pending-token", state: "existing_user_pending" };
      return { activationUrl: notification.inviteUrl };
    },
  };
  if (id === "@/lib/invites") return {
    createInvite: async () => ({ token: "pending-token" }),
    getInviteByToken: async () => ({ email: "member@example.test", kind: "member:30" }),
    inviteStatus: () => "valid",
    markInviteUsedForUser: async () => { redeemed++; },
  };
  if (id === "@/lib/provision-member") return { provisionMember: async () => { provisioned++; return { created: false, userId: "s1" }; } };
  if (id === "@/lib/communications") return {
    normalizePhone: () => null,
    notifyInvite: async (params: any) => { notification = params; return []; },
  };
  if (id === "@opennextjs/cloudflare") return { getCloudflareContext: () => ({ env: { DB: { prepare: () => ({ bind() { return this; }, first: async () => ({ id: "s1", email: "member@example.test", lifecycle_status: "ACTIVE", banned: 0 }), run: async () => { writes++; return { meta: { changes: 1 } }; } }) } } }) };
  return original.call(this, id, ...args);
};
const recovery = require("../app/api/admin/member-recovery/route");
const accept = require("../app/invite/[token]/actions");
test("existing-user recovery invite sends a redemption link, not an already-granted login notification", async () => {
  await recovery.POST(new Request("https://example.test/api/admin/member-recovery", { method: "POST", body: JSON.stringify({ action: "resend_invite", email: "member@example.test", kind: "member", duration: "30" }) }));
  assert.equal(notification.inviteUrl, "https://example.test/invite/pending-token");
  assert.equal(notification.state, "existing_user_pending");
  assert.equal(writes, 0);
});
test("existing member redeems valid comp invitation without entering or replacing a password", async () => {
  const form = new FormData();
  form.set("token", "pending-token");
  const result = await accept.acceptInviteAction({ status: "idle" }, form);
  assert.equal(result.status, "recovery");
  assert.equal(writes, 1);
  assert.equal(redeemed, 1);
  assert.equal(provisioned, 0);
});
