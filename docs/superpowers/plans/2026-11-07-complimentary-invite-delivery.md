# Complimentary invitation delivery plan

Spec: /Users/demi/.codex/attachments/d5da07be-cbdc-4aff-8fe5-2f31cf9e45c8/Pasted text.txt. Detailed implementation authorized locally; preserve current uncommitted work, no deployment/outbound test traffic/password disclosure.

Reuse existing invite redemption/account setup, complimentary user columns, consent checks, email/Telnyx/Twilio senders and communication_log. New invitees do not yet have accounts or SMS consent; offer email, not an invented pre-account consent system. Existing accounts with recorded permitted contact support email/SMS/both, receive login/access notices and retain credentials. New invite access duration begins on redemption under existing architecture; invitation TTL is separate. Resends preserve exact grant terms and never write an existing entitlement.

- [x] Tests first: templates, consent/contact, email/SMS/both, partial failures, retries, no successful duplicate sends, expiration/rotation, existing account, revoked access, role/ownership and no secrets in status/logs.
- [x] Minimal additive delivery-attempt claim/link schema; reference existing communication_log rather than duplicate provider sending. Persist no message bodies/raw tokens in delivery logs. Make invite creation/replacement atomic; reuse valid pending member invite for repeated creation/retry.
- [x] Authorized orchestration service: create/reuse invite or explicit existing-account grant; selected allowed delivery; per-channel status; failed-channel retry; expired-invite replacement preserves terms; copy fallback admin-only. No password changes, no account duplicates, no extension on resend.
- [x] Reuse branded templates, secure configured base URL, existing senders/consent. Channel-specific idempotency/claim; sanitize sensitive provider errors for this purpose.
- [x] Admin invite form policy/status/retry/copy UI and existing-grant/recovery integration without weakening safeguards.
- [x] Focused/full tests, TypeScript, independent review, local manual verification/report.

Limits: email identity remains required by existing auth model even for SMS-only delivery. No ability for staff to invent SMS opt-in. No Delivered status without provider confirmation. Pending/uncertain delivery must not be blindly retried after a crash. Existing account setup gaps use existing Forgot Password flow, never replaced credentials.

## Completion ledger

- Existing flows inspected once; resumed current work without reset or repeat inspection when requested.
- New delivery integration tests first failed for the missing service, then exercised actual migrations/SQLite with mocked Resend/Twilio clients and blocked unmocked fetch.
- Reproduced and fixed timeout/missing-acceptance outcomes, provider-confirmation display, past custom-term display, and missing custom-date fallback with failing-then-passing regressions.
- Atomic rotation failure preserves the old valid token; parallel creation/send claims send once. Explicit resends use unique request keys and preserve access expiration.
- Existing account setup/redemption, complimentary-extension, auth and consent boundaries retained. Existing recovery-route test delegates to the safe resend service; assertions retained.
- Independent final read-only review found ambiguous email failure handling; regression reproduced it and conservative uncertainty handling fixed it. Legacy resend request-key support clarified.
- Ruling: preserve existing checkout and unrelated work; do not deploy, commit, push or apply persistent migrations.
- Ruling: new invitees have no recorded SMS consent, so do not invent pre-account SMS permission. Cost if wrong: a future approved pre-account consent capture model is required for new-invite SMS.
- Ruling: SMS-only delivery still uses an email identity because existing authentication requires one. Cost if wrong: true phone-only identities would require a separately approved authentication design.
- Ruling: preserve invitation-duration-from-activation semantics; existing-account resends never modify entitlement. Cost if wrong: a future product change to absolute access dates needs explicit approval and migration of terms.
- Ruling: retain existing advanced entitlement-only tools and admin role model; no unrelated role/placement or provider redesign.
- Deferred acceptance: authenticated browser/mobile and actual local Worker/provider smoke checks documented, not claimed performed.

Final detailed report: docs/complimentary-invite-delivery-report.md. Focused26/26; full-suite and TypeScript evidence recorded in that report after completion.
