# Local Academy Lesson 1

Curriculum content is authored in `lib/academy/curriculum/what-is-money.ts`. Reusable application contracts, state transitions, assessment logic, and UI are application code. `lib/academy/learning/seed.ts` installs only local development curriculum records; it creates no users, entitlements, enrollments, submissions, or progress.

## Install locally

Use Node 24 (or a Node release supporting `node:sqlite`) from the repository root. Initialize/update the **local** D1 schema first:

```sh
npx wrangler d1 migrations apply hft-data --local
node scripts/seed-academy-local.cjs
```

The seed command itself is entirely offline, does not execute migrations, and requires migrations `0027_interactive_learning.sql` and `0028_learning_versioned_open_attempt.sql`. It opens only an existing SQLite file beneath this repository's `.wrangler/state`, rejects symlinks, and refuses remote/production flags. Automatic discovery requires exactly one nonmetadata `.sqlite` file under `.wrangler/state/v3/d1/miniflare-D1DatabaseObject`. If multiple local databases exist, select the intended database explicitly:

```sh
node scripts/seed-academy-local.cjs --local-db .wrangler/state/v3/d1/miniflare-D1DatabaseObject/LOCAL_FILE.sqlite
```

Output contains only inserted record counts and curriculum IDs. Exact reruns insert nothing and preserve existing progress and timestamps. Conflicting IDs/content versions fail before installation; review a deliberate curriculum migration instead of overwriting existing records. The seed creates one published course, one module, Lesson 1, a quiz definition, and an instructor-gated homework definition. Mixed-format question banks live in the versioned lesson content and are snapshotted for attempts; legacy quiz-question rows are not seeded. No Lesson 2 content is created.

Run `npm run dev` using the existing local Cloudflare `DB` binding and the same repository `.wrangler` state. Do not select a remote binding. This process supplies no authentication credentials. Use an existing authorized **local test** admin account and the existing Academy administration screens to assign the course manually to an existing local test student with valid Academy entitlement. Seeding does not grant access.

## Manual verification

1. Open the local student Academy as the entitled, assigned test student and enter What Is Money?. Verify the eggs/shoes cold open appears before the barter teaching.
2. Complete required interactions and refresh to verify persistence. Verify the final check is locked before required interactions finish.
3. Submit the mixed-format check and verify written responses await instructor review. Open `/admin/academy/review` and follow the interactive review link (or `/admin/academy/learning?studentId=LOCAL_STUDENT_ID&lessonId=hft-money-1`). Use the local instructor review view to record grades and feedback; a student cannot approve their own work.
4. Verify a numeric score of at least 80% cannot bypass required mastery questions 6, 8, and 10. Review weak concepts and the corresponding remediation/homework task. Complete any required remediation and a new attempt; verify prior attempts remain visible.
5. Submit the assigned homework. Verify progression remains gated while review is pending or work is returned for revision. Instructor approval permits completion only when every other gate passes.
6. Verify completion uses the actual reviewed score and Lesson 2 remains unavailable. An unassigned or unentitled local test student must not gain access by opening the lesson URL directly.
7. Inspect student API responses to confirm question answer keys, instructor rubrics, and private student questionnaires are absent.

## Focused automated verification

```sh
node scripts/test.cjs lib/academy/learning/seed.test.ts
npm test
npx tsc --noEmit
```

The seed tests use fresh in-memory SQLite, apply actual repository migrations, and never load production or persistent local student data. The interactive learning service tests cover assessment/review/progression rules separately.

## Future work

The lesson video is a labeled placeholder until an approved HFT asset exists. File/image/PDF and chart submissions need real authenticated storage, upload validation, access control, review presentation, and preservation of prior submission versions before enabling those capabilities. No fake upload storage, personalized financial plan, chart curriculum, or Lesson 2 teaching content is installed. Keep all production migration, deployment, billing, email, and SMS activity outside this local workflow.

## Actual Next.js Instructor Academy acceptance — 7 November 2026

The route is `http://localhost:3000/admin/academy`. `app/(app)/admin/academy/page.tsx` maps directly to `/admin/academy`; `(app)` is an organizational route group, not part of the URL. There is no alternate Instructor Academy URL or base path.

The running server's PID/cwd and dev route manifest were checked against this repository. A direct request reproduced a 500 caused by the missing local `BETTER_AUTH_SECRET`, not a current 404. The exact earlier browser 404 was not reproduced. Local `.dev.vars` was absent; the local D1 database had zero users/curriculum and migrations only through 0026. A route-file move or authorization bypass would not fix those environment prerequisites.

For actual dev-server verification, the empty **local** SQLite database was backed up to `.wrangler/backups/before-actual-academy-acceptance.sqlite`; existing migrations 0027–0032 were applied offline and recorded in the local migration table. Existing authored Lesson 1 was installed using the repository installer. The local acceptance course is named HFT Trading Foundations (the seed's canonical course ID remains `hft-forex-foundations`); this is a local QA title, not a production edit. Only Lesson 1 content was installed. Because the local title differs from the seed's default Forex Foundations, the strict generic seed may report a title conflict if rerun; it deliberately does not overwrite an existing course.

A local-only instructor account (`academy-local@example.invalid`) was added with a Better Auth credential hash. Its generated password is in the gitignored, owner-readable `.env.academy-qa.local`. A unique local-only auth secret and localhost base URL were created in the gitignored, owner-readable `.dev.vars`; no production secret or external-provider credential was used. Existing authentication, roles, lifecycle and progression checks remain unchanged. The running Next.js dev server was refreshed to load the local configuration.

Requests went to the **actual Next.js dev server on port 3000**, with no fixture HTTP server, mocked auth, synthetic cookie or alternate rendering. The normal `/api/auth/sign-in/email` endpoint returned 200 and a real session cookie. Using that cookie, these actual application routes returned **200** with expected page content:

| Page | Exact URL |
|---|---|
| Instructor Academy | `http://localhost:3000/admin/academy` |
| HFT Trading Foundations | `http://localhost:3000/admin/academy/courses/hft-forex-foundations` |
| Stage 1 module / lessons | `http://localhost:3000/admin/academy/modules/hft-stage-1/lessons` |
| Lesson 1 inspection | `http://localhost:3000/admin/academy/inspect/hft-money-1` |
| PREVIEW AS STUDENT | `http://localhost:3000/admin/academy/preview/hft-money-1` |

Without authentication, `/admin/academy` correctly returns 307 to `/login`. Thus a browser without a local session must sign in first; production login cookies do not authenticate localhost. This is actual HTTP/authenticated-server verification, not a new claim of a complete hydrated browser interaction test.

Open `/admin/academy`, sign in with the local QA credentials if redirected, then click **HFT Trading Foundations → Stage 1 — Forex Foundations & History → What Is Money? → PREVIEW AS STUDENT**. Direct Inspect/Preview links are also available on the expanded Academy home.

`.dev.vars.example` now documents the local secret/base-URL prerequisite without checking in a real secret. No production database, provider, deployment, production account or production credential was changed. Local QA data remains available for continued acceptance testing; the pre-setup local backup is retained.

Post-setup checks: instructor focused suite **9/9 passed**; TypeScript (`tsc --noEmit --incremental false`, 8 GB heap) **passed with exit 0**. The actual Next.js dev server remains running on port 3000 for continued user acceptance.
