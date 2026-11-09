# Numbered compatibility release — DEPLOYED AND VERIFIED

**Can Demi resume Carlos's onboarding? YES — through the instructor-led canonical workflow.** His intake still needs missing/conditional information, genuine acknowledgments and instructor review before finalization. No student processing was performed during deployment verification.

- **Deployment ID:** `a3942ac6-54f9-4869-a665-cf65e237c88c`.
- **Worker version:** `ceb65b64-9a49-4342-9a25-d93f0dcd010c`, serving 100%.
- **Deployment created:** 2026-11-07T22:52:43.055569Z.
- **Rollback Worker:** `4ce752ee-afe7-4112-a742-eaa6dcf08880` (the immediate restored baseline; rollback was not needed).
- **Frozen candidate:** [numbered compatibility manifest](2026-11-07-numbered-compatibility-candidate.json), fingerprint `0ff7608c517d50621266a3666ef5abc67c143a2410ebb1eca670cbbc6119d5d0`.

## Release gates

The expected restored Worker was confirmed at 100% before deployment. All 428 frozen source hashes, the source archive and all 1,850 existing OpenNext artifact hashes/fingerprint matched. The verified frozen artifact was deployed directly from its isolated candidate with `wrangler deploy --keep-vars`; no mixed working-tree build or unrelated work was deployed. The artifact was not rebuilt/replaced during this release. Full suite rerun: **325/325 PASS**; fresh TypeScript **PASS, exit 0**; packaging dry run **PASS**. The exact frozen artifact's production-equivalent OpenNext build had already passed when it was frozen.

Fresh pre-deploy D1 backup restored successfully with 13 users, 32 migrations and zero foreign-key violations. Lesson 1 remained published. Configuration read-back is identical before/after, including correct `BETTER_AUTH_URL=https://highfrequency.vip`, D1 binding and preserved secret-binding metadata. No migration, Lesson 1 reinstall, secret/configuration update, message or transaction command was run.

## Production smoke results

| Gate | Result |
|---|---|
| Authenticated instructor | PASS — existing authorized admin session opened production Intake V2, Financial Readiness and Learning Paths |
| Carlos recovery | PASS — seven historical answers populate eight canonical leaf fields; zero manual re-entry needed for those compatible answers |
| Canonical recap | PASS — generated after-call summary includes recovered demo/live history, platforms, goals and learning preference, with retained historical context |
| Missing-information navigation | PASS — explicit missing-item link `student_sections.preferredName` opened About Student; no draft or answer change occurred |
| Ambiguous/confirmation answers | PASS — Needs Confirmation displays ten non-empty retained context/review items with original prompts and reasons; market interest/raw amounts/self-ratings are not silently converted |
| Provenance | PASS — HISTORICAL_STUDENT_REPORTED, historical form versions, original keys/revision, canonical destinations and numbered_compat_v1 displayed |
| Privacy/authentication | PASS within non-destructive scope — anonymous protected pages/new review API require login; student plan APIs reject anonymous access; tested responses expose no private payload. Private/cross-student DTO cases also pass frozen automated tests; no real-student impersonation performed |
| Financial Readiness | PASS — authorized page loads; no real student's plan selected or generated |
| Learning Paths | PASS — authorized page loads; no learning path generated/approved |
| Final Carlos state | PASS — returned to his canonical review, STATUS NO INTAKE V2, seven compatible answers visible, historical/confirmation/summary/missing panels present |

Recovered destinations:

- q3 → `goals30_60_90.goal90`
- q4 → `goalBig`
- q7 → `platformsBrokerExperience.platforms`
- q8 → `demoLiveExperience.demo` and `.live`
- q9 → `priorEducation.type`
- q10 → `majorNegativeExperience.type`
- q11 → `learningStyles`

## Data preservation

Read-only production exports before/after were restored locally and compared across **all 59 tables: every table is identical**. Zero foreign-key violations. Users remain 13; migrations remain 32. Carlos's original historical row, including stored JSON and timestamps, is byte-equivalent by digest. His Intake V2 row count remains **zero**: no draft, adoption, edit, finalization or real plan/path generation occurred. The empty submitted consultation-questionnaire record also remains unchanged. Memberships, Academy progress, plans, paths and communications are unchanged for all students.

Recovery bookmark: `00000235-00000000-0000511c-56a8d248aa6eb49f7b03e0374251118e`. Private backups and integrity evidence are under `.wrangler/numbered-release/2026-11-07/`; SQL files have 0600 permissions. No database restore was needed. [Machine-readable evidence](2026-11-07-numbered-production-verification.json).

## Demi's next browser steps

1. Open [Student Intake V2](https://highfrequency.vip/admin/student-intake-v2), select Carlos Jones. The browser was left on his read-only view.
2. Review **Known from historical intake**, the generated recap, and **Needs confirmation**.
3. When ready to begin capture, click **Start canonical intake draft**, then **Use compatible saved answers**. These are deliberate instructor actions; neither was performed during smoke testing.
4. Use **Show missing required questions only** and the exact missing-item links. Preserve recovered answers; clarify partial context and collect only information actually known/confirmed. Do not guess missing answers or acknowledgments.
5. After saving the required information and genuine acknowledgments, complete the concise instructor review and use final validation before finalizing. There are still 69 field groups with missing/conditional requirements; recovery does not make the intake ready to finalize automatically. Financial-plan and learning-path generation remain separate explicit instructor actions.

No new features, unrelated fixes or follow-on student work began. Verification complete; stopped.
