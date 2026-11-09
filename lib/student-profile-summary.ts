import { hasStudentAccess, isActive, isComplimentaryActive, membershipLabel } from "./membership-access";

export type StatusTone = "neutral" | "active" | "complete" | "pending" | "blocked";

export type StatusSummary = {
  label: string;
  detail: string;
  tone: StatusTone;
};

type CanonicalAssessment = {
  status?: string | null;
  updated_at?: string | null;
  completed_at?: string | null;
} | null;

type LearningPath = {
  status?: string | null;
  version?: number | null;
  student_json?: string | null;
  approved_at?: string | null;
} | null;

type FinancialPlan = {
  status?: string | null;
  version?: number | null;
  published_version?: number | null;
  published_at?: string | null;
} | null;

export function humanize(value: string | null | undefined): string {
  if (!value) return "";
  const text = value.replaceAll("_", " ").replaceAll("-", " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatProfileDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", { timeZone: "America/Chicago", month: "short", day: "numeric", year: "numeric" });
}

export function formatProfileDateTime(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString("en-US", {
    timeZone: "America/Chicago",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function legacyIntakeStatusLabel(status: string | null | undefined): string {
  if (!status) return "Not Started";
  if (status === "completed") return "Completed";
  if (status === "draft") return "Draft";
  return humanize(status);
}

export function legacyQuestionnaireStatusLabel(questionnaire: { status?: string | null; data?: unknown } | null | undefined): string {
  if (questionnaire?.status === "submitted") return "Completed";
  if (questionnaire?.status === "in_progress") return "In Progress";
  if (questionnaire?.status === "draft") {
    const hasData = !!questionnaire.data && typeof questionnaire.data === "object" && Object.keys(questionnaire.data).length > 0;
    return hasData ? "In Progress" : "Not Started";
  }
  return "Not Started";
}

export function canonicalAssessmentStatus(active: CanonicalAssessment, completed: CanonicalAssessment): StatusSummary {
  const completedDetail = completed?.completed_at ? `Latest completed ${formatProfileDate(completed.completed_at)}` : null;
  if (active) {
    const updated = formatProfileDateTime(active.updated_at);
    return {
      label: active.status === "in_progress" ? "In progress" : "Draft",
      detail: [updated ? `Updated ${updated}` : null, completedDetail].filter(Boolean).join(" · "),
      tone: active.status === "in_progress" ? "pending" : "neutral",
    };
  }
  if (completed) {
    return {
      label: "Completed",
      detail: completedDetail ?? "Latest canonical assessment completed",
      tone: "complete",
    };
  }
  return { label: "Not started", detail: "No canonical assessment recorded", tone: "neutral" };
}

export function membershipStatus(user: any, now = Date.now()): StatusSummary {
  if (user?.lifecycle_status === "DEACTIVATED") {
    return { label: "Former student", detail: "Lifecycle deactivated", tone: "blocked" };
  }
  if (isComplimentaryActive(user, now)) {
    const expiry = formatProfileDate(user?.complimentaryAccessExpiresAt);
    return { label: "Complimentary access", detail: expiry ? `Expires ${expiry}` : "Active complimentary access", tone: "active" };
  }
  if (isActive(user?.subscriptionStatus)) {
    return {
      label: membershipLabel(user, now),
      detail: user?.subscriptionStatus === "trialing" ? "Trial subscription" : "Paid subscription",
      tone: "active",
    };
  }
  return { label: "Inactive", detail: "No active membership or complimentary access", tone: "blocked" };
}

export function academyAccessStatus(user: any, now = Date.now()): StatusSummary {
  if (user?.lifecycle_status === "DEACTIVATED") {
    return { label: "Blocked", detail: "Former student — historical access only", tone: "blocked" };
  }
  if (user?.banned) {
    return { label: "Blocked", detail: "Account unavailable", tone: "blocked" };
  }
  if (user?.must_change_password) {
    return { label: "Blocked", detail: "Password change required", tone: "pending" };
  }
  if (hasStudentAccess(user, now)) {
    return { label: "Active", detail: "Valid membership or complimentary entitlement", tone: "complete" };
  }
  return { label: "Blocked", detail: "No valid membership or complimentary access", tone: "blocked" };
}

function pathOverall(path: LearningPath): string | null {
  if (!path?.student_json) return null;
  try {
    const value = JSON.parse(path.student_json);
    return typeof value?.overall === "string" ? value.overall : null;
  } catch {
    return null;
  }
}

export function instructorPlacementStatus(path: LearningPath, legacyPlacement: any): StatusSummary {
  if (path?.status === "APPROVED") {
    const overall = pathOverall(path);
    return {
      label: overall ? humanize(overall) : "Reviewed — insufficient evidence",
      detail: `Instructor-approved learning path v${path.version ?? "—"}`,
      tone: overall ? "complete" : "pending",
    };
  }
  if (path?.status === "DRAFT") {
    return { label: "Pending approval", detail: `Learning path v${path.version ?? "—"} is in draft`, tone: "pending" };
  }
  if (legacyPlacement?.instructorLevel || legacyPlacement?.instructorTrack) {
    return { label: "Legacy placement only", detail: "Current instructor review is pending", tone: "pending" };
  }
  return { label: "Not reviewed", detail: "No instructor-approved learning path", tone: "neutral" };
}

export function learningPathStatus(path: LearningPath): StatusSummary {
  if (!path) {
    return { label: "Not started", detail: "No personalized learning path", tone: "neutral" };
  }
  if (path.status === "APPROVED") {
    const overall = pathOverall(path);
    const approved = formatProfileDate(path.approved_at);
    return {
      label: `Approved v${path.version ?? "—"}`,
      detail: [overall ? `${humanize(overall)} placement` : "Approved · insufficient evidence for level", approved ? `Approved ${approved}` : null].filter(Boolean).join(" · "),
      tone: "complete",
    };
  }
  if (path.status === "DRAFT") {
    return { label: `Draft v${path.version ?? "—"}`, detail: "Awaiting instructor approval", tone: "pending" };
  }
  return { label: `${humanize(path.status)} v${path.version ?? "—"}`, detail: "Historical version", tone: "neutral" };
}

export function financialPlanStatus(plan: FinancialPlan): StatusSummary {
  if (!plan) {
    return { label: "Not started", detail: "No financial readiness plan", tone: "neutral" };
  }
  const version = `v${plan.version ?? "—"}`;
  const published = plan.published_version ? ` · v${plan.published_version} published` : "";
  if (plan.status === "PUBLISHED") {
    const publishedAt = formatProfileDate(plan.published_at);
    return { label: `Published ${version}`, detail: publishedAt ? `Published ${publishedAt}` : "Published to student", tone: "complete" };
  }
  if (plan.status === "APPROVED") {
    return { label: `Approved ${version}`, detail: `Approved — awaiting publication${published}`, tone: "pending" };
  }
  if (plan.status === "REVIEW") {
    return { label: `In review ${version}`, detail: `Instructor review in progress${published}`, tone: "pending" };
  }
  if (plan.status === "DRAFT") {
    return { label: `Draft ${version}`, detail: `Draft — not published${published}`, tone: "pending" };
  }
  return { label: `${humanize(plan.status)} ${version}`, detail: `Historical version${published}`, tone: "neutral" };
}

export function assignmentStatusLabel(status: string | null | undefined): string {
  if (!status) return "Unknown";
  if (status === "assigned") return "Assigned";
  if (status === "completed") return "Completed";
  if (status === "revoked") return "Revoked";
  return humanize(status);
}
