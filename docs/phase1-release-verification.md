# P0 Release Phase 1 — implementation and verification

Phase 1 changes are implemented locally. No deployment, production migration,
production/student data update, live Stripe transaction, real email/SMS, or
Cloudflare resource/secret change was performed.

## 1. Files changed in Phase 1

This manifest identifies this phase's work. The checkout already contained
substantial unrelated uncommitted changes; the entire git diff is not this phase.

### Authentication and protected routes

- `lib/auth.ts`
- `lib/dal.ts`
- `app/(app)/account/change-password/actions.ts`
- `app/(app)/account/change-password/page.tsx`
- `app/(app)/account/actions.ts`
- `app/(app)/account/page.tsx`
- `app/(app)/affiliate/actions.ts`
- `app/(app)/affiliate/page.tsx`
- `app/(app)/assessment/actions.ts`
- `app/(app)/assessment/page.tsx`
- `app/(app)/admin/users/actions.ts` — credential recovery only

### Academy

- `lib/academy/index.ts`
- `app/(app)/academy/course/[courseId]/page.tsx`
- `app/(app)/academy/lesson/[lessonId]/page.tsx`
- `components/academy/lesson/LessonContentRenderer.tsx`
- `app/api/academy/assignments/files/route.ts`
- `app/api/academy/assignments/resubmit/route.ts`
- `app/api/academy/assignments/submit/route.ts`
- `app/api/academy/assignments/upload/route.ts`
- `app/api/academy/checkpoints/status/route.ts`
- `app/api/academy/instructor/authorize-attempt/route.ts`
- `app/api/academy/instructor/review/assignment/route.ts`
- `app/api/academy/quiz/attempts/route.ts`
- `app/api/academy/quiz/questions/route.ts`
- `app/api/academy/quiz/start/route.ts`
- `app/api/academy/quiz/submit/route.ts`

### Questionnaire privacy and withholding

- `lib/consultation-questionnaire/index.ts`
- `lib/consultation-questionnaire/student-data.ts` — new student allowlist
- `app/api/consultation/questionnaire/route.ts`
- `app/(app)/consultation/questionnaire/page.tsx`
- `app/(app)/consultation/questionnaire/QuestionnaireForm.tsx`
- `app/(app)/consultation/ConsultationBookingClient.tsx`
- `app/(app)/my-questionnaire/page.tsx`
- `app/(app)/layout.tsx`

### Complimentary access and invitation recovery

- `lib/membership-access.ts` — new shared browser-safe predicates/status labels
- `lib/membership.ts`
- `app/(app)/admin/students/[id]/complimentary/actions.ts`
- `app/(app)/admin/students/[id]/page.tsx`
- `components/admin/MemberTable.tsx`
- `components/admin/ComplimentaryControls.tsx`
- `app/api/admin/member-recovery/route.ts`
- `app/invite/[token]/actions.ts`
- `app/invite/[token]/page.tsx`
- `components/InviteForm.tsx`
- `lib/communications.ts`
- `lib/communications/templates.ts`

### Tests and documentation

- `lib/academy/security.test.cjs`
- `lib/auth-safety.test.ts`
- `lib/auth-recovery.test.ts`
- `lib/complimentary-actions.test.ts`
- `lib/consultation-questionnaire/questionnaire.test.ts`
- `lib/invite-recovery.test.ts`
- `lib/membership-access.test.ts`
- `scripts/test-register.cjs`
- `scripts/test.cjs`
- `package.json` — adds `npm test`
- `docs/superpowers/plans/2026-11-07-p0-release-phase-1.md`
- `docs/phase1-release-verification.md`

## 2. Exact behavior changed

- Protected member pages and Academy APIs read the forced-password flag from
  D1. Setup redirects lead to the reachable password-change page; APIs deny
  access with an HTTP status. Successful verified password changes/resets clear
  the flag. Merely requesting a reset does not clear it.
- Admin credential recovery requests a reset link without replacing the known
  password. Missing reset-email configuration is rejected before token creation.
  Provider failures are detected/logged without exposing provider detail.
- Academy APIs require login, completed password setup, paid/trialing or valid
  complimentary membership, resource ownership where applicable, course
  assignment, publication, and appropriate lesson access. Admin review retains
  explicit admin authorization and does not require paid membership.
- Quiz submission verifies the attempt owner and validates all supplied
  questions/choices before writes. Duplicate/foreign questions and malformed or
  foreign choices are rejected. Pre-submission questions omit explanations.
- Lesson ordering uses module order, lesson order, and stable ID tie breakers.
  Completion rechecks access. Plain content and introductory text are retained.
- Student questionnaire reads expose allowlisted answers only. Private/unknown
  stored fields and omitted answers survive low-level student draft updates;
  submitted student records reject changes. Admin raw reads remain available.
- The unfinished student questionnaire entry page is withheld and student POST
  writes return 403. Entry links are removed; safe read-only snapshots remain.
- Existing-user recovery invitations retain the redemption link. Valid existing
  members redeem without entering/replacing a password, then use their existing
  login. Pending invitations no longer claim access has already been granted.
- Complimentary extension adds time to a future expiration atomically, otherwise
  starts from now. Invalid preset durations are rejected. Shared status checks
  distinguish expired/revoked/future complimentary grants from active grants.
  Account and admin status displays use the entitlement predicates.

## 3. Security issues fixed

- Legacy instructor-private answer exposure and student-owned update boundary.
- Cross-student quiz-attempt submission and duplicate/foreign-answer inflation.
- Session-only Academy assessment access and unpublished/unassigned curriculum.
- Direct-route bypass of required password setup.
- Recovery-triggered replacement of a member's known password before delivery.
- Misleading active complimentary status and non-shortening extension semantics.

These fixes are locally verified code changes, not production certification.

## 4. Tests added

Seven test files cover the changed boundaries: privacy/immutable student writes,
withheld questionnaire POSTs, quiz ownership and payload rejection before writes,
curriculum publication/assignment/order/plain text, forced setup/reset hooks,
credential-preserving recovery, real in-memory SQLite extension behavior,
invitation recovery, and complimentary expiration/revocation/paid coexistence.

The new runner transpiles TypeScript in memory and resolves Next's `server-only`
marker for tests. Cloudflare/session/email dependencies are fixture doubles;
there is no production binding or real delivery. Existing tests were not weakened.

## 5. Test results

- Focused Phase 1 command: **21 passed, 0 failed**. Academy's standalone file
  counts as one test file and also performs its internal regression assertions.
- `npm test`: **177 total, 176 passed, 1 failed**.
- Existing failure: `lib/availability.test.ts`,
  `overlaps detects intersecting slots`, `RangeError: Invalid time value` from
  `addMinutes` called with time-only test values. Reproduced before Phase 1
  changes; availability production code and its test were left unchanged.

Focused command:

```sh
node scripts/test.cjs lib/academy/security.test.cjs lib/auth-safety.test.ts lib/auth-recovery.test.ts lib/consultation-questionnaire/questionnaire.test.ts lib/complimentary-actions.test.ts lib/invite-recovery.test.ts lib/membership-access.test.ts
```

## 6. TypeScript and review

**Passed, exit 0**, no diagnostics:

```sh
node --max-old-space-size=6144 node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false
```

An independent read-only review found no concrete severe Phase 1 blocker. It
checked installed Better Auth's successful response against the password hook,
admin raw questionnaire access, the student allowlist, Academy boundaries, and
the atomic complimentary extension. Browser/build/deployed end-to-end tests
were not performed. The mixed working-tree whitespace check still reports
trailing blank lines; no clean-whole-tree assertion is made.

## 7. Intentionally unchanged

- Financial-plan generation and all approved Intake V2 contracts/questions.
- Manual course assignment; no automatic enrollment or content creation.
- Unfinished assessment UI, advanced gates, video playback, and dashboard design.
- Legacy admin questionnaire completion/history/restore defects from the audit;
  withholding student entry is the Phase 1 launch-safety approach.
- Stripe/webhook architecture and its previously reported reconciliation risks.
- Database schema, migrations, production records, infrastructure, and secrets.
- Existing availability failure and unrelated preexisting working-tree changes.

Better Auth can swallow delivery-task rejection internally. A successful reset
request therefore does not prove mailbox delivery; the recovery API explicitly
says delivery is not guaranteed. Crucially, failed delivery leaves the existing
password intact.

## 8. Remaining blockers before a real paid-student test

- Approve the next testing/deployment step; these changes are local only.
- Confirm the target environment has the existing required schema/bindings and
  correct member entitlement/customer mapping. No migration was applied here.
- Confirm a manually assigned course, modules, and initial lessons are published
  and contain usable text. Draft content is now intentionally inaccessible.
- Use controlled test accounts and an agreed email/SMS policy; recovery/invite
  actions can send messages when executed in a configured environment.
- Do not treat the full suite as green while the unrelated availability test
  remains failed. That matters especially if consultation booking is tested.

## 9. Next manual verification

1. With a controlled paid account, log in, open its assigned course, read the
   first lesson, complete it, refresh, and verify progress and the next lesson.
2. Repeat with valid complimentary access; verify expired/revoked complimentary
   access is denied while an independently active paid subscription still works.
3. Confirm unassigned and unpublished curriculum cannot be read or completed.
4. Confirm temporary-password login redirects direct Academy/account/assessment
   URLs to setup, setup remains reachable, and successful change/reset clears it.
5. With stubbed delivery, fail a reset request and verify the old password still
   works. Separately verify pending existing-user invitation redemption.
6. Confirm student questionnaire entry is unavailable, safe snapshots omit all
   private fields, and staff retain their private responses.
7. Use two controlled accounts to attempt a foreign quiz submission, duplicate
   question payload, and foreign choices; verify rejection and unchanged data.
8. Check course/lesson navigation on mobile and across multiple modules whose
   lesson sort orders restart at one.

No deployment or further feature work is authorized by this report.
