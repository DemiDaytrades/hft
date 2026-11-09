# Canonical consultation and smart review implementation plan

Authority/spec: user attachment dec84fa3-d767-41c2-bdd4-10eb61c7b392. Goal: capture once, derive, verify and reuse; no deployment, production edits, messages or payment activity.

Baseline: released frozen candidate (fingerprint 8f9085173e573edae8fe6f8294dcdf5f0edb9be539ae0711294bba07f8b1847d), copied to /private/tmp/hft-smart-review. Original deferred work and frozen artifacts remain untouched. Independent local dependencies copied; no production credentials/data configured for dev testing.

## Audit before edits

Read-only capture audit enumerates 446 source fields; downstream registry enumerates 134 owner/key consumer entries. Preserve these documents and produce a joined canonical matrix covering all approved V2 student/instructor keys plus legacy-only facts. Important ambiguities: employment vs study hours; installed vs used/access/proficiency MT5; savings vs emergency reserves; combined 6–12 month vision vs distinct goals; seven legacy knowledge ratings vs 13 canonical topics. Ambiguous data stays evidence, never invented answers. phase3f MO/TC version requirements are existing policy and will not be broadened casually.

## Chosen architecture

Existing V2 student wrappers remain canonical for covered facts. Compatible legacy values are read-only source evidence until explicitly adopted into a draft; original legacy revisions remain historical. Non-equivalent legacy-only facts remain source-backed facts, not fabricated V2 answers. Existing engines produce nonpersistent provisional previews on capture; completed-source generation/publication/approval remains explicit.

Concise instructor review is a versioned sidecar in existing internal system_meta_json; observations remain existing instructor assessment fields, with explicit source kinds and review decisions. No parallel editable after-call summary. New review mode replaces twelve mandatory repetitive instructor entries with affirmative human review, while retaining conditional risk review, acknowledgment, immutable snapshot and downstream approval gates. Existing records without the mode retain their original completion contract.

Every new canonical correction records before/after value, actor/time/source/reason atomically in existing protected event history. No schema migration is expected: existing versioned JSON/event storage can hold the sidecar. If implementation proves a schema addition necessary, keep it additive and rehearse offline; never apply remotely.

## Tasks

- [x] Complete field matrix and exact conservative legacy projection with source refs, conflicts and no-fabrication tests.
- [x] Add staff-only canonical summary/automatic preview service, exact-version save/adopt/review actions; preserve identity/lifecycle/private DTO boundaries.
- [x] Record correction/review history atomically, invalidate review on source edits, preserve completed snapshots and clone known answers into intentional new revisions without fabricating acknowledgments.
- [x] Add concise instructor review UI and generated after-call summary; reuse engine findings, educational evidence, missing information, practical requirements and recommendation. Keep fact editing at canonical source.
- [x] Reuse approved structured controls where exact enums exist, retain narrative/custom values, apply existing approved conditionals and exact missing-item validation.
- [x] Make duplicate legacy facts read-only after canonical capture starts; retain legacy history and explicitly retire manual placement/training JSON as competing authority in favor of reviewed Learning Paths/Financial Plans.
- [x] Run focused, V2, Financial, Path, Academy security, full suite and TypeScript; authenticated local synthetic browser verification. Sync only scoped changed paths back to original repo with original-baseline hash guards.
- [x] Final report including remaining ambiguity/duplication, production-safe rollout instructions, and whether known Carlos information can be reused without re-answering it. No real Carlos record inspection or modification.

## Invariants

Financial data never changes educational competency. Self-report never certifies mastery. Assessment/practical evidence retains independent provenance. No automatic approval, publication, enrollment, student progress or live-trading authorization. No new financial formulas. Approved questions/contracts preserved except narrowly documented optional internal review-validation extension. Unknowns/legacy completion never imply V2 completion or consent.
