import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import Module from "node:module";
import path from "node:path";

function loadModule(file: string, mocks: Record<string, any> = {}) {
  const original = (Module as any)._load;
  delete require.cache[path.resolve(file)];
  (Module as any)._load = function (name: string, ...args: any[]) {
    return Object.hasOwn(mocks, name) ? mocks[name] : original.call(this, name, ...args);
  };
  try {
    return require(path.resolve(file));
  } finally {
    (Module as any)._load = original;
  }
}

type SyntheticProfileFixture = {
  user: any;
  intake?: any;
  placement?: any;
  questionnaire?: any;
  booking?: any;
  canonicalDraft?: any;
  canonicalCompleted?: any;
  trainingPlan?: any;
  learningPath?: any;
  financialPlan?: any;
  assignments?: any[];
};

function createMockDb(fixture: SyntheticProfileFixture) {
  return {
    prepare(sql: string) {
      return {
        bind(..._args: any[]) {
          return this;
        },
        async first<T = any>(): Promise<T | null> {
          if (sql.includes('FROM "user"')) {
            return fixture.user ?? null;
          }
          if (sql.includes("learning_path_series")) {
            return fixture.learningPath ?? null;
          }
          if (sql.includes("financial_plan_series")) {
            return fixture.financialPlan ?? null;
          }
          if (sql.includes("student_course_assignment") && sql.includes("SELECT id FROM")) {
            return null;
          }
          return null;
        },
        async all<T = any>(): Promise<{ results: T[] }> {
          if (sql.includes("student_course_assignment")) {
            return { results: (fixture.assignments ?? []) as T[] };
          }
          if (sql.includes("academy_course")) {
            return {
              results: [
                { id: "c1", title: "Foundations of Trading", track: "Foundations", sort_order: 1 },
                { id: "c2", title: "Market Structure", track: "Developing Trader", sort_order: 2 },
              ] as T[],
            };
          }
          return { results: [] };
        },
        async run() {
          return { meta: { changes: 1 } };
        },
      };
    },
  };
}

function loadProfilePage(fixture: SyntheticProfileFixture) {
  const mockDb = createMockDb(fixture);
  return loadModule("app/(app)/admin/students/[id]/page.tsx", {
    "next/navigation": {
      useRouter: () => ({ refresh: () => {}, push: () => {} }),
      notFound: () => {
        throw new Error("NEXT_NOT_FOUND");
      },
    },
    "@/lib/dal": {
      requireAdmin: async () => ({ id: "synthetic-admin", role: "admin" }),
    },
    "@opennextjs/cloudflare": {
      getCloudflareContext: async () => ({ env: { DB: mockDb } }),
    },
    "@/lib/student-intake": {
      getLatestIntake: async () => fixture.intake ?? null,
    },
    "@/lib/student-intake-v2/service": {
      getActiveDraftForStudent: async () => fixture.canonicalDraft ?? null,
      getLatestCompletedIntake: async () => fixture.canonicalCompleted ?? null,
    },
    "@/lib/student-placement": {
      getPlacement: async () => fixture.placement ?? null,
    },
    "@/lib/consultation-questionnaire/admin": {
      getQuestionnaireForUserId: async () => fixture.questionnaire ?? null,
    },
    "@/lib/bookings": {
      getActiveBookingForUser: async () => fixture.booking ?? null,
    },
    "@/lib/training-plan": {
      getLatestPlan: async () => fixture.trainingPlan ?? null,
    },
  }).default;
}

function loadAcademyPage(fixture: SyntheticProfileFixture) {
  const mockDb = createMockDb(fixture);
  return loadModule("app/(app)/admin/students/[id]/academy/page.tsx", {
    "next/navigation": {
      useRouter: () => ({ refresh: () => {}, push: () => {} }),
      redirect: (url: string) => url,
    },
    "@/lib/dal": {
      requireAdmin: async () => ({ id: "synthetic-admin", role: "admin" }),
    },
    "@/lib/academy": {
      db: () => mockDb,
      newId: () => "synthetic-new-id",
      nowIso: () => "2026-11-09T12:00:00Z",
    },
    "@/lib/student-placement": {
      getPlacement: async () => fixture.placement ?? null,
    },
  }).default;
}

test("Case 1: Active paid student renders approved learning path and correct CTA", async () => {
  const studentId = "syn-active-001";
  const fixture: SyntheticProfileFixture = {
    user: {
      id: studentId,
      name: "Alex Active",
      email: "alex.synthetic@example.invalid",
      role: "student",
      banned: 0,
      must_change_password: 0,
      subscriptionStatus: "active",
      complimentaryAccessStartsAt: null,
      complimentaryAccessExpiresAt: null,
      complimentaryAccessRevokedAt: null,
      lifecycle_status: "ACTIVE",
      createdAt: "2026-09-01T12:00:00.000Z",
    },
    learningPath: {
      version: 2,
      status: "APPROVED",
      student_json: JSON.stringify({ overall: "BEGINNER" }),
      approved_at: "2026-11-01T12:00:00.000Z",
    },
    financialPlan: {
      version: 1,
      status: "PUBLISHED",
      published_version: 1,
      published_at: "2026-11-02T12:00:00.000Z",
    },
    assignments: [
      { id: "as-1", title: "Foundations of Trading", track: "Foundations", status: "assigned" },
    ],
  };

  const Page = loadProfilePage(fixture);
  const element = await Page({ params: Promise.resolve({ id: studentId }) });
  const html = renderToStaticMarkup(element);

  // Student header
  assert.match(html, /Alex Active/);
  assert.match(html, /alex\.synthetic@example\.invalid/);
  assert.match(html, /Paid membership/);

  // Status cards
  assert.match(html, /Beginner/);
  assert.match(html, /Instructor-approved learning path v2/);
  assert.match(html, /Approved v2/);
  assert.match(html, /Published v1/);

  // Primary CTA selects the student
  assert.match(html, /href="\/admin\/student-intake-v2\?studentUserId=syn-active-001"/);
  assert.match(html, />Start assessment</);

  // Collapsible sections remain closed by default (zero 'open' attributes)
  const openDetails = html.match(/<details[^>]*\bopen\b/gi);
  assert.equal(openDetails, null, "Details sections must remain closed by default");
});

test("Case 2: Complimentary access student (active vs expired vs revoked)", async () => {
  const studentId = "syn-comp-002";
  const activeFixture: SyntheticProfileFixture = {
    user: {
      id: studentId,
      name: "Chris Comp",
      email: "chris.comp@example.invalid",
      role: "student",
      banned: 0,
      must_change_password: 0,
      subscriptionStatus: "none",
      complimentaryAccessStartsAt: "2026-11-01T00:00:00.000Z",
      complimentaryAccessExpiresAt: "2026-12-15T00:00:00.000Z",
      complimentaryAccessRevokedAt: null,
      lifecycle_status: "ACTIVE",
      createdAt: "2026-11-01T12:00:00.000Z",
    },
  };

  const Page = loadProfilePage(activeFixture);
  const html = renderToStaticMarkup(await Page({ params: Promise.resolve({ id: studentId }) }));

  assert.match(html, /Complimentary access/);
  assert.match(html, /Expires Dec 14, 2026|Expires Dec 15, 2026/);
  assert.match(html, />Active</); // Academy access status

  // Expired complimentary
  const expiredFixture: SyntheticProfileFixture = {
    user: {
      ...activeFixture.user,
      complimentaryAccessExpiresAt: "2026-10-01T00:00:00.000Z",
    },
  };
  const ExpiredPage = loadProfilePage(expiredFixture);
  const expiredHtml = renderToStaticMarkup(await ExpiredPage({ params: Promise.resolve({ id: studentId }) }));
  assert.match(expiredHtml, />Inactive</);
  assert.match(expiredHtml, />Blocked</);

  // Revoked complimentary
  const revokedFixture: SyntheticProfileFixture = {
    user: {
      ...activeFixture.user,
      complimentaryAccessRevokedAt: "2026-11-05T00:00:00.000Z",
    },
  };
  const RevokedPage = loadProfilePage(revokedFixture);
  const revokedHtml = renderToStaticMarkup(await RevokedPage({ params: Promise.resolve({ id: studentId }) }));
  assert.match(revokedHtml, />Inactive</);
  assert.match(revokedHtml, />Blocked</);
});

test("Case 3: Deactivated former student blocks Academy access while preserving history", async () => {
  const studentId = "syn-deactivated-003";
  const fixture: SyntheticProfileFixture = {
    user: {
      id: studentId,
      name: "Dana Deactivated",
      email: "dana.deactivated@example.invalid",
      role: "student",
      banned: 0,
      must_change_password: 0,
      subscriptionStatus: "active", // Paid subscription still active in Stripe
      complimentaryAccessStartsAt: null,
      complimentaryAccessExpiresAt: null,
      complimentaryAccessRevokedAt: null,
      lifecycle_status: "DEACTIVATED",
      createdAt: "2026-08-01T12:00:00.000Z",
    },
    intake: {
      id: "intake-old",
      status: "completed",
      completedAt: "2026-08-05T12:00:00.000Z",
      data: JSON.stringify({ whyHFT: "Original goal", q16: "4500" }),
    },
    placement: {
      instructorLevel: "Intermediate",
      instructorTrack: "Developing Trader",
      placedAt: "2026-08-06T12:00:00.000Z",
      placedBy: "staff-1",
    },
  };

  const Page = loadProfilePage(fixture);
  const html = renderToStaticMarkup(await Page({ params: Promise.resolve({ id: studentId }) }));

  // Lifecycle badges
  assert.match(html, /Former student/);
  assert.match(html, /Lifecycle deactivated/);
  assert.match(html, /Former student — historical access only/);

  // Historical data preserved
  assert.match(html, /Original goal/);
  assert.match(html, /Intermediate/);
  assert.match(html, /Historical intake/);

  // Both details sections collapsed
  const openDetails = html.match(/<details[^>]*\bopen\b/gi);
  assert.equal(openDetails, null);
});

test("Case 4: Legacy-only student labels placement as historical pending instructor review", async () => {
  const studentId = "syn-legacy-004";
  const fixture: SyntheticProfileFixture = {
    user: {
      id: studentId,
      name: "Lee Legacy",
      email: "lee.legacy@example.invalid",
      role: "student",
      banned: 0,
      must_change_password: 0,
      subscriptionStatus: "active",
      complimentaryAccessStartsAt: null,
      complimentaryAccessExpiresAt: null,
      complimentaryAccessRevokedAt: null,
      lifecycle_status: "ACTIVE",
      createdAt: "2026-07-01T12:00:00.000Z",
    },
    intake: {
      id: "intake-legacy",
      status: "completed",
      completedAt: "2026-07-05T12:00:00.000Z",
      data: JSON.stringify({
        whyHFT: "Transition from retail to professional",
        tradedBefore: "Yes",
        markets: ["Forex", "Crypto"],
        q16: "6000",
      }),
    },
    placement: {
      instructorLevel: "Developing Trader",
      instructorTrack: "Foundations",
      instructorReason: "Manual placement before canonical workflow",
      placedAt: "2026-07-06T12:00:00.000Z",
      placedBy: "instructor-bob",
    },
    // No canonical intake and no approved learning path
    learningPath: null,
    canonicalDraft: null,
    canonicalCompleted: null,
  };

  const Page = loadProfilePage(fixture);
  const html = renderToStaticMarkup(await Page({ params: Promise.resolve({ id: studentId }) }));

  // Status card specifically flags legacy placement pending review
  assert.match(html, /Legacy placement only/);
  assert.match(html, /Current instructor review is pending/);

  // Learning path is not started
  assert.match(html, /No approved personalized path/);

  // Historical answers are present in the historical details
  assert.match(html, /Transition from retail to professional/);
  assert.match(html, /Manual placement before canonical workflow/);

  // Inline placement form must not exist
  assert.doesNotMatch(html, /<form[^>]*action="[^"]*placement/i);
});

test("Case 5: Incomplete assessment student selects student and offers 'Continue assessment'", async () => {
  const studentId = "syn-draft-005";
  const fixture: SyntheticProfileFixture = {
    user: {
      id: studentId,
      name: "Devon Draft",
      email: "devon.draft@example.invalid",
      role: "student",
      banned: 0,
      must_change_password: 0,
      subscriptionStatus: "active",
      complimentaryAccessStartsAt: null,
      complimentaryAccessExpiresAt: null,
      complimentaryAccessRevokedAt: null,
      lifecycle_status: "ACTIVE",
      createdAt: "2026-11-01T12:00:00.000Z",
    },
    canonicalDraft: {
      status: "in_progress",
      updated_at: "2026-11-09T14:30:00.000Z",
    },
  };

  const Page = loadProfilePage(fixture);
  const html = renderToStaticMarkup(await Page({ params: Promise.resolve({ id: studentId }) }));

  // CTA button
  assert.match(html, /href="\/admin\/student-intake-v2\?studentUserId=syn-draft-005"/);
  assert.match(html, />Continue assessment</);

  // Status reflects in progress draft
  assert.match(html, /In progress/);
});

test("Case 6: Completed canonical assessment student offers 'Review assessment'", async () => {
  const studentId = "syn-complete-006";
  const fixture: SyntheticProfileFixture = {
    user: {
      id: studentId,
      name: "Cameron Complete",
      email: "cameron.complete@example.invalid",
      role: "student",
      banned: 0,
      must_change_password: 0,
      subscriptionStatus: "active",
      complimentaryAccessStartsAt: null,
      complimentaryAccessExpiresAt: null,
      complimentaryAccessRevokedAt: null,
      lifecycle_status: "ACTIVE",
      createdAt: "2026-10-15T12:00:00.000Z",
    },
    canonicalCompleted: {
      status: "completed",
      completed_at: "2026-11-08T16:00:00.000Z",
    },
  };

  const Page = loadProfilePage(fixture);
  const html = renderToStaticMarkup(await Page({ params: Promise.resolve({ id: studentId }) }));

  assert.match(html, /href="\/admin\/student-intake-v2\?studentUserId=syn-complete-006"/);
  assert.match(html, />Review assessment</);
  assert.match(html, />Completed</);
});

test("Case 7: Academy sub-page separates course assignment from instructor placement", async () => {
  const studentId = "syn-academy-007";
  const fixture: SyntheticProfileFixture = {
    user: {
      id: studentId,
      name: "Taylor Teaching",
      email: "taylor@example.invalid",
    },
    placement: {
      instructorTrack: "Developing Trader",
    },
    learningPath: null, // No approved path
    assignments: [
      { id: "asg-1", title: "What is Money?", status: "assigned" },
    ],
  };

  const AcademyPage = loadAcademyPage(fixture);
  const html = renderToStaticMarkup(await AcademyPage({ params: Promise.resolve({ id: studentId }) }));

  // Back link uses next/link rendering as anchor to student profile
  assert.match(html, /href="\/admin\/students\/syn-academy-007"/);
  assert.match(html, /← Back to Student Profile/);

  // Clear indication that course assignment is separate
  assert.match(html, /Course assignment provides access to course material and is separate from instructor placement approval/);
  assert.match(html, /Historical placement only \(current review pending\)/);
  assert.match(html, /href="\/admin\/learning-path\?studentId=syn-academy-007"/);
});

test("Case 8: Manual placement and training writes throw retirement error without writes", async () => {
  const cloud = {
    "@opennextjs/cloudflare": {
      getCloudflareContext: () => {
        throw new Error("Database must not be opened for retired manual writes");
      },
    },
  };
  const placement = loadModule("lib/student-placement.ts", cloud);
  const training = loadModule("lib/training-plan.ts", cloud);

  await assert.rejects(
    placement.upsertPlacement("syn-test", {}, "staff-admin"),
    /historical.*read-only/i,
  );
  await assert.rejects(
    training.upsertPlan("syn-test", {}, "active", "staff-admin"),
    /historical.*read-only/i,
  );
});
