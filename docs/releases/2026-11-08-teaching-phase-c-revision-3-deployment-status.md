# Phase C revision 3 — authorized release stopped at preflight

2026-11-08. Operator authorized frozen revision 3 redeployment, initial smoke, and one normal complimentary invitation to highfrequency17@icloud.com, with a mandatory stop after email-provider acceptance for private manual onboarding.

## Result

**STOPPED BEFORE PRODUCTION MUTATION.** The first Cloudflare API read, GET Worker deployments for hft-landing, returned HTTP 401 / Cloudflare code 10000 using the existing Wrangler authentication. The restricted-network attempt first failed without a response; the authorized network-enabled read established the authentication rejection. No blind retries were performed.

All 520 frozen revision 3 source hashes match the manifest. Source fingerprint remains a68e794c70895f31fc02aaf657d8e9fab0c38444451c2edfa4a7ac92491ae659.

Current production Worker versions, D1 identity/schema/FK state, mailbox collision status and infrastructure health could not be freshly established because the first authenticated read failed. Historical rollback targets remain main fe9f5d14-0fdd-4597-bff3-1da00b951e68 and control ca3656bd-df69-435c-97bd-c3cc08149bec; these were not reverified in this run. Schema 0037 was previously applied; no migrations ran.

No deployment, production configuration write, invitation, account creation, student modification or provider-dependent test occurred. Existing admin/test accounts remain unchanged. Production LiveKit credential currency/revocation and webhook health remain unchecked; do not infer credential safety from past rotation or configuration evidence.

## Next manual gate

Restore Wrangler authentication with `npx wrangler login` in the HFT repository, using the existing authorized Cloudflare account. Do not change the account/database configuration. Confirm access restored without sharing any token or credential. Resume with read-only preflight, including current credential safety verification before any provider-dependent acceptance. If the exposed production key is still active, stop for rotation.

The newer explicit authorization controls sequence over the preparation document: deploy and initial smoke precede invitation; stop after the email provider accepts the authorized QA invitation. Do not create a QA account directly or bypass normal onboarding.

## Acceptance status

Phase C accepted in production: **NO**. New QA onboarding/login: **NOT STARTED**. Join Class/activity acceptance: **NOT STARTED**. Live-teaching real-student technical clearance: **NO**. Production acceptance and Demi's availability/personal operational checks remain pending.

## Resumed preflight — credential rotation gate

Wrangler access is restored. Read-only Cloudflare checks confirm main version fe9f5d14-0fdd-4597-bff3-1da00b951e68 and control version ca3656bd-df69-435c-97bd-c3cc08149bec, expected D1 bindings and control service/URL, all 37 migrations including 0037, zero foreign-key violations, 13 users, and no existing account for highfrequency17@icloud.com. No migrations were run.

**STOPPED BEFORE MUTATION at credential safety.** The local credential matches the original installed payload; the production dashboard still lists the earlier HFT Production Phase B v2 key and webhook selection. The operator clarified that the rotation confirmation referred to the earlier v2 rotation and that a new rotation is needed after the latest exposure. No provider requests, deployment, configuration changes, invitations, account creation or real-student changes occurred.

Required manual action: in HFT Production, privately create a replacement production signing key, save it in the protected local credential file, and revoke the exposed key. Do not paste or screenshot credential values. Keep the production credential editor tab closed afterward. The replacement must then be installed consistently on both production Workers and selected for HFT Production Classroom at the existing permanent webhook endpoint, preserving all unrelated configuration. This is an additional controlled configuration step, not a Phase C code deployment. Record resulting configuration versions as the revised rollback baseline before resuming application rollout. Do not claim the older Worker versions remain the exact baseline after secret replacement.

Phase C production acceptance remains NO; QA invitation/onboarding and activity acceptance remain NOT STARTED.

## Replacement-file verification

After operator confirmation of rotation/revocation, a private local comparison found both LIVEKIT_API_KEY and LIVEKIT_API_SECRET in `.wrangler/phase-b-release/2026-11-08/production-livekit.env` still identical to the original installed payload. Required fields are present and project URL unchanged. Values were not printed. Stopped before provider authentication, configuration writes, deployment or invitation. The newly rotated replacement must be saved to that exact file before resumption.

## Rotated credential verified; configuration rejected — code 10215

Both saved key and secret now differ from the original installed pair; project URL is unchanged. Read-only authentication to LiveKit with the replacement succeeds; zero provider rooms exist. All 520 frozen source hashes and revision 3 source archive still match. Fresh production read-only checks again confirm expected rollback Workers, D1 schema 0037, FK zero, 13 users and no account collision for the new QA mailbox.

Fresh D1 export restored locally with integrity ok, FK zero and 37 migrations. Export SHA-256: 547dac5364751d7c2b0ff4bacefdc895e110154c389363f0be77ad7cff68adb0. Recovery artifacts/bookmark are private under revision-3-deployment.

The first configuration mutation attempt, standard Wrangler secret bulk with only LIVEKIT_API_KEY and LIVEKIT_API_SECRET for hft-landing, was rejected with Cloudflare code 10215: Secret edit failed because the latest stored Worker version is not currently deployed. No retry or workaround deployment occurred. Control secret update was not attempted.

Post-failure read-only verification confirms main remains fe9f5d14-0fdd-4597-bff3-1da00b951e68 and control remains ca3656bd-df69-435c-97bd-c3cc08149bec; application code ETags and binding metadata are unchanged. No Phase C deployment, migration, invitation, account creation or real-student modification occurred. The rotated credentials have not been successfully installed on production Workers; webhook synchronization and provider-backed application testing remain pending.

Next remediation must use a reviewed version-aware credential update pinned to the active deployed source, preserving unrelated secrets/bindings. Do not deploy the latest stored version merely to satisfy secret bulk: it may contain the rolled-back candidate. Do not blindly run versions secret bulk without inspecting which source version it clones. Stop remains in effect at this failed configuration gate.

## Version-preservation feasibility gate

Read-only inspection confirms both active Phase B versions, code ETags and binding metadata remain unchanged. Cloudflare documentation and installed Wrangler establish that secret updates require new version IDs. Under the instruction prohibiting activation of another version, stopped before any mutation. Exact pinned-code procedure and references: `docs/releases/2026-11-08-livekit-version-aware-secret-update.md`. No migrations, messages or account/booking changes.
