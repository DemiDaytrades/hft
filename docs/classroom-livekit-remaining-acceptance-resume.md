> Current result: [final provider acceptance](classroom-livekit-provider-acceptance-final.md). Playback, three native shares and Cloud delivery passed; a cached-token End Class defect blocks production release. This earlier document is historical.

# Remaining Phase B provider acceptance — resume checkpoint

2026-11-08. Development only. **Acceptance is not complete and production readiness remains NO.**

The user explicitly requires stopping at a necessary manual LiveKit dashboard action. This checkpoint stops there; it does not replace the previous results in `classroom-livekit-development-acceptance.md` or claim the remaining browser/capacity gates passed.

Completed on this resume:

- Secret-safe presence check: URL/key/secret present in main QA app and control Worker; all three values match. Values were not printed.
- Read-only development LiveKit API access passed. The previously ended synthetic room remains removed.
- Restarted the existing main app and control Worker together on loopback port 3006. Login returned HTTP200. Runtime log checked against configured credential values: no matches.
- Prepared a temporary webhook-only loopback proxy on port3011. It verifies the raw request with the existing LiveKit server SDK before forwarding only `POST /api/classroom/webhook` to the existing application route. It neither serves files nor exposes application routes; payloads and authorization headers are not logged.
- Downloaded Cloudflare's official arm64 `cloudflared`2026.10.7 into the private QA directory and verified its official SHA-256 digest. The first download path failed; the official release asset API fallback succeeded. No system installation, Cloudflare login, named tunnel, DNS or account/production configuration change.
- Started an anonymous temporary HTTPS tunnel to the restricted proxy. Public checks passed: unsigned request401; invalid signature401; `/login`404; `/admin`404. All responses confirmed the webhook-only proxy.

Current temporary callback:

`https://chris-projector-hide-compliance.trycloudflare.com/api/classroom/webhook`

This URL is temporary and stops working when its tunnel process stops. The QA app, restricted proxy and tunnel are intentionally running for the manual setup/resumed test. No new classroom session or provider media room was created during this resume.

## Manual action required

1. Open LiveKit Cloud and select the same **development** project used by the private QA files.
2. Open **Settings → Webhooks**.
3. Select **Create new webhook**.
4. Name: `HFT Phase B local QA`.
5. URL: the complete temporary callback above.
6. Signing API key: select the current development key configured in both QA files. Do not paste a secret into chat or change production keys.
7. Select **Create**. If a temporary QA entry with this name already exists, update that QA entry instead of creating duplicates; leave unrelated entries unchanged.
8. Report that the webhook was created. Do not create real sessions or invite students.

These fields and menu steps follow the [official LiveKit webhook instructions](https://docs.livekit.io/intro/basics/rooms-participants-tracks/webhooks-events/). Anonymous temporary tunnels are documented in [Cloudflare Quick Tunnels](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/).

## Remaining work after the manual action

Real Cloud delivery/signature/deduplication/reconciliation; final browser camera/audio/screen playback; three native shares and fourth denial; focus/side-by-side/readability; full11-person interaction;390px watch/listen; removal/reconnect/attendance/end under real media; final required regression checks and cleanup. Prior497 full-suite/66 classroom/TypeScript/OpenNext/Worker dry-run results are preserved, not unnecessarily rerun at this intermediate setup checkpoint.

Private process IDs, configuration booleans and evidence paths are recorded in `/private/tmp/hft-phase-b-local/.wrangler/livekit-acceptance/state.json`. Actual verified tunnel state and denial checks are under `/private/tmp/hft-livekit-rtc-qa/`. No application feature changes, migration, deployment, production mutation, real-student access, message or Stripe activity occurred.
