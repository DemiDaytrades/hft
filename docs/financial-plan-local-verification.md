# Local Financial / Trading Readiness verification

Local implementation only. Do not use a remote DB binding, production identities/data, messaging providers or live payments. No deployment is part of this procedure.

## Automated synthetic journey (no persistent data)

Use Node with `node:sqlite` support (Node 24 was used). From repository root:

```sh
node scripts/test.cjs lib/financial-plan/service.test.ts
node scripts/test.cjs lib/financial-plan/compose.test.ts lib/financial-plan/routes.test.ts lib/financial-plan/render.test.tsx lib/student-intake-v2/plan-engine-v1/uncertainty.test.ts
npm test
node --max-old-space-size=8192 node_modules/typescript/bin/tsc --noEmit --incremental false
```

Tests create synthetic users and approved-contract responses in fresh **in-memory SQLite**, applying all actual migrations. They do not read `.env`, contact providers, use real financial information, or write persistent student data. The service E2E creates/completes Intake V2 through existing operations, generates Version 1, adds instructor guidance, reviews/approves/publishes, checks student DTO privacy and ownership, completes a changed source, generates Version 2, injects a publication failure, verifies Version 1 survives, then publishes Version 2 and verifies history.

## Browser acceptance against a local environment

1. Review migration `0029_financial_readiness.sql`. If an authorized local test environment is available, apply repository migrations **locally only** with `npx wrangler d1 migrations apply hft-data --local`. The application does not apply migrations automatically. This implementation session did not migrate persistent local or production databases.
2. Start the existing development application with `npm run dev` and the local Cloudflare DB binding. Use existing authorized synthetic local admin/student identities. Do not create production accounts or send invitations/recovery messages.
3. Supply a legitimately completed Intake V2 plus consultation assessment through the existing staff intake operations. Approved questions/keys/options are unchanged. The current Intake V2 workspace still only edits selected sections; full staff completion can use the existing `/api/admin/student-intake-v2` operations. All required source answers, consultation fields and actual acknowledgments must be captured; no completion flag shortcut. The new plan screen deliberately refuses incomplete sources. See the in-memory fixture for valid **synthetic** source values, not a script to copy into real records.
4. Open `/admin/financial-plan?studentId=LOCAL_STUDENT_ID` from the admin overview link. The latest completed source ID is prefilled. Generate draft. Repeating normal generation must reuse the same source/engine result. Check version, source ID/revision, form/schema, digest, actor, engine and generation time.
5. Inspect private system evidence, consultation context, missing information, conflicts and 54-field coverage. Confirm ranges remain ranges, debt strategies are self-reported, and no account-size/return/payoff/credit-score prediction appears.
6. Add student guidance, a private note, review resolution and a reason. Add optional instructor actions with rationale and evidence IDs. Save. The exact saved student preview must update; unsaved edits must disable review/approval/publication and leave the preview visibly saved-only.
7. Mark reviewed, approve, then publish. Edit a reviewed draft and verify it returns to DRAFT. Approved content cannot be edited; use Create revision. Open two tabs and verify stale saves/approvals/publications are rejected rather than overwrite newer work.
8. Sign in as the local entitled student. Open `/financial-plan` and `/my-finances`; both should show only the current published plan. View source-age notice where appropriate. Confirm no private note, private resolution, raw assessment, raw conflict implementation, provenance actor data or unpublished version is returned by `/api/financial-plan`.
9. Sign in as a different local student. Query `/api/financial-plan?studentId=THE_FIRST_STUDENT_ID`; the query must not select that student's plan. Student POST attempts to `/api/admin/financial-plan` must fail. A forced-password-change or unentitled session must retain existing denial behavior.
10. Complete a legitimately changed **new** local intake; do not edit the completed source. Generate from the new ID. Confirm Version 1/source/history remain unchanged. Add/review/approve Version 2, publish, and confirm Version 1 becomes SUPERSEDED and the student sees Version 2. Same-source guidance revisions use Create revision. A newer source must never silently replace the published plan.
11. Exercise synthetic PNTA, missing, financial-pressure, borrowed/essential-fund and strong-context cases. Unknowns must remain uncertainty, not automatic safety/danger. Hold educational answers fixed and verify financial changes do not assign or alter Academy competency.
12. Check narrow/mobile layout, keyboard focus, readable long explanations, escaping of written guidance, and review-history navigation. Do not treat automated static rendering as a completed authenticated browser test.

## Operational prerequisites

Review/apply migrations through the separate release process before deploying code that queries the new tables. Confirm actual D1 supports the tested SQLite triggers/JSON functions and run a local Worker/D1 smoke test. Ensure the existing auth, membership and forced-password gates are configured and staff understand private versus student-visible fields. Acknowledgments are server-stamped and must correspond to actual confirmations. Old completed sources with invalid/old acknowledgment metadata require a new correctly captured intake; completed content is locked.

Legacy Game Plan/Training Plan records remain intact. Published V2 financial plans take precedence in My Finances. Without one, the existing legacy summary remains labeled legacy; its older arithmetic is not used by this new engine. Full Intake V2 browser capture, legacy arithmetic remediation and Academy placement are separate scopes.
