import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";
export async function getLatestPlan(userId: string) {
  const db = (await getCloudflareContext()).env.DB;
  return db.prepare(`SELECT * FROM "student_training_plan" WHERE "userId" = ? ORDER BY "createdAt" DESC LIMIT 1;`).bind(userId).first<any>();
}
export async function upsertPlan(userId: string, data: any, status: string, createdBy: string) {
  throw new Error('Manual Training Plans are historical and read-only. Use reviewed Learning Paths and Financial Plans.');
}
