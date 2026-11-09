# Phase C acceptance blockers — diagnosis and local mitigation

2026-11-08, America/Chicago. **No redeployment, production migration, production account mutation, credential reset, email/SMS or Stripe activity occurred.** Production remains restored Phase B; migration 0037 is already applied and must not be replayed. This run stops at the normal test-account recovery gate required by section 4 of the user brief.

## 1–3. HTML-response diagnosis and root cause

**The upstream production cause remains UNKNOWN.** Original evidence retained the displayed error, deployment identities and subsequent recovery, but not the failing response's HTTP status, Content-Type, redirect chain, CF-Ray or response origin. A body beginning `<!DOCTYPE` was parsed as JSON. That does not establish which platform supplied it, or what MIME type it advertised.

There are two distinct pieces of evidence:

- `Instructor teaching panel unavailable.` is emitted by the revision-2 client when **GET `/api/classroom/qa-phase-c-prod-5b1e4dc42bcc/teaching?instructor=1` returns a non-success status**. This identifies that failed private-panel request, but does not prove it was the HTML-producing response; its actual status/type were not recorded.
- The raw parser message appeared in the **parent classroom header**. That error state can receive failures from GET/POST `/api/classroom/:sessionId`, GET `/api/classroom/:sessionId/chat?after=…`, and errors raised while connecting the LiveKit SDK after admission. The child teaching component does not set the parent's header. Therefore attributing the raw HTML error exclusively to the private endpoint would be unsupported.

Expected application responses are JSON: successful 2xx payloads and structured 4xx/5xx API errors. `requireMemberApiUser` returns status-bearing API errors, rather than normal page login redirects. Both the main and teaching JSON wrappers use private/no-store responses. A later manually opened authenticated private endpoint returned valid JSON, and the panel recovered. The browser was an authenticated instructor before/after the incident; the exact failed request's authentication/redirect headers were not captured.

The browser's teaching API URLs use the main origin. Commands may invoke the control Worker internally; realtime snapshots use the control WebSocket. The WebSocket JSON parser catches and ignores malformed frames, so its parse catch does not directly produce the observed header message. No evidence identifies the control Worker as the HTML source. Authentication middleware/redirects, an application/platform error page, Cloudflare challenge/error, route fallback, stale Worker, OpenNext routing, deployment propagation, and provider-side HTTP remain **unproven hypotheses**, not diagnoses.

One deterministic client issue **was established**: private refresh failures set an error notice, but successful refresh did not clear it. Repeating 2.5-second teaching loads could restore the panel while leaving the failure notice visible. That explains the stale notice, not the original upstream failure. There was no demonstrated deterministic API failure hidden by retries.

## 4. Local defensive handling

Only client response/error boundaries changed:

- Guard JSON media type before parsing; handle malformed or non-object JSON without rendering raw parser errors or copying response text.
- Safely label room refresh, room command, chat history, teaching refresh/command, and instructor-panel requests.
- Record only status, normalized content type, redirect flag, a categorical auth destination, validated CF-Ray, challenge flag and failure category. No bodies, URLs/queries, cookies, tokens, answers or private notes are logged.
- Distinguish provider-connect errors with a separate `media-connect` phase and allowlisted error class; do not echo SDK messages that might contain tokenized URLs.
- Show actionable Reload/Sign in/Reconnect guidance. An unconfirmed write response instructs Refresh before retrying; no automatic mutation retry was added.
- Hide an unverified private panel. Refresh failures do not replace authoritative classroom state or invent an End transition. Successful refresh clears its own notice while preserving separate command-validation feedback.
- Keep existing access-denial checks and media shutdown on unverified room access. Token/admission, grants, screen slots, revocation, progression, scoring, mastery and homework rules are unchanged.

Tests were observed failing first against baseline parsing/provider-message behavior, then passing after the mitigation. A browser fault check caught a remaining guard-order issue for non-success room/chat responses; the response guard was moved before the generic non-success error, after the existing access-denial check. The affected browser check then passed.

## Local reproduction and browser evidence

An isolated copy of the production snapshot through **0037** was restored locally. No migration was replayed. Only local synthetic instructor/student fixtures were added. Local configuration has no production routes/account binding, uses a separate local D1 identity, development LiveKit and disabled delivery. A loopback proxy collected safe HTTP metadata and injected controlled response faults only when explicitly enabled.

**Untouched frozen revision 2:** 125 recorded authenticated requests across READY, Start/Join, LIVE, a poll, End and ENDED all returned 200/application-json. Actual Chrome loaded its private panel, navigated to Teaching Center and back, and normally reconnected to development LiveKit. The original upstream HTML event did not reproduce.

**Defensive build:** 125 recorded READY/LIVE/ENDED requests likewise returned JSON before fault injection. Actual Chrome verified:

- Instructor GET 502/text-html: private panel hidden, clear reload/reference notice, no raw SyntaxError, class remains LIVE.
- Fault removed: private panel returns and the refresh notice clears automatically.
- Room GET 200/text-html and 502/text-html: safe header guidance/reference, Reconnect available, no raw parser message and no invented ENDED state.
- Redirected HTML: safe reload handling. With the already-authenticated local session, `/login` redirected onward to `/admin`; it was not misreported as a proven expired login. Genuine final `/login` classification is separately covered by regression tests.
- During the private-panel fault, teaching revision and command count remained unchanged; no teaching command was replayed.

These are local response-fault tests, **not reproduction of a Cloudflare production challenge or proof of its cause**. Local request latency under concurrent test/build load is not a production performance certification. Original and defensive metadata are retained separately. All newly created local classes ended; development provider rooms are zero, and both local app/control runtimes and the proxy were stopped.

## 5–7. Production synthetic account and recovery diagnosis

Read-only checks were restricted to non-secret flags for **hft-test-student@example.com**. Password hashes, tokens and session values were not read or changed.

| Check | Result |
|---|---|
| Account / role | Exists; student |
| Lifecycle / ban | ACTIVE; not banned |
| Credential | One credential account with a password present; password value is not retrievable |
| Password setup | `must_change_password=0`; email verified |
| Active sessions | 0 |
| Paid subscription | None; unnecessary for current complimentary access |
| Complimentary entitlement | Active, not revoked; starts 2026-11-07; expires `2026-12-07T23:59:59Z` (December 7, 5:59 PM Chicago) |
| Invite/setup | No invite records; no pending setup invite |
| Active reset records | 0 |
| Assigned courses | 0; separate from membership and login |

There is no evidence of a lifecycle, password-setup, expired-entitlement or stale-invite block. Demi reported that the normal password/login is unavailable. The operator's unknown password cannot be inferred from a stored credential, and no password guesses were attempted.

The ordinary recovery path exists (`/forgot-password`, admin **Password → Send reset email**, Better Auth's single-use one-hour reset flow), but its destination is unusable: the current public DNS check for `example.com` returned **MX `0 .`**, a null MX declaring that the domain accepts no mail. See [RFC 7505, section 3](https://www.rfc-editor.org/rfc/rfc7505.html#section-3). No recovery email was sent to test this already-established delivery failure.

Complimentary invitation status for an already-active account routes to `/login`, preserving its password. Reissuing complimentary access would not recover the credential; no renewal, extension, revocation, paid subscription or invitation was performed. The existing admin UI explicitly disallows manually setting/retrieving passwords. There is no implemented member/admin browser email-change workflow in this checkout's approved recovery path. No Better Auth library admin API was used as an unapproved backdoor around the application.

Current entitlement legitimately permits member/Academy-root access and classroom access **when enrolled in an eligible confirmed session**. There is currently no course assignment, so Lesson 1/course access must still pass the normal assignment/progression rules. Neither missing course assignment nor unset teaching availability prevents sign-in. The previous production QA booking remains canceled; it was not reopened.

## 8. Manual Demi action — STOP

The user brief explicitly requires: **“If a manual action from Demi is required: STOP and provide exact browser steps.”** No production recovery mutation has been made.

If the original password exists in Demi's approved credential store:

1. Use a Guest/Incognito window and open `https://highfrequency.vip/login`.
2. Enter **hft-test-student@example.com** and that existing password privately. Do not paste it into chat.
3. Confirm the signed-in account is the test student, then open `https://highfrequency.vip/lessons`. An instructor session in another window does not count.

For a safe read-only admin confirmation: open `https://highfrequency.vip/admin/users?q=hft-test-student%40example.com`, locate that exact account, select **Password → Check status**. Do not click **Send reset email** expecting delivery to `example.com`.

**If the password is unknown, there are no existing browser steps that can complete email recovery for this exact address.** A controlled, deliverable test mailbox and an explicitly approved account-identity/recovery approach are needed. The current application does not offer an email-change UI for this account. Selecting a new mailbox or implementing a narrowly scoped supported recovery workflow requires Demi's direction/separate authorization; no direct D1 edit, fake token, replacement account, provider-dashboard token extraction or password override will be used.

After legitimate login is restored, Lesson 1 acceptance can use the existing instructor **Academy Assignments → Assign Published Course → HFT Trading Foundations → Assign** workflow for this synthetic account, if authorized. That is separate from login, entitlement and educational placement; no course/placement mutation was made in this run. A new isolated confirmed synthetic session may then be used by the existing controlled procedure. Actual availability must still be chosen by Demi, not invented.

## 9–10. Files and frozen revision

Only these source paths changed:

- `components/classroom/Classroom.tsx`
- `components/classroom/teaching/TeachingTools.tsx`
- `lib/classroom/client-response.ts` (new)
- `lib/classroom/client-response.test.ts` (new)

The original revision-2 source directory and its 518 hashes remain unchanged. A separate **revision 3**, 520-source-file candidate is prepared at `/private/tmp/hft-phase-c-blocker-rc`; [frozen inventory](2026-11-08-teaching-phase-c-blocker-candidate.json). Its source fingerprint is recorded in that manifest and the private final verification record. Deployment readiness remains **false**. Shared-checkout copying used prior owned-file hash guards; unrelated work was preserved. No package, dependency, schema, Worker control source, auth contract or lesson content changed.

## 11–16. Final verification

| Item | Result |
|---|---|
| Focused instructor/response, auth/onboarding, complimentary, Phase C/B/security, Phase A, Lifecycle, Academy and path tests | **306 passed / 49 files** |
| Full frozen-candidate suite | **541 passed, zero failures** |
| TypeScript | PASS, exit 0 |
| OpenNext | PASS, exit 0 |
| Main Worker dry-run | PASS, exit 0 |
| Classroom Worker dry-run | PASS, exit 0 |
| Production test-student normal login | **NOT RESTORED / NOT VERIFIED**; manual gate above |

Final checks were run after the last source change. Callback type narrowing inside the existing admission guard was corrected before the final successful typecheck/build; no permission check was removed. Earlier generated-library/cache-header warnings remain build warnings. The original production HTML request's missing headers cannot be reconstructed by these local tests.

## 17–18. Remaining blockers and production safety

Technical: upstream production source/status/type/request attribution remains UNKNOWN. Revision 3 locally mitigates unsafe parsing, stale refresh notices and provider-message leakage, but a separately authorized production retry with these diagnostics is required before the original production blocker can be cleared. No redeployment is authorized by this report.

Acceptance/account: restore legitimate normal test login; resolve the unavailable password/non-deliverable recovery address through an approved workflow. Then complete production student Join, activity response/scoring/review, privacy, mobile, follow-up and instructor acceptance using synthetic context only.

Real-student operations: Demi's actual availability, appropriate normal course/session assignments, and Demi's personal production classroom exercise remain separate. No real-student clearance is granted.

Read-only production checks still show main `fe9f5d14-0fdd-4597-bff3-1da00b951e68`, control `ca3656bd-df69-435c-97bd-c3cc08149bec`, migration level 37, 13 users, four consultations and zero production LiveKit rooms. No production account, invitation, session, entitlement, availability, credential, configuration, lesson, plan or progress was modified by this diagnosis. No deployment/migration/rollback or real message/transaction occurred.

Private evidence: `.wrangler/phase-c-release/2026-11-08/blocker-diagnosis/` and `/private/tmp/hft-phase-c-blocker-runtime/`. Logs contain safe metadata only where newly introduced; copied database/QA credential artifacts remain private and outside the candidate. No signed export URL was requested or printed in this run.

## Explicit answers

**A. Is the instructor-panel production blocker resolved? Not fully cleared.** Local defensive handling and stale-notice behavior are fixed/verified; the original upstream cause remains **UNKNOWN**, and production retesting is still required.

**B. Can the synthetic production test student log in through the normal approved flow? NOT VERIFIED / currently unavailable.** Account/entitlement flags are ready, but no usable operator password or deliverable reset destination is available. No bypass was used.

**C. Is Phase C ready for a separately authorized redeployment? NO overall acceptance clearance yet.** Revision 3's local checks pass; restore the normal synthetic login and agree the controlled diagnostic production retry before release authorization.

**D. Before real-student live-class clearance:** legitimate test-account recovery, separately authorized Phase C retry and full synthetic production acceptance including diagnostic stability, normal course/session access, actual availability, and Demi's personal classroom verification.

Stopped at the manual recovery gate. Do not redeploy or replay 0037. No Phase D, Lesson 2, Chart Lab or other feature work was begun.
