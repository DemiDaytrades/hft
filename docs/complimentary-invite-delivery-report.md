# Automatic Complimentary Account Invite Delivery

Implemented locally, 2026-11-07. No deployment, live outbound messages, persistent local database changes or production migrations. Existing Academy and Financial Readiness work was preserved.

## Existing systems reused

Reuse `invite` tokens, existing redemption/provisioning/password setup, complimentary-access user columns, recorded email/SMS preferences, Resend, the existing Telnyx-first/Twilio-fallback SMS sender, communication_log, signed Resend delivery webhooks, admin authorization and password recovery. No parallel password, consent or provider system was introduced. New-account provisioning still happens on invitation redemption, not by manufacturing temporary credentials.

## Files created

- `lib/complimentary-invitation.ts`: authorized creation, policy/contact lookup, delivery claims, retry/resend orchestration and admin-only status.
- `lib/complimentary-invitation.test.ts`: synthetic integration and outbound-mocked regressions.
- `app/api/admin/complimentary-invitation/route.ts`: authenticated, rate-limited retry/resend and private/no-store status endpoint.
- `components/admin/ComplimentaryDeliveryPanel.tsx`: channel/account/access status, retry/resend and secure copy fallback.
- `migrations/0030_complimentary_invite_delivery.sql`: minimal attempt reservation and retry relationship metadata referencing existing invites and communications keys.
- This report and `docs/superpowers/plans/2026-11-07-complimentary-invite-delivery.md`.

## Files modified

- `lib/invites.ts`: atomic replacement and optional matching-valid-invite reuse.
- `lib/communications.ts`: complimentary event type, safe error redaction, Resend provider idempotency, conservative ambiguous-outcome handling for secure invitations.
- `lib/communications/templates.ts`: branded account-activation and existing-account notices.
- `app/(app)/admin/users/invite-actions.ts`: automatic complimentary delivery and existing-account support.
- `app/(app)/admin/users/actions.ts`: existing-user complimentary grant uses the same delivery orchestration.
- `app/api/admin/member-recovery/route.ts`: complimentary resend preserves existing terms/entitlement rather than inventing another 30-day grant; supports explicit resend request ID.
- `components/admin/InviteUserForm.tsx`, `ComplimentaryControls.tsx`, `MemberRecoveryPanel.tsx`, `MemberTable.tsx`, and `app/(app)/admin/students/[id]/page.tsx`: permitted channel selection and delivery controls in existing admin flows.
- `lib/invite-recovery.test.ts`: legacy recovery test now routes through the secure resend service while retaining its assertions.
- `lib/financial-plan/testing/db.ts`: shared in-memory D1 test adapter serializes batch transactions, matching D1 atomic batch behavior during concurrent tests. No financial application logic changed.

## Automatic delivery flow

1. Admin authorization is rechecked at the action/endpoint and current DB role is verified by the service.
2. Validate the email identity, duration/custom date, configured secure base URL and selected channel policy before creating access.
3. New invitee: create or reuse a valid matching member invitation. Duration remains encoded in the approved invitation architecture and begins on activation. Account/password creation stays in the existing redemption flow.
4. Existing account: explicitly grant complimentary entitlement without shortening a later expiry, leave credentials/subscription intact, and invalidate older outstanding member invitations so they cannot later extend access.
5. Reserve each requested permitted channel before provider sending. Send through existing communications functions with a purpose-specific idempotency key.
6. Return independent results; one failed channel never rolls back the invitation/entitlement or successful other channel. Copy link remains an admin fallback.

## Email behavior

Professional HFT Academy message includes complimentary access terms, secure activation or sign-in CTA, and separate invitation expiration when relevant. New accounts choose their own password. Existing accounts sign in or use existing Forgot Password recovery. Existing pending legacy invitations explicitly say to activate access and retain the existing password. No financial/questionnaire data or plaintext password is included.

Resend accepts a request-level idempotency key supported by the installed SDK. Missing message IDs, timeouts and server errors are treated as uncertain, preventing blind duplicate sends. Definite rejection can be retried. Signed existing email delivery callbacks supply Delivered only when communication_log actually confirms it. Provider suppression/complaint blocks blind resend pending contact-policy review.

## SMS and consent/channel rules

Email, SMS and Both are available according to recorded recipient contact/consent. SMS requires the existing account's normalized phone and `sms_opted_in`; email respects existing `email_opted_in`. Phone verification requirements were not invented or loosened. Selected channels are rechecked server-side; no force-send bypass is used.

New invitees have no stored SMS consent, so SMS is unavailable until a permitted phone/opt-in exists. Email identity remains required by the existing authentication architecture even with SMS-only delivery. No phone/email is fabricated, and staff cannot claim consent through a new checkbox. If no channel can be used, explicit copy-only fallback can still create/grant access. Missing provider configuration yields Not Available, without destroying access.

Use the existing Telnyx integration first and Twilio fallback on definite rejection where available. A timeout/ambiguous Telnyx result does not automatically fall through and risk duplicate SMS. SMS is Sent only with provider acceptance evidence; no SMS delivery receipt is fabricated.

## Invitation security and resend behavior

All account setup remains in the existing secure one-time invitation flow. Existing credentials are never replaced or sent. A valid matching pending link is reused with its original TTL; expired tokens rotate atomically with the same access terms. Failed rotation leaves the old valid token intact. Resending an existing-account notice never writes entitlement columns, creates accounts or invokes credential creation. Revoked/expired existing complimentary access is not restored by resend.

Failed-channel retry preserves successful channels. An explicit Resend Invite generates an idempotent request ID so a deliberate second notice can be sent without double-sending network retries. Each attempt references its predecessor. Pending/uncertain outcomes block blind retries; operators must reconcile provider records first. No unsafe automatic timeout recovery was added.

Invitation TTL and access expiration remain distinct. Renewing a pending invitation does not extend an existing entitlement. New invite duration begins at activation as before; an already-passed custom access date is shown as Expired, cannot be renewed by resend, and hides the activation fallback.

## Existing-account behavior

No duplicate account is created. An explicit grant applies complimentary access and sends a login/access notice. A pending legacy member invitation to an existing account is resent as a redemption link while keeping existing credentials and entitlement untouched until the established redemption flow. Known forced-password/setup protections remain active. After activation, original delivery evidence is retained and the admin fallback becomes a login link, never the consumed raw token.

## Admin delivery-status UI

The existing member-invite form and complimentary-grant controls offer permitted Email/SMS/Both choices. The reusable panel shows each channel, actual access state/date/terms, invitation TTL, and account state. Sent explicitly means provider acceptance; Delivered is only shown from existing confirmed email webhook data. Failed, Not Available/Not Requested, Pending and Outcome Uncertain are distinct. Retry and explicit Resend Invite are separate from access grants/extensions. The same panel provides Copy Activation Link under Manual fallback. Grant refresh preserves UI state rather than hard-reloading it away.

## Communication logging

Canonical provider sends remain in communication_log: recipient user when one exists, purpose `complimentary_invite`, channel, time, safe provider reference, status and idempotency key. New invitees use nullable user ID, linked through invitation metadata rather than incorrectly attributed to the admin. The additive attempt table records invite/user/email relationship, actor, channel, sequence, predecessor, explicit resend request, timestamps and communication key. No message bodies, temporary passwords or additional raw invitation tokens are stored there. Secure-message provider errors are redacted before application logs/status.

## Verification

All focused tests mock provider clients and block unmocked fetch. They use synthetic identities, reserved `.invalid` email addresses and in-memory SQLite with actual migrations. No real email/SMS was sent.

- Focused complimentary creation/delivery plus existing invite/redemption/complimentary tests: **26/26 passed**.
- Covers email-only, SMS-only, both, no email/phone/consent, email opt-out, provider absence, both partial-failure directions, safe failed retry, explicit resend idempotency, no account duplication, unchanged entitlement on resend, expired token rotation, expired custom access, revoked access, existing/pending/activated accounts, unauthorized actions/API reads, no plaintext credentials/raw token in logs/status, concurrent claims, unknown outcomes, webhook confirmation/suppression and atomic failed rotation.
- Full suite and final TypeScript result are recorded in the verification footer below. The known unrelated availability-overlap failure is not changed or hidden.

## Manual browser verification

1. Review migration 0030 and apply migrations only to an authorized **local test** database using the existing `--local` workflow. No persistent migrations were applied in this implementation session.
2. Run local development with a local `BETTER_AUTH_URL`; keep real provider credentials disabled. Use synthetic local admin and student identities. Automated tests above exercise accepted/failed delivery with mocks; a browser with disabled providers should truthfully show Not Available and still retain a valid copy fallback.
3. In Admin → Members → Invite someone, choose Complimentary Student. Enter a synthetic email, select an approved duration/custom date, and verify new invitees cannot select SMS without stored consent. Create. Check separate access terms and invitation expiry, per-channel results and Copy Activation Link.
4. Use the local activation link, establish a password through existing setup and refresh status. Verify Activated/access state, delivery evidence and login fallback. Do not use real addresses/phones or send actual notifications for this local check.
5. Use an existing local account with recorded permitted SMS contact/consent. Exercise email/SMS/Both choices with mocked providers via the automated test scenario. Verify existing credential and paid membership are unchanged, and no duplicate account is created.
6. In the complimentary-access controls, verify selected-channel notification, actual expiry, refresh/status panel, failed-channel retry and explicit resend. Save expiry before/after resending; it must be identical. A shorter explicit grant cannot shorten a later existing expiry.
7. Verify revoked/expired access cannot be restored by resend; expired pending invitation renews only its token TTL while preserving access terms. Past custom access terms require a new explicit grant.
8. Test another student session against the admin status/resend endpoint and server action; expect denial with no token. Inspect student-visible APIs for absence of invitation links.
9. Check narrow/mobile layout, keyboard channel selection, readable errors, clipboard fallback and separate Sent versus Delivered terminology. No authenticated browser acceptance was performed in this run.

## Remaining limitations and prerequisites

- Real provider/Worker integration and authenticated browser/mobile acceptance remain to be performed separately; automated mocks do not prove delivery to an inbox/phone.
- New invitees are email-only until recorded SMS consent exists. SMS-only delivery still requires an email account identity.
- Pending/uncertain sends intentionally need provider reconciliation; no background worker or automatic unknown-outcome retry was invented.
- Existing advanced entitlement-only extension/custom/revoke tools retain their purpose; resending never invokes them. Staff/affiliate invitations retain their separate flow.
- Existing admin role remains the authorized staff model. No new instructor role/allocation system was added.
- Provider configuration and approved sender identities must already be configured in the existing communications infrastructure before an authorized real delivery test.
- Local migration 0030 is required before this code is used against a database. Production migration/deployment needs its separate release process.
- Manual course assignment remains separate; this task does not auto-enroll students or change Academy placement.

Independent read-only review found the ambiguous-email-outcome issue, reproduced by a failing missing-ID regression and corrected. The legacy recovery resend endpoint now accepts explicit request IDs and explains no-op reuse without one. No important review findings remain unaddressed.

## Final verification footer

- Focused delivery/invitation/redemption/complimentary tests: **26/26 PASS**.
- Full suite: **229 tests; 228 passed; 1 pre-existing failure**. `lib/availability.test.ts` — `overlaps detects intersecting slots`, `RangeError: Invalid time value` (HH:MM fixture sent to timestamp arithmetic). No new failures remain. No assertions were weakened to hide this unrelated booking failure.
- TypeScript: **PASS**, exit 0 with no diagnostics: `node --max-old-space-size=8192 node_modules/typescript/bin/tsc --noEmit --incremental false`.
- Scoped changed tracked-file whitespace check: PASS.
- Migration **0030 created and tested in memory only**; not applied to a persistent local or production database.
- **No deployment or real email/SMS sent.** Authenticated browser/mobile and actual local Worker/provider acceptance remain manual checks, not completed claims.
