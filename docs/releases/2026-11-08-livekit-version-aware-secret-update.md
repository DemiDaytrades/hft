# LiveKit secret rotation — version preservation feasibility

> Main Worker caveat: the generic clone creation failed with HTTP 400/code 10305. Do not execute it unchanged. See [the read-only diagnosis](2026-11-08-cloudflare-10305-diagnosis.md) for the established asset-handling gap, unproven server cause, and proposed separately authorized undeployed-only procedure.

2026-11-08. **STOPPED BEFORE MUTATION**, as explicitly required if both active code and active version IDs cannot be preserved.

## Verified current production

Read-only Cloudflare deployment/version/settings reads confirm:

| Worker | Active version | Deployment |
| --- | --- | --- |
| hft-landing | fe9f5d14-0fdd-4597-bff3-1da00b951e68 | 44acb585-4f32-4089-a908-1f75d76b838a |
| hft-classroom-control | ca3656bd-df69-435c-97bd-c3cc08149bec | 478ce311-93db-4404-a743-875934fda65e |

Both application code ETags match the recorded Phase B baseline. Binding metadata matches the saved pre-rotation snapshot. Private metadata is preserved under `.wrangler/phase-c-release/2026-11-08/revision-3-deployment/`.

## Why no update was attempted

Cloudflare versions capture code and configuration. Updating a Worker secret creates a new version; making that secret effective requires deploying that new version. The active code can remain identical, but the active version ID cannot remain identical.

Installed Wrangler 4.122.0 implements `versions secret bulk` through `patchLatestWorkerVersionWithSecrets`: PATCH `/accounts/{account_id}/workers/workers/{worker_id}/versions/latest` with secret env overrides. It explicitly uses `latest`, not the deployed version. Therefore it is unsuitable for blindly updating this rolled-back deployment. It creates a new version without deploying it; it does not edit an existing active version in place.

No secret update, stored-version upload, traffic change, Phase C deployment, webhook change, invitation, migration or student/account/booking mutation occurred in this run. Credentials were not printed or transmitted. Replacement credentials remain uninstalled on production Workers; production webhook health and application/provider integration with them are not certified.

## Supported procedure if new secret-only version IDs are separately authorized

This preserves the active Phase B code, but necessarily changes active version IDs. It is not execution authorization.

1. Reconfirm the exact active versions above at 100% traffic and obtain fresh recovery metadata. Abort on drift.
2. Use the Cloudflare Workers API to fetch each exact version, including runtime modules and assets/configuration. Pin the source to the active ID, never `latest`. Keep private module/configuration metadata and per-module hashes; preserve main module, runtime compatibility, static assets, DO namespace/migration tag, services, D1, routes and settings. Do not build from the dirty checkout or substitute Phase C artifacts.
3. Create a new **undeployed** version with POST `/accounts/{account_id}/workers/workers/{worker_id}/versions`, containing those exact modules and configuration. Override only LIVEKIT_API_KEY and LIVEKIT_API_SECRET from the private rotated file. For all other inherited bindings, use the documented `type: inherit` and explicit `version_id` of the corresponding active version. Do not rely on the default `latest`. This explicit inheritance is supported by the Workers API version endpoints; the older script-upload endpoints reject a concrete version ID.
4. Fetch and compare the created version before activation: runtime module hashes, assets/configuration and every unrelated binding must match the pinned active source; only the two intended secret bindings differ. Record the new IDs and recovery baseline. Stop on mismatch; do not route traffic to an unverified version.
5. With explicit authorization allowing new secret-only version IDs, deploy ONLY the two verified new IDs at 100% through POST `/accounts/{account_id}/workers/scripts/{script_name}/deployments` (strategy percentage). Do not activate the previously newest stored version. No D1 or DO migrations.
6. Select the replacement signing key on the existing HFT Production Classroom webhook at `https://highfrequency.vip/api/classroom/webhook`, preserving endpoint/events and all unrelated settings. If private credential entry or dashboard approval is necessary, hand it to the operator.
7. Verify current deployment IDs, identical runtime code and unrelated bindings, correct CLASSROOM_HUB/control URL, replacement provider authentication, webhook signature/delivery and rejection of revoked credentials without logging values. Establish schema 0037/FK zero and compare account/booking data read-only. Do not claim secret-value verification based on binding names alone; Cloudflare does not return stored secret text.
8. Record the secret-updated Phase B versions as rollback targets for a later frozen Revision 3 application rollout. Rolling back to the original secret-bearing version could restore a revoked credential, so those originals are historical code references, not automatically healthy provider rollback targets.

Official references:

- https://developers.cloudflare.com/workers/configuration/secrets/
- https://developers.cloudflare.com/workers/versions-and-deployments/
- https://developers.cloudflare.com/api/resources/workers/subresources/beta/subresources/workers/subresources/versions/methods/create/

The revised authorization must allow **new version IDs with unchanged active application code**. Until then, the requested preservation condition prevents installation. Revision 3 acceptance remains blocked; no migrations should be replayed.
