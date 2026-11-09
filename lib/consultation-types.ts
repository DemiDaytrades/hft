import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";

export type ConsultationType = {
  id: string;
  name: string;
  description: string;
  durationMin: number;
  priceCents: number;
  active: boolean;
  displayOrder: number;
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

function rowToType(row: any): ConsultationType {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    durationMin: row.duration_min,
    priceCents: row.price_cents,
    active: row.active === 1,
    displayOrder: row.display_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** All active consultation types, ordered by display_order then name. */
export async function listConsultationTypes(): Promise<ConsultationType[]> {
  const { results } = await db()
    .prepare(
      `SELECT * FROM "consultation_type"
       WHERE active = 1
       ORDER BY display_order ASC, name ASC;`,
    )
    .all<ConsultationType>();
  return results.map(rowToType);
}

/** All consultation types including inactive (admin view). */
export async function listAllConsultationTypes(): Promise<ConsultationType[]> {
  const { results } = await db()
    .prepare(
      `SELECT * FROM "consultation_type"
       ORDER BY display_order ASC, name ASC;`,
    )
    .all<ConsultationType>();
  return results.map(rowToType);
}

export async function getConsultationType(
  id: string,
): Promise<ConsultationType | null> {
  const row = await db()
    .prepare(`SELECT * FROM "consultation_type" WHERE id = ?;`)
    .bind(id)
    .first<ConsultationType>();
  if (!row) return null;
  return rowToType(row);
}

export type CreateConsultationTypeInput = {
  name: string;
  description?: string;
  durationMin: number;
  priceCents: number;
  active?: boolean;
  displayOrder?: number;
};

export async function createConsultationType(
  input: CreateConsultationTypeInput,
): Promise<ConsultationType> {
  const id = newId();
  const now = nowIso();

  await db()
    .prepare(
      `INSERT INTO "consultation_type"
         (id, name, description, duration_min, price_cents, active, display_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    )
    .bind(
      id,
      input.name,
      input.description ?? "",
      input.durationMin,
      input.priceCents,
      input.active ?? true ? 1 : 0,
      input.displayOrder ?? 0,
      now,
      now,
    )
    .run();

  const created = await getConsultationType(id);
  if (!created) throw new Error("Consultation type was not created.");
  return created;
}

export type UpdateConsultationTypeInput = {
  name?: string;
  description?: string;
  durationMin?: number;
  priceCents?: number;
  active?: boolean;
  displayOrder?: number;
};

export async function updateConsultationType(
  id: string,
  input: UpdateConsultationTypeInput,
): Promise<ConsultationType> {
  const existing = await getConsultationType(id);
  if (!existing) throw new Error("Consultation type not found.");

  const now = nowIso();

  await db()
    .prepare(
      `UPDATE "consultation_type"
       SET name = COALESCE(?, name),
           description = COALESCE(?, description),
           duration_min = COALESCE(?, duration_min),
           price_cents = COALESCE(?, price_cents),
           active = COALESCE(?, active),
           display_order = COALESCE(?, display_order),
           updated_at = ?
       WHERE id = ?;`,
    )
    .bind(
      input.name ?? null,
      input.description ?? null,
      input.durationMin ?? null,
      input.priceCents ?? null,
      input.active !== undefined ? (input.active ? 1 : 0) : null,
      input.displayOrder ?? null,
      now,
      id,
    )
    .run();

  const updated = await getConsultationType(id);
  if (!updated) throw new Error("Consultation type not found after update.");
  return updated;
}

export async function deleteConsultationType(id: string): Promise<void> {
  await db()
    .prepare(`DELETE FROM "consultation_type" WHERE id = ?;`)
    .bind(id)
    .run();
}
