import test from "node:test";
import assert from "node:assert/strict";
import Module from "node:module";
import { DatabaseSync } from "node:sqlite";

const sqlite = new DatabaseSync(":memory:");
sqlite.exec(`CREATE TABLE user (id TEXT PRIMARY KEY, complimentaryAccessStartsAt TEXT,
  complimentaryAccessExpiresAt TEXT, complimentaryAccessRevokedAt TEXT,
  complimentaryGrantedBy TEXT, updatedAt TEXT, subscriptionStatus TEXT);`);
const binding = { prepare(sql: string) { return { bind(...args: any[]) {
  return { async run() { const result = sqlite.prepare(sql).run(...args); return { meta: { changes: Number(result.changes) } }; },
    async first() { return sqlite.prepare(sql).get(...args) ?? null; } };
} }; } };
const load = (Module as any)._load;
(Module as any)._load = function(id: string, ...args: any[]) {
  if (id === "@opennextjs/cloudflare") return { getCloudflareContext: () => ({ env: { DB: binding } }) };
  if (id === "@/lib/dal") return { requireAdmin: async () => ({ id: "admin1" }) };
  if (id === "next/cache") return { revalidatePath() {} };
  if (id === "@/app/(app)/admin/users/actions") return {};
  return load.call(this, id, ...args);
};
const { extendComplimentary } = require("../app/(app)/admin/students/[id]/complimentary/actions");
(Module as any)._load = load;

test("extending a future grant adds days instead of shortening it", async () => {
  const end = new Date(Date.now() + 60 * 86400000).toISOString();
  sqlite.prepare("INSERT OR REPLACE INTO user (id, complimentaryAccessExpiresAt, subscriptionStatus) VALUES (?, ?, ?)").run("s1", end, "active");
  assert.deepEqual(await extendComplimentary("s1", 7), { ok: true });
  const row: any = sqlite.prepare("SELECT * FROM user WHERE id='s1'").get();
  assert.equal(Date.parse(row.complimentaryAccessExpiresAt), Date.parse(end) + 7 * 86400000);
  assert.equal(row.subscriptionStatus, "active");
  assert.equal(row.complimentaryGrantedBy, "admin1");
});
test("extending expired access starts from now and invalid durations do not mutate it", async () => {
  sqlite.prepare("INSERT OR REPLACE INTO user (id, complimentaryAccessExpiresAt, complimentaryAccessRevokedAt) VALUES (?, ?, ?)").run("s2", "2020-01-01", "2020-01-01");
  const before = Date.now();
  assert.deepEqual(await extendComplimentary("s2", 30), { ok: true });
  const row: any = sqlite.prepare("SELECT * FROM user WHERE id='s2'").get();
  assert.ok(Date.parse(row.complimentaryAccessExpiresAt) >= before + 30 * 86400000);
  assert.equal(row.complimentaryAccessRevokedAt, null);
  assert.equal((await extendComplimentary("s2", -7)).ok, false);
  assert.equal((sqlite.prepare("SELECT * FROM user WHERE id='s2'").get() as any).complimentaryAccessExpiresAt, row.complimentaryAccessExpiresAt);
});
