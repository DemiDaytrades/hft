export type IntakeSaveStatus = "idle" | "unsaved" | "saving" | "saved" | "error" | "conflict";

export type IntakeSaveResult =
  | { ok: true; intake: any }
  | { ok: false; status: number; error: string };

export function isConflictStatus(status: number): boolean {
  return status === 409;
}

export function mergeReconciledValues<T extends Record<string, unknown>>(
  latest: T,
  local: T,
  editedKeys: Iterable<string>,
): T {
  const merged: Record<string, unknown> = { ...latest };
  for (const key of editedKeys) {
    if (Object.prototype.hasOwnProperty.call(local, key)) merged[key] = local[key];
  }
  return merged as T;
}

export function shouldApplyServerValues(editVersionAtStart: number, currentEditVersion: number): boolean {
  return editVersionAtStart === currentEditVersion;
}

export function saveStatusLabel(
  status: IntakeSaveStatus,
  dirty: boolean,
  error?: string | null,
): string {
  if (status === "conflict") return "Draft changed elsewhere";
  if (status === "saving") return "Saving…";
  if (status === "error") return `Save failed${error ? `: ${error}` : ""}`;
  if (dirty) return "Unsaved changes";
  if (status === "saved") return "Saved";
  return "";
}
