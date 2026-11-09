# Phase B classroom design

The user's detailed Phase B brief is the implementation authority and already selects LiveKit Cloud, an HFT interface, confirmed Phase A sessions, and HFT-owned realtime state. No repeat product-design approval is needed to implement that authorized design. No production operations are permitted; Phase A acceptance/reminder status stays open.

## Approach

Use additive D1 classroom records referenced by the existing teaching session UUID. A dedicated Cloudflare classroom Worker/Durable Object serializes room control and WebSocket broadcast; D1 remains the durable authorization/history source. Next routes use existing member/admin authentication. LiveKit carries only media through a narrow server adapter and custom client, never through D1/DO. A polling recovery path reads the same authorized snapshot when a realtime connection is unavailable; it does not invent a second state system.

A single room per teaching session has SCHEDULED/READY/LIVE/ENDED, monotonic revisions, idempotent commands, participant-specific grants/removal, one media identity per person, a three-slot screen allocation, ordered persisted chat and attendance intervals. Terminal state commits before cleanup; failures queue retryable provider work. Admission and every control command recheck the actual account, entitlement, roster, host and time window. Short-lived room/source-scoped media tokens and strict LiveKit Cloud token revocation are necessary; mocks cannot establish actual stale-token behavior.

No credentials were found in the existing local environment. Missing credentials must produce an explicit media-unavailable state, never fake production credentials or a successful-media claim. Local synthetic fixtures may exercise HFT controls without media. Real provider/multi-presenter acceptance remains a separate external gate.

## Limits and safety

Demi + at most ten enrolled students; microphone, camera and screen rights are independent. Audience starts receive-only. Each participant uses one media identity; reconnect closes/replaces a prior control/media connection with fresh admission. A screen lease is reserved before source publishing is granted and stale/disconnected leases reconciled. The host may use one screen; at most two students can have active screen rights. Mobile subscribes only the focused screen. Chat is plain safe text, bounded, ordered, deduplicated and moderated; private instructor data never enters the response contract. Missing telemetry never means no-show or mastery.

Join window default: 15 minutes before scheduled start through two hours after scheduled end; host may ready/start in that window, students wait until host starts. These are local implementation defaults, documented rather than represented as an approved existing production policy. Provider outage fails closed on new media admission and reports cleanup pending.
