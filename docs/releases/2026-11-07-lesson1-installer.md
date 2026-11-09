# Lesson 1 installation preparation — not a release approval

This offline preparation tool resolves the missing curriculum installation mechanism described in the resumed preflight report. It does **not** install anything in production, run migrations, deploy, publish, enroll students, or implement Lesson 2. The existing `seed-academy-local.cjs` remains a separate local QA seed; do not use its reference course as a production mapping.

Production at the recorded preflight snapshot had a draft HFT Trading Foundations course, five modules and seven older lessons. No IDs or mapping are guessed from that description. An operator must review a fresh catalog snapshot and explicitly choose the existing course and intended module. Old lessons, ordering, statuses, student assignments, progress and attempts must be retained. Merely adding the new lesson does not place it ahead of older lessons or make it accessible.

## Prepare against an isolated local snapshot

Use a disposable local SQLite snapshot under this repository's `.wrangler/state/`, never a shared development database. Any private production export must remain ignored with restrictive file permissions. Restore and schema migration are separate approved local operations. The tool requires interactive schema migrations 0027 and 0028; the eventual release must independently satisfy the complete pending migration sequence 0027–0032 and all other release gates. It never applies migrations itself.

Run with explicit, reviewed existing IDs:

```sh
node scripts/prepare-money-lesson.cjs \
  --local-db .wrangler/state/rehearsal/catalog.sqlite \
  --course-id EXISTING_COURSE_ID \
  --module-id EXISTING_MODULE_ID \
  --sort-order REVIEWED_UNUSED_INTEGER
```

An explicit nonnegative integer sort position is required and must not collide with another lesson in the selected module; existing ordering is never changed. The default opens SQLite read-only and prints a JSON plan to stdout. It creates no file and makes no changes. The plan contains private instructor answer keys/rubrics: keep any redirected output private and do not serve it to students or publish it as an artifact. No remote/production/publish options exist; unrecognized or repeated flags fail closed. Existing local path restrictions reject symlinks and paths outside `.wrangler/state/`.

Review the plan's mapping, parent statuses, version, source content SHA-256, and three potential inserts: the draft interactive lesson, its mastery quiz, and adaptive homework. The shared row builder reuses the approved authored curriculum and assessment/homework definitions. Only embedded `courseId` and `moduleId` are remapped to the selected existing catalog, matching relational placement and runtime course navigation. No teaching text, bank, rubric, answer, learning version, lesson ID, quiz ID or assignment ID is rewritten. The fixed source timestamp is deterministic curriculum metadata, not an asserted deployment date.

Explicitly rehearse on that disposable local snapshot:

```sh
node scripts/prepare-money-lesson.cjs \
  --local-db .wrangler/state/rehearsal/catalog.sqlite \
  --course-id EXISTING_COURSE_ID \
  --module-id EXISTING_MODULE_ID \
  --sort-order REVIEWED_UNUSED_INTEGER \
  --rehearse-local
```

Local rehearsal checks the plan again inside `BEGIN IMMEDIATE`, inserts missing records atomically, checks foreign keys and commits only on success. Rerunning the identical mapping/content inserts zero records. Exact IDs with conflicting content, attachment, status or metadata abort without overwriting. A probable duplicate lesson under another ID (matching normalized title or embedded approved lesson ID/version), or another quiz/homework already attached to this lesson, requires manual review and aborts. This conservative check cannot recognize every semantically equivalent legacy title; humans must inspect the seven older lessons. A different mapping after installation conflicts rather than moving content.

## Remaining production decision

A production installation artifact can be explicitly prepared from the same reviewed local catalog without executing it:

```sh
node scripts/prepare-money-lesson.cjs \
  --local-db .wrangler/state/rehearsal/catalog.sqlite \
  --course-id EXISTING_COURSE_ID \
  --module-id EXISTING_MODULE_ID \
  --sort-order REVIEWED_UNUSED_INTEGER \
  --emit-artifact .wrangler/state/rehearsal/lesson1-private-artifact.json
```

This opt-in creates a **new** private mode-600 file, refusing overwrite; it cannot be combined with local rehearsal. The bundle includes exact SQL `statements`, source checksum, and `sqliteSql` for offline SQLite rehearsal. It includes private answer keys. No artifact was generated from production or remotely executed during this preparation.

The first statement is a fail-closed guard against stale parents/statuses, schema, sort-position collisions, duplicate lesson aliases, assessment aliases and content conflicts. A failed guard raises SQLite's malformed-JSON error before inserts. Each following insert skips only an exact prevalidated existing ID; conflicting content is never overwritten. All three inserts must execute atomically as one transaction/batch. Tests execute the exact emitted SQLite SQL twice and verify conflicts prevent partial writes; an abort on the last insert also rolls back earlier inserts through the batch adapter.

**D1 does not accept user `BEGIN`/`COMMIT` wrappers. Do not send `sqliteSql` to Wrangler/D1 or split statements into individual calls.** The prepared `executeReviewedMoneyLessonBatch(db, artifact)` helper submits exactly `artifact.statements` as a single D1 `db.batch`; it is intentionally unconnected to application routes or CLI database bindings. Its injected adapter has no credentials/network setup of its own. Any later execution requires a separately authorized operator binding and review of the exact artifact, current catalog and fresh recovery snapshot. There is no production-execution CLI flag here. Do not lift the local path restriction or copy the QA database to production.

Publishing the parent course/module and lesson, adjusting order/gates, and assigning learners are separate explicit actions. This installer leaves the new lesson draft and existing parents unchanged. Do not describe rehearsal success as making Lesson 1 available in production. Review visibility/navigation/security on local fixtures before any later publication; the mapped source metadata is necessary for course navigation.

Validation: `node scripts/test.cjs lib/academy/learning/installer.test.ts lib/academy/learning/seed.test.ts`. The tests use real migrations and in-memory SQLite to exercise no-write preparation, exact authored-content mapping, rerun idempotency, conflict refusal, duplicate refusal and forbidden CLI arguments.
