# Phase A booking-window extension

Authorized local implementation of the user's minimal extension; production remains untouched.

- [x] Add failing service tests for separate persisted settings, exact notice/horizon boundaries, direct/stale slot rejection, held confirmation/rescheduling and DST.
- [x] Add migration 0038 with minimum_notice_hours (12) and booking_horizon_days (14); retain request_hours semantics. Add shared civil-time window predicate and commit-time notice guard in existing service.
- [x] Extend existing instructor defaults and student date/slot explanation; no second authority. Inclusive cutoff: same instructor-local wall time 14 calendar days ahead; notice measured as elapsed hours. Ambiguous lesson slots remain rejected.
- [x] Verify synthetic local application in Chrome desktop/mobile using pilot settings and retained overrides.
- [x] Focused/full tests, TypeScript, OpenNext, both Worker dry-runs; review and report. No deploy, production configuration or real data changes.

Ruling approved by user: valid held requests and alternatives remain confirmable inside notice until their separate expiry. Notice/horizon guard applies to new requests and proposals, not retroactively to confirmation.
