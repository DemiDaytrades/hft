import "server-only";
import { requireAdmin } from "@/lib/dal";

export type IntakeAuthContext = { userId: string; role: string };

/**
 * Intake V2 Phase 2: admin/instructor-only (uses existing admin role/authorization).
 * Does not rely on hidden UI controls; server verifies on every request.
 */
export async function requireIntakeV2Staff(): Promise<IntakeAuthContext> {
  const user = await requireAdmin();
  return { userId: user.id, role: (user as any).role || "admin" };
}
