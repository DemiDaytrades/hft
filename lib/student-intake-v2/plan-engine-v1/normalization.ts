/**
 * PE-1 normalization (pure). Uses existing repo registries/constants; does not mutate inputs.
 * Does NOT convert money ranges to fake exact dollar amounts.
 * Preserved Q39–Q46 sparse canonical semantics are not guessed as negative.
 */
import type { StudentSectionsV2 } from "../contracts";
import { PHASE3D_FORM_VERSION, PHASE3E_FORM_VERSION, PHASE3F_FORM_VERSION, requiresMonthlyObligationsAtCompletion, requiresTradingCapitalReadinessAtCompletion, requiresTradingBehaviorAtCompletion } from "../validation";
import {
  FH_AFFORDABLE_LOSS_ZERO_VALUES,
  FH_AVAILABLE_CAPITAL_ZERO_VALUES,
  FH_EMERGENCY_FUND_ZERO_VALUES,
  FH_PRESSURE_MODERATE_OR_STRONG,
  FH_PRESSURE_STRONG,
  FH_UNEXPECTED_NEEDS_BORROW_OR_CANNOT,
} from "../financial-health-registry";
import { MO_NOT_SURE, MO_PNTS, MO_PNTS_ANSWER, isMoPnTSEquivalent } from "../monthly-obligations-registry";
import { TC_NOT_SURE, TC_PNTS, TC_PNTS_ANSWER, isTcPnTSEquivalent } from "../trading-capital-readiness-registry";
import { PF_PNTS_ANSWER } from "../trading-behavior-registry";
import { DC_NOT_SURE, DC_PNTS } from "../debt-credit-registry";
import type { ExplanationReason, PlanEngineInput, PlanEngineValueStatus, SourceSnapshotReference, SourceValueCategory } from "./contracts";

export function snapshotRef(input: PlanEngineInput, computedAt: string): SourceSnapshotReference {
  return {
    intake_id: input.intake_id,
    snapshot_version: input.snapshot_version,
    completed_at: input.completed_at,
    form_version: input.form_version,
    schema_version: input.schema_version,
    status: input.status,
  };
}

export function fv<T>(sections: StudentSectionsV2 | Record<string, any> | null | undefined, key: string): T | undefined {
  const f = (sections as any)?.[key];
  if (f && typeof f === "object" && "value" in f) return f.value as T;
  return undefined;
}

export function isPnTS(v: unknown): boolean {
  if (v && typeof v === "object") return Object.values(v).some(isPnTS);
  return v === "Prefer not to say" || v === "Prefer not to answer" || v === PF_PNTS_ANSWER || v === TC_PNTS_ANSWER || v === MO_PNTS_ANSWER || v === DC_PNTS || v === MO_PNTS || v === TC_PNTS;
}
export function isNotSure(v: unknown): boolean {
  if (v && typeof v === "object") return Object.values(v).some(isNotSure);
  if (typeof v !== "string") return false;
  return /^(unknown|unsure|not sure|not sure yet)$/i.test(v.trim()) || v === DC_NOT_SURE || v === MO_NOT_SURE || v === TC_NOT_SURE || v === "Not sure yet" || v === "Not sure" || v === "Unsure" || v === "I don't know";
}
export function isBeginnerNoExperience(v: unknown): boolean {
  if (typeof v !== "string") return false;
  const s = v.toLowerCase();
  return (
    s.includes("not traded enough") || s.includes("have not traded live") || s === "i am not trading live" ||
    s.includes("no defined trading rules") || s.includes("no defined trading plan") || s.includes("no defined setups") ||
    s.includes("not currently use a planned loss limit") || s.includes("not currently use planned protective exits") ||
    s.includes("not applicable / i have not traded") || s.includes("none yet") || s === "not live trading yet" ||
    s === "not funded yet" || s === "not funding live trading yet" || s === "demo/paper trading only"
  );
}
export function isMissing(v: unknown): boolean {
  if (v === null || v === undefined) return true;
  if (typeof v === "string" && v.trim() === "") return true;
  if (v && typeof v === "object" && Object.values(v).every(isMissing)) return true;
  return false;
}

export function categorizeValue(v: unknown, formVersion: string, collected: boolean): { status: PlanEngineValueStatus; category: SourceValueCategory } {
  if (!collected) return { status: "NOT_COLLECTED_FOR_VERSION", category: "NOT_COLLECTED_FOR_VERSION" };
  if (isMissing(v)) return { status: "INSUFFICIENT_INFORMATION", category: "MISSING" };
  if (isPnTS(v)) return { status: "UNKNOWN", category: "PNTS" };
  if (Array.isArray(v) && v.length === 1 && isPnTS(v[0])) return { status: "UNKNOWN", category: "PNTS" };
  if (isNotSure(v)) return { status: "UNKNOWN", category: "NOT_SURE" };
  if (Array.isArray(v) && v.length === 1 && isNotSure(v[0])) return { status: "UNKNOWN", category: "NOT_SURE" };
  if (isBeginnerNoExperience(v)) return { status: "KNOWN", category: "BEGINNER_NO_EXPERIENCE" };
  if (Array.isArray(v) && v.some(isBeginnerNoExperience)) return { status: "KNOWN", category: "BEGINNER_NO_EXPERIENCE" };
  if (typeof v === "string" && (/^\$|^Under |^Below |[–-]/.test(v) || /%|hours?|minutes?/i.test(v) === false && v.includes("$"))) return { status: "KNOWN", category: "RANGE_SELECTED" };
  return { status: "KNOWN", category: "EXACT_CATEGORY" };
}

const KNOWN_VERSIONS = new Set<string>([
  PHASE3F_FORM_VERSION,
  PHASE3E_FORM_VERSION,
  PHASE3D_FORM_VERSION,
  "hft_intake_v2_form.2026-11-05_phase3c",
  "hft_intake_v2_form.2026-11-05_phase3b",
  "hft_intake_v2_form.2026-11-05",
]);
export function isKnownFormVersion(formVersion: string | null | undefined): boolean {
  return typeof formVersion === "string" && KNOWN_VERSIONS.has(formVersion);
}
// PE-1 lineage: collected-in-version (not completion-required). Unknown/custom => false (fail safe).
export function collectedFor(formVersion: string | null | undefined, section: "MO" | "TC" | "PF"): boolean {
  if (!isKnownFormVersion(formVersion)) return false;
  if (section === "MO") return formVersion === PHASE3D_FORM_VERSION || formVersion === PHASE3E_FORM_VERSION || formVersion === PHASE3F_FORM_VERSION;
  if (section === "TC") return formVersion === PHASE3E_FORM_VERSION || formVersion === PHASE3F_FORM_VERSION;
  return formVersion === PHASE3F_FORM_VERSION;
}

export function reason(
  intakeId: string,
  key: string,
  owner: ExplanationReason["source_owner"],
  value: unknown,
  formVersion: string,
  collected: boolean,
  contribution: ExplanationReason["contribution"],
  note: string,
  provenance?: Record<string, any> | null,
): ExplanationReason {
  const cat = categorizeValue(value, formVersion, collected);
  const pref = provenance?.[key];
  return {
    source_key: key,
    source_owner: owner,
    source_value_category: cat.category,
    display_value: value == null ? undefined : displayValue(value),
    provenance_reference: { intake_id: intakeId, field: key, source: pref?.source, entered_by_user_id: pref?.entered_by_user_id, entered_at: pref?.entered_at },
    contribution,
    note,
  };
}

export function include(items: string[] | readonly string[], value: unknown): boolean {
  if (Array.isArray(value)) return value.some((v) => items.includes(String(v)));
  return typeof value === "string" && items.includes(value);
}

export function anyMatch(set: Set<string>, value: unknown): boolean {
  if (Array.isArray(value)) return value.some((v) => set.has(String(v)));
  return typeof value === "string" && set.has(value);
}

// Authoritative registry-based helpers (no fake numeric conversions)
export { FH_PRESSURE_MODERATE_OR_STRONG, FH_PRESSURE_STRONG, FH_UNEXPECTED_NEEDS_BORROW_OR_CANNOT, FH_AVAILABLE_CAPITAL_ZERO_VALUES, FH_AFFORDABLE_LOSS_ZERO_VALUES, FH_EMERGENCY_FUND_ZERO_VALUES };
export { isMoPnTSEquivalent, isTcPnTSEquivalent };
export const VERSION_KNOWN = { PHASE3D_FORM_VERSION, PHASE3E_FORM_VERSION, PHASE3F_FORM_VERSION };

/** Human-readable source values without numeric coercion. */
export function displayValue(value: unknown): string {
  if (value == null) return "Not supplied";
  if (Array.isArray(value)) return value.length ? value.map(displayValue).join("; ") : "Not supplied";
  if (typeof value === "object") return Object.entries(value).map(([key,v])=>`${key}: ${displayValue(v)}`).join("; ") || "Not supplied";
  return String(value);
}
