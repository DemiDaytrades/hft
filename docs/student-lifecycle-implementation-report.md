# Student / Member Lifecycle Management — controlled local implementation

2026-11-07. Local code and synthetic in-memory verification only. No deployment, persistent local/production data changes, Stripe actions, real email/SMS or approved Intake V2 question/contract changes. Previous Academy, Financial Readiness and complimentary-invite work was preserved.

## 1. Existing systems reused

Existing user/member rows, Better Auth sessions/roles, the DAL, paid/complimentary entitlement predicates, invite expiry/redemption, admin member/profile views, Academy progress/submissions, Intake V2 snapshots, financial-plan history and existing private event patterns. Lifecycle is a distinct account eligibility dimension, not a duplicate subscription or ban system.

## 2. Files created/modified

Created:
- `lib/student-lifecycle-contracts.ts`, `lib/student-lifecycle.ts`, `lib/student-lifecycle.test.ts`.
- `components/admin/LifecycleControls.tsx`.
- `app/api/admin/student-lifecycle/route.ts`.
- `app/account-deactivated/page.tsx`.
- `migrations/0031_member_lifecycle.sql`.
- `docs/superpowers/plans/2026-11-07-student-lifecycle.md` and this report.

Modified:
- `lib/dal.ts`, `membership-access.ts`, `membership.ts`, `members.ts`, `auth.ts`.
- `lib/academy/index.ts`, `lib/academy/learning/service.ts`, `app/api/admin/academy/learning/route.ts`, `components/academy/learning/ReviewWorkspace.tsx`.
- `lib/financial-plan/service.ts`, `lib/complimentary-invitation.ts`, `app/invite/[token]/actions.ts`.
- `app/(app)/admin/users/page.tsx`, `app/(app)/admin/students/[id]/page.tsx`, `components/admin/MemberTable.tsx`.
- Existing `lib/auth-safety.test.ts`, `lib/invite-recovery.test.ts`, `lib/academy/security.test.cjs`: test fixtures now model the migration's ACTIVE lifecycle state; existing assertions were retained. Auth tests also verify deletion/cached-role safeguards.

The working tree contains substantial earlier uncommitted work; it was not reset, moved, committed or deleted.

## 3. Migration and compatibility

Migration 0031 adds user lifecycle status, revision, change actor/time and operation ID; a lifecycle event table; and indexes. All existing accounts default to **ACTIVE**, including accounts whose existing ban/expired entitlement still denies access. No migration auto-deactivates anyone, rewrites subscriptions or changes complimentary expiration.

It also prevents new sessions/invitations for deactivated accounts and makes lifecycle audit history immutable. The migration was tested only by applying all repository migrations to fresh in-memory SQLite. It was not applied to any persistent local or production database. Apply through the separate reviewed release process before deploying code that queries these columns.

## 4. Lifecycle model

`ACTIVE` and `DEACTIVATED` are the only eligibility states. State is read fresh from D1 rather than trusted from an old session. Deactivation is separate from bans, Stripe cancellation, complimentary expiry, invite expiry and permanent deletion. Subscription webhooks or new entitlement values cannot change lifecycle status or override it.

A revision/operation ID protects transitions from stale or concurrent actions. Current staff role/lifecycle/setup/ban state and target role/billing snapshots are checked again in the mutation predicate. Self/staff accounts cannot be removed through the student workflow.

## 5. Deactivation

Admin types `DEACTIVATE student@email`, chooses access-only removal, and optionally supplies an approved reason and private note. A paid-billing acknowledgement is additionally required where charging may continue.

One D1 batch changes lifecycle eligibility, deletes existing sessions, expires unused matching invitations, and appends the private audit event. A failure rolls everything back. Historical student records are not deleted or rewritten. A stale complimentary grant cannot race deactivation and extend/restore former entitlement.

## 6. Paid-member safeguards

Deactivation never invokes Stripe, cancels a subscription or implies billing was canceled. UI shows recorded paid status and warns that charges may continue. It requires explicit access-only selection and acknowledgement. A paid-status/subscription change during the operation forces a reload instead of bypassing this confirmation.

The existing cancellation architecture is a member-operated Stripe billing portal. There is no approved combined admin cancellation service. **Cancel membership + deactivate is visibly unavailable**, and the server rejects that choice. Neither immediate nor end-of-period cancellation is fabricated. Billing must be handled and verified separately under an authorized process, especially before removing a student's ability to open the member portal.

## 7. Complimentary safeguards

Lifecycle denial overrides valid complimentary access without deleting the grant, clearing historical revocation or shortening its expiry to simulate removal. The existing explicit grant service rejects former accounts and guards its actual write against concurrent deactivation. Resend/delivery controls cannot issue reactivation invitations to a former student. Existing advanced entitlement tools remain separate; entitlement alone never restores lifecycle eligibility.

## 8. Former-student experience

Admin Members now defaults to Active Students. Former / Inactive Students and Active Staff are separate filters; search and pagination preserve the selected view. Former rows prominently state HFT access is denied even if a paid billing record remains active. Paid billing, complimentary entitlement, ban and lifecycle indicators remain distinct.

Lifecycle controls are available from member rows and student profiles. Authorized staff can inspect identity, deactivation date, structured reason/private notes, original membership record at the event, preserved lesson progress and links to existing intake/plans/submissions. The latest 100 saved lesson-progress rows are displayed as historical status, not recalculated mastery.

## 9. Reactivation

Admin types `REACTIVATE student@email`. The transition changes eligibility and appends history only. It creates no subscription, extends no complimentary grant, clears no ban/setup requirement, assigns no courses, and regenerates no plan/intake. Revoked sessions and old invitations are not revived. The student signs in again and normal entitlement, assignment, publication, password and ban gates still apply.

Tests verify valid paid access resumes, expired complimentary access remains denied, canceled paid membership remains canceled, no subscription is created and historical data is unchanged.

## 10. Session/access revocation

Existing session rows are removed atomically using the existing auth schema. A database trigger prevents minting another session for a deactivated account. Fresh DAL lifecycle/ban checks make a stale or cached session useless for protected routes/APIs; roles are also refreshed from D1 so a demoted admin cannot retain former-student administrative access.

Academy resource services and financial-plan student access additionally enforce lifecycle state. Student Academy, financial-plan, questionnaire and lifecycle API denial was exercised using actual route handlers with a synthetic stale session. In-flight work already authorized before a transition is not represented as retroactively cancellable; new checks and new session creation deny access.

## 11. Permanent deletion foundation

No hard-delete executor exists. The separate protected UI requires `PREVIEW PERMANENT DELETE student@email`, produces an impact preview, records a request event, and explicitly reports that execution is disabled. Unknown/destructive API actions are rejected. Existing generic Better Auth remove-user/delete-user and deletion-callback paths are blocked pending retention policy, preventing a framework endpoint from bypassing the foundation.

## 12. Deletion impact

The authorized preview counts account/credentials/sessions, complimentary record, invitations, assignments/progress/activity evidence, quiz attempts/responses/aggregates, homework/review history, checkpoints/instructor sessions, legacy and V2 intake, questionnaire revisions, financial-plan series/versions/events, Game Plans, Training Plans, placement history, consultations, communications/delivery metadata, lifecycle audit and commissions.

Categories: CAN DELETE (session revocation only), MUST RETAIN pending approved policy (payment/audit/history), REQUIRES POLICY DECISION, and EXTERNAL SYSTEM / STRIPE. External counts are unknown rather than queried live. No passwords, tokens, raw questionnaire responses or private-note content appear in the preview. This inventory is not an approved cascade/anonymization/deletion plan; additional relational and retention review remains required before any executor.

## 13–14. Historical and financial/intake preservation

Ordinary removal preserves course assignment, lesson progress, attempts, homework/revisions, feedback, intake/questionnaire history, source provenance, financial-plan versions/publication pointers/approvals/edits, legacy plans, consultation and communications records. Tests snapshot populated real tables and compare them before/after deactivation/reactivation.

Admin financial-plan history remains accessible under admin authorization. Existing interactive instructor review can inspect former/banned student work in read-only mode without restoring student eligibility; mutation controls are disabled for that view and student access stays blocked.

## 15. Invitations

Unused links are expired on deactivation without deleting their records. New invite inserts are forbidden for a deactivated email. Redemption checks current account lifecycle even if an old token otherwise appears valid, and its grant update is lifecycle-scoped. Reactivation does not revive old links. Complimentary automatic delivery retains consent/idempotency/password protections and never serves as a reactivation action.

## 16. Authorization/security

Admin-only server handlers and services verify fresh database role, lifecycle, ban and forced-password state. Students cannot read another student's lifecycle/impact data or invoke transitions. Private admin notes/events are returned only to authorized staff with private/no-store responses. Confirmations, enum reasons, bounded notes, CAS revisions and current billing/role predicates defend accidental/stale writes. Staff/self transitions are blocked.

## 17. Audit history

Real transitions create `STUDENT_DEACTIVATED` / `STUDENT_REACTIVATED`, with student, actor, timestamp, reason/private note, previous/resulting state and safe billing/entitlement metadata. Original paid/complimentary membership record is captured at the event. Audit rows cannot be updated or deleted. Deletion-preview request records `PERMANENT_DELETION_REQUESTED` with execution disabled; no fake completed-deletion event is emitted.

## 18–21. Verification

Fresh final results are recorded in the footer below. Tests use synthetic `.invalid` identities, actual in-memory SQLite migrations and mocked auth/runtime boundaries. Outbound fetch is blocked, and lifecycle transitions import no Stripe/email/SMS sender.

Coverage includes paid/complimentary override, stale-session denial, old valid invite denial, fresh-role authorization, preserved history, active/former lists, entitlement-only reactivation, paid acknowledgement/combined-action rejection, session insert rejection, concurrency/rollback, billing and grant races, immutable audit, guarded impact preview, direct auth deletion blocking and retained read-only instructor history. Existing tests were not weakened to hide failures.

## 22. Manual browser procedure

1. Review migration 0031. Use only an authorized local DB and synthetic test identities; apply migrations with the existing `--local` workflow. Keep live Stripe/email/SMS credentials disabled. No persistent migrations were applied during implementation.
2. Start the local application. Open Admin → Members. Verify Active Students, Former / Inactive Students and Active Staff filters, search and pagination. Former users must not appear in the default Active Students list.
3. Choose a synthetic paid student with recorded progress/intake/financial plan/homework. Open lifecycle controls. Confirm the paid warning, explicit access-only checkbox, extra acknowledgement and typed email phrase. Missing confirmations must block submission. Combined cancellation must remain unavailable.
4. Deactivate. Verify the account moves to Former, paid status/ID and complimentary dates remain unchanged, lifecycle audit records the reason/private note, and old sessions no longer reach protected pages or APIs. No billing or notifications should be triggered.
5. Try a previously valid local activation link; it must not reactivate the student. Check new invite/delivery attempts for the former account are rejected. Student lifecycle/impact endpoints must return denial with no private information.
6. As admin, inspect historical progress, homework, questionnaire/intake and financial-plan versions. Open interactive lesson history from retained progress; it must be read-only while former. Confirm prior source snapshots, published plans, answers and feedback remain intact.
7. Reactivate with the exact phrase. Verify previous progress remains and sign-in is required again. Valid authorized entitlement may resume access. Repeat with expired comp/canceled paid state; access must remain denied until a separate legitimate entitlement exists. No automatic subscription, comp extension, course assignment or plan regeneration may occur.
8. In two admin tabs, attempt stale/concurrent lifecycle changes; only the current revision should succeed. Verify reason/event history remains intact.
9. Open the protected deletion area, type its separate phrase, and request the impact preview. Review counts/classifications. No destructive execution button/API should be available. Do not test direct production deletion, billing or messages.
10. Check narrow/mobile layouts, keyboard confirmations, readable private notes and truthful separation of lifecycle/billing/entitlement. Authenticated browser/device testing was not performed in this run.

## 23. Remaining policy decisions

Permanent deletion needs approved retention periods and obligations for payments, commissions, audit, financial-plan provenance, questionnaires, communications/opt-outs and instructor records; anonymization versus erasure; shared/actor-linked relationships; external Stripe and provider records; operator approval and evidence; and a tested reversible/export/recovery procedure before any irreversible executor.

Combined billing cancellation needs an approved admin architecture and policy for immediate versus period-end treatment, refunds/credits, webhook reconciliation, partial failures and audit. The current member portal is not silently repurposed into an admin cancellation API.

## 24. Risks/blockers before controlled use

Review/apply migration separately before deployment. Perform actual local Worker/D1 and authenticated browser/mobile smoke acceptance; SQLite/service tests do not prove deployed session/browser behavior. Existing in-flight authorized requests are not retroactively canceled, but new authorization and session creation are denied. Staff role model remains admin-only; no instructor-allocation system was invented. Historical progress listing is bounded to the latest 100 rows with existing history views retained.

Keep permanent deletion and combined Stripe cancellation disabled until policy/architecture is approved. Verify billing manually through an authorized separate process before access removal where required. The unrelated known availability-overlap failure remains outside this scope.

Independent read-only review found the complimentary-grant/deactivation race; a failing regression reproduced it and the guarded write corrected it. The noted stale-role limit was also corrected with fresh DAL role reads and a regression. No deployment, merge, commit or provider operation was performed.

## Final verification footer

- Focused lifecycle integration: **9/9 PASS**.
- Selected lifecycle/Academy security and learning/complimentary invitation/financial-plan authorization and privacy/authentication/questionnaire regressions: **57/57 PASS**.
- Full suite: **240 tests; 239 passed; 1 pre-existing failure** — `lib/availability.test.ts`, `overlaps detects intersecting slots`: `RangeError: Invalid time value` (HH:MM fixture supplied to timestamp arithmetic). No new failures remain; booking code/tests were not changed to conceal it.
- TypeScript: **PASS**, exit 0, no diagnostics: `node --max-old-space-size=8192 node_modules/typescript/bin/tsc --noEmit --incremental false`.
- Scoped changed-file whitespace checks passed for lifecycle edits. The earlier existing blank EOF line in `lib/membership.ts` remains outside this change's cleanup scope.
- Migration **0031 created and tested in memory only**; not applied to persistent local or production databases.
- **No deployment, live Stripe activity or real email/SMS.** Authenticated browser/mobile and actual local Worker/D1 smoke acceptance remain manual checks.
