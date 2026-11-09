import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

async function db() { return (await getCloudflareContext()).env.DB; }

export async function getPlacement(userId: string) {
  return (await db()).prepare(`SELECT * FROM "student_placement" WHERE "userId" = ?;`).bind(userId).first<any>();
}

export async function upsertPlacement(userId: string, fields: any, adminId: string) {
  throw new Error('Manual HFT Placement is historical and read-only. Use the reviewed Personalized Learning Path.');
}
