# Student lifecycle controlled implementation

Spec: /Users/demi/.codex/attachments/b98f249e-d68e-49e6-9a18-24d331178da9/Pasted text.txt. User authorized local implementation; preserve current checkout and all prior work, no deploy/messages/Stripe calls.

Design: one additive lifecycle status on existing user, default ACTIVE for compatibility, revision CAS + actor/time/operation metadata; private append-only lifecycle event history. DEACTIVATED overrides entitlement. Atomic transition revokes sessions/unused invitations and records history; reactivation changes eligibility only. Distinct from ban, paid cancellation and comp expiry. Admin-only Former filter and protected per-student controls. Permanent deletion stays blocked with typed confirmation and impact preview because retention policy is absent. Existing Stripe portal is member-operated, no safe combined admin cancellation exists; expose a clear unavailable dependency, never cancel or imply cancellation.

- [x] Failing lifecycle/history/access/retention tests using real in-memory migrations, mocked auth and blocked outbound calls.
- [x] Add lifecycle migration and CAS service with audit, session/invite invalidation; protected impact preview; no destructive executor.
- [x] Central DAL/entitlement/service guards and invitation/provisioning protection; prevent old links/grants from bypassing state. Disable generic auth deletion endpoints pending policy.
- [x] Active/Former member filters; lifecycle controls with reason/notes, paid warning, typed confirmation, history and deletion preview; preserve contact/progress/plans through existing admin views.
- [x] Focused, Academy, invite, financial, auth regressions, full suite, TypeScript; independent review; docs/manual steps/report.

Review focus: stale sessions/roles, old invite race, concurrent deactivation/reactivation, paid access-only semantics, former list privacy, direct auth delete bypass, foreign actor/self-admin mutations, retained financial/intake/progress history, source-private data in impact preview.

## Completion ledger

- Focused integration test first failed for missing lifecycle service, then passed against actual migrations/in-memory SQLite. Filled real Academy, Intake V2 and financial-plan records remain byte-for-byte unchanged through removal/reactivation.
- Stale session and otherwise-valid old invitation cannot bypass deactivation; actual Academy, questionnaire, financial and lifecycle route handlers deny former student access.
- Added source-level session/invite insert guards, atomic transition/audit/session expiry, immutable lifecycle events and paid/role snapshot predicates. Failure injection rolls everything back; concurrent transitions produce one event.
- Reproduced generic auth deletion-callback bypass and blocked all delete-user paths pending policy. Existing auth endpoint assertions retained.
- Existing mocks now include the migration's ACTIVE lifecycle state; no assertions removed/weakened. Current roles are read from D1; stale admin-role regression failed before the fix and passed after.
- Independent review found stale comp grant could race deactivation. Regression reproduced it, then passed after guarding actual grant UPDATE and rejecting zero changes.
- Existing instructor history now supports authorized read-only inspection for former students, without restoring student access; the read-only regression failed first and passed after the authorized history path was implemented.
- Original membership record at transition captured in safe event metadata; missing-metadata regression failed first then passed.
- Final verification: lifecycle9/9; selected regressions57/57; full240 with239passes and1pre-existing availability failure; TypeScript exit0.
- Ruling: keep existing checkout and preserve prior work; no commit, reset, merge, push, deployment or persistent migration.
- Ruling: combined admin Stripe cancellation unavailable because current architecture is member portal only. Explicit access-only warning/acknowledgement and server rejection implemented. Cost if wrong: a separately approved cancellation service is required before combined automation.
- Ruling: permanent deletion is preview-only until retention/relationship/external-data policy is approved; generic framework deletion routes blocked. Cost if wrong: intentional deletion requests require policy work before execution, with no destructive guess made here.
- Ruling: existing admin role model retained; staff/self lifecycle transitions blocked. Cost if wrong: a separately approved staff/instructor lifecycle model is required.
- Deferred acceptance: authenticated browser/mobile and real local Worker/D1 smoke verification documented rather than claimed performed. Historical progress presentation displays latest100 saved rows; existing admin history remains available.

Report: docs/student-lifecycle-implementation-report.md.
