# Phase B request CPU reduction

Implement the user's explicitly authorized request-scoped reuse/query-consolidation approach, in the existing Phase B architecture. No production action, schema change or entitlement/token contract change.

The measured join has 41 SQL statements/38 calls; screenStart has 43/41. Full user reads, three-query authority checks, N-per-person authority reloads and paired room/presence reads dominate D1/decoding work. Repeated reads across provider awaits remain required security barriers. The warm teaching shell has three reads and the teaching API nine, so do not invent N+1 hydration or rewrite its UI.

Use a selective access-account projection. Page authorization shares that projection within the existing React render cache; API authorization reads it afresh. Consolidate room authority, assigned/enrolled role, current room and leases into one indexed context read. Reuse a context only within the current synchronous phase. Replace per-person reconciliation queries with one bounded roster eligibility read. After provider operations, read a new context; preserve commit-time guards and revoke credentials if fresh authorization/connection/grants/terminal state differ.

Combine room and presence retrieval into one selective room read. Preserve the existing lazy initialization, state JSON, nonce/idempotency, provider cutoff, terminal barrier and privacy projections. No global or cross-request authority cache.

The existing DO/WebSocket provides fresh authoritative snapshots. While its LIVE snapshot is fresh, reduce duplicate HTTP polling to a 30-second safety refresh; retain 3-second fallback and independent 15-second protected heartbeat. Restore polling when the socket is absent/stale. No server authorization bypass and no stale client snapshot accepted as authority.

Alternatives: only raising limits is excluded by the user; routing every command through a new DO endpoint adds protocol/security scope and is unnecessary before measuring consolidated reads. Neither alternative is selected.

Targets: initialized service snapshot one D1 read; provider-backed service join no more than 14 calls, screenStart no more than 16, independent of roster size up to 11. Preserve fresh post-await checks. Measure HTTP totals, actual provider RPC counts and payload/decoding work on the compiled artifact; local CPU samples do not certify production Free-plan enforcement.

Apply the minimal patch to the isolated Phase B copy and shared source without overwriting Phase C behavior. Both future candidates retain the production publish-body fix. Test red/green query budgets, revocation races, existing classroom/security, teaching and Phase C suites; verify TypeScript, OpenNext/dry-runs, development provider and native screen regression; freeze only the narrow verified source/artifacts. No claim of guaranteed 10 ms production CPU from local timings.
