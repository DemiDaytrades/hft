# Phase B terminal provider revocation fix

Scope: existing isolated Phase B only. No deployment, production mutation, new features, Phase C, Lesson2, real students or external messages. Reuse `/private/tmp/hft-phase-b-local`; preserve shared source inventory hashes before copying changed owned files.

## Diagnosis and design

HFT commits ENDED and invalidates its grants correctly, but queues only DeleteRoom. LiveKit DeleteRoom disconnects current participants without strictly revoking every outstanding identity token. The existing adapter's RemoveParticipant uses an explicit current-token cutoff and works for absent identities. A real disposable development probe confirmed strict RemoveParticipant followed by DeleteRoom rejects a cached token even after the room is deleted.

Use the persisted ENDED room as the terminal authority; its session ID is never reused and its aggregate revision remains the mutation CAS, not a provider revocation mechanism. Keep60-second minimally scoped tokens and existing fresh post-mint authorization checks. No new generation/schema is needed: revoke every historical roster identity, including disconnected/removed users, before deleting the provider room. Also revoke actual unexpected provider identities and a verified terminal webhook's identity.

Keep a durable delete/terminal cleanup barrier until all strict removals and deletion succeed. Never execute queued pre-END permission grants once state is ENDED. A provider failure must leave ENDED, zero HFT grants/slots/attendance and retryable cleanup. Duplicate/late signed events must enforce terminal cleanup even after the original cleanup queue drained. Regular terminal reads avoid repeatedly revoking an already empty, clean room. Recheck terminal state after provider awaits so stale LIVE reconciliation cannot revive state.

## Execution and evidence

1. Add failing service and webhook regressions: ENDED committed before API calls; strict revocation of connected/absent/removed identities before delete; cached identity replay and late tracks removed; stale permission jobs ignored; partial removal/deletion failure retains cleanup; duplicates retry without revival; live reconnect/removal invariants retained.
2. Add adapter regression: canonical missing-room participant listing is empty; noncanonical/auth/transport failures propagate.
3. Implement minimal terminal reconciliation helper using existing cleanup table; no migration. Run targeted tests red→green.
4. Repeat the actual HFT/provider terminal probe with unexpired publisher credentials and explicit microphone/camera/screen publication attempts after END, not only connect(). Verify fresh HFT denial and persistent terminal state. If provider proof fails, do not proceed to capacity acceptance.
5. After real security PASS, run a fresh complete11-client mixed synthetic exercise with3 native Chrome publishers and8 real RTC/control clients; report client mix exactly. Preserve previously verified webhook results. If local Wrangler interrupts, retain completed evidence and repeat only incomplete steps, diagnosing the proxy failure.
6. Run required focused/full regression, TypeScript, OpenNext and Worker dry-run. Hash-guard sync only owned changed files; no deployment. End all synthetic sessions, delete their development rooms, stop processes and report20 requested results plus A–D.

## Acceptance limits

Real provider outage cannot make a remote API available; HFT must remain terminal and persist retries. Do not claim instantaneous provider enforcement during an unreachable provider. A successful signaling handshake followed by immediate removal is distinct from restored usable media. Record live-client connection/publish/receive evidence explicitly. Existing unrelated mobile, recovery and duplicate-track limits remain documented; do not expand scope to fix them here.
