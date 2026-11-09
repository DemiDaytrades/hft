import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";

export type AvailabilityRule = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

function db() {
  return getCloudflareContext().env.DB;
}

function newId(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

function nowIso(): string {
  return new Date().toISOString();
}

function rowToRule(row: any): AvailabilityRule {
  return {
    id: row.id,
    dayOfWeek: row.day_of_week,
    startTime: row.start_time,
    endTime: row.end_time,
    enabled: row.enabled === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listAvailabilityRules(): Promise<AvailabilityRule[]> {
  const { results } = await db()
    .prepare(
      `SELECT * FROM "availability_rule" ORDER BY day_of_week ASC;`,
    )
    .all<AvailabilityRule>();
  return results.map(rowToRule);
}

export type CreateAvailabilityRuleInput = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  enabled: boolean;
};

export async function createOrUpdateAvailabilityRule(
  input: CreateAvailabilityRuleInput,
): Promise<AvailabilityRule> {
  const now = nowIso();

  // Upsert: unique index on day_of_week means insert-or-update.
  await db()
    .prepare(
      `INSERT INTO "availability_rule"
         (id, day_of_week, start_time, end_time, enabled, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(day_of_week) DO UPDATE SET
         start_time = excluded.start_time,
         end_time = excluded.end_time,
         enabled = excluded.enabled,
         updated_at = excluded.updated_at;`,
    )
    .bind(
      newId(),
      input.dayOfWeek,
      input.startTime,
      input.endTime,
      input.enabled ? 1 : 0,
      now,
      now,
    )
    .run();

  const { results } = await db()
    .prepare(
      `SELECT * FROM "availability_rule" WHERE day_of_week = ?;`,
    )
    .bind(input.dayOfWeek)
    .all<AvailabilityRule>();
  return results.map(rowToRule)[0];
}

export async function deleteAvailabilityRule(dayOfWeek: number): Promise<void> {
  await db()
    .prepare(`DELETE FROM "availability_rule" WHERE day_of_week = ?;`)
    .bind(dayOfWeek)
    .run();
}
