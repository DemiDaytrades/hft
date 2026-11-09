# Phase C revision 3 — controlled redeployment preparation

Prepared locally on 2026-11-08. **No deployment, invitation, account creation, database mutation, or migration is authorized by this document.** A separate deployment authorization is required.

## Candidate and current baseline

Use only `docs/releases/2026-11-08-teaching-phase-c-blocker-candidate.json`, revision 3, at `/private/tmp/hft-phase-c-blocker-rc`.

Frozen source fingerprint: `a68e794c70895f31fc02aaf657d8e9fab0c38444451c2edfa4a7ac92491ae659`.

Previously recorded production baseline, requiring fresh read-only confirmation before rollout:

- Main Worker version: `fe9f5d14-0fdd-4597-bff3-1da00b951e68`.
- Control Worker version: `ca3656bd-df69-435c-97bd-c3cc08149bec`.
- D1 schema level: 0037. **No migrations. Do not replay 0037 or earlier migrations.**

The original production HTML/non-JSON incident remains unexplained. Revision 3 adds guarded response handling and safe diagnostics; it does not establish that an upstream cause has been eliminated. Production acceptance must verify the complete workflow.

Recorded revision 3 validation: 306 focused tests in 49 files, 541 full-suite tests, TypeScript, OpenNext, main/control Worker dry-runs passed. These are prior execution results, not newly rerun tests for this documentation-only preparation. Verify frozen hashes and artifacts again before deployment; rebuild/retest if any source changes.

## QA identity gate

Confirmed QA mailbox: **highfrequency17@icloud.com**. The operator confirmed ownership and mailbox access on 2026-11-08. This is the planned new student identity for the normal complimentary invitation/onboarding flow. Account nonexistence must still be checked read-only before an authorized invitation. No QA account has been created in this preparation.

- Preserve `hft-test-student@example.com` unchanged. No further recovery, password/reset attempts, invitations, entitlement changes, course assignments, session creation, or login probes for that identity.
- `teamdemi94@gmail.com` is already the active admin/instructor in the existing recovery snapshot. Preserve it unchanged; do not convert it into a student or use it as the new invitation recipient.
- Do not assume an alias is approved. Record the operator's distinct recipient before any future invitation.
- The new user ID remains unset until normal invitation activation. Never substitute the legacy test student's ID.

## Future authorized sequence

1. Obtain separate authorization for controlled rollout and the specific QA invitation/account. Confirm the new mailbox is deliverable and not an existing application account. If it collides, stop rather than altering that account.
2. Confirm current main/control versions, bindings, D1 level 0037 and frozen source/artifact integrity read-only. Obtain a fresh production backup/recovery point and record its time/bookmark and integrity evidence privately. Stop on baseline drift or a failed gate.
3. Before Worker changes, establish the new QA login using the existing production complimentary onboarding flow: `/admin/users` → **Invite Someone** → confirmed email → **Invite type: Complimentary Student** (the default is Staff, so explicitly change it) → proposed **7 Days** QA access → **Email only**, SMS off → **Create invite**. This future send requires explicit authorization; none occurs now. Do not change delivery flags or use Stripe.
4. The mailbox owner confirms actual delivery, opens the invitation, and privately sets their own password. A delivery status of Sent alone is insufficient. Verify normal logout/login in a separate browser session and confirm the actual identity is the new student. Do not construct sessions or edit authentication records directly. Stop for delivery/onboarding failure; do not repeatedly send invitations blindly.
5. Record the new student ID. Through `/admin/students/{newId}/academy`, assign the published HFT Trading Foundations course using the existing course-assignment UI. Entitlement and course assignment are separate. Do not change placement, financial plans, or real student records.
6. Prepare an isolated synthetic confirmed classroom with that exact QA student and the authorized instructor using the established controlled acceptance procedure. Rehearse any necessary fixture on a local copy first. Do not reuse the old production fixture/observation/cleanup helpers: they target the retired test account. Do not invent instructor availability, touch real bookings, or enable reminders/messages.
7. Deploy only frozen revision 3 main/control artifacts through the established HFT workflow, preserving bindings/secrets/configuration. Do not assemble from the dirty working tree. No migrations, unrelated features, or LiveKit/webhook reconfiguration.
8. Run the complete acceptance checklist below. If a gate fails, stop; capture safe diagnostics. For a serious regression, contain/end synthetic provider activity and restore the coordinated recorded main/control baseline through the approved rollback workflow. Keep schema 0037; do not reverse migrations or reset D1 blindly.
9. End/cancel only the new synthetic class and remove its provider room through the approved cleanup procedure. Verify no active synthetic provider rooms or pending synthetic reminder jobs remain. Preserve audit records and the new QA account for controlled retesting unless separately authorized otherwise. Confirm the retired account and all real student records remain unchanged.

## Required production acceptance

- Instructor authentication, protected routes, scheduling and classroom Start/Join/End.
- New QA normal student login, entitled access, course assignment, student classroom admission and authorized reconnect before End.
- Instructor teaching panel, eligible lesson selection/inspection, approved additional classroom tasks, activity delivery, student response/submission, instructor review and feedback.
- Student mobile layout at 393px, after-class tasks, completion/review visibility and correct separation from mandatory lesson/mastery requirements.
- Instructor-private notes and data absent from student payloads; cross-student access denied. No real student response/plan/progress changes.
- Chat, raise hand, presenter approval/revocation, media/screen sharing and focus behavior retain previously verified security semantics.
- End Class disconnects participants; fresh admission and stale/cached-token media/publishing/screen-share restoration denied; provider cleanup verified.
- Capture only safe failing phase, status, MIME type, redirect classification and validated CF-Ray for HTML/non-JSON errors. Never log bodies, credentials, cookies, private answers or invitation tokens. Do not automatically replay ambiguous writes. Refresh and inspect state first.
- Verify stable production records and foreign keys against the fresh backup. The new authorized QA account and its normal invite/entitlement/enrollment/acceptance records are expected additions; do not require the pre-QA total of 13 users to remain 13. All original user records must remain intact.

## Release decision

Preparation is complete once the manifest/context and frozen integrity checks agree. Production acceptance remains **NOT PASSED** until the normal new QA login and full production exercise succeed. Real-student onboarding additionally requires Demi's actual availability and personal classroom operational check. This preparation does not authorize deployment or clear real-student use.

Next manual gate: separate authorization for the controlled QA invitation/onboarding and deployment. The confirmed recipient is highfrequency17@icloud.com. Do not send the invitation, create the account, or deploy before that authorization.
