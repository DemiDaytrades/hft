> Current acceptance results: [development acceptance report](classroom-livekit-development-acceptance.md). Credentials were configured; remaining gates are media acceptance, not initial setup.

# Phase B — LiveKit development configuration gate

The existing Phase B implementation is preserved. No application/configuration files were edited, no credentials were created, and no provider requests/media tests were attempted in this inspection. Only this setup document was added. The agent stopped its own local QA preview so editing credentials cannot trigger watcher-driven provider calls before confirmation.

## Inspection result

The three expected variables are absent from the shared repository `.dev.vars`, the active acceptance workspace `.dev.vars`, its classroom Worker `.dev.vars`, and the current process environment. Secret values were not printed. An authenticated LiveKit development connection cannot yet be tested.

Existing implementation:

| Area | Existing implementation |
|---|---|
| Provider | `lib/classroom/provider.ts` narrow interface; `livekit.ts` LiveKit Cloud adapter. |
| Room creation/resolution | `listRooms` / `createRoom`, stable `hft-<teaching-session>` name, maximum11 participants. |
| Tokens | Server-side60-second room/person/source-scoped SDK tokens; audience receive-only; no room-admin/data-publish grant. |
| Admission | Existing member DAL plus fresh lifecycle/password/entitlement/roster/host/confirmed-session/join-window/removed/ended checks. |
| Permissions | Independent microphone/camera/screen grants; effective screen permission requires an allocated HFT slot. |
| Mic/camera | Custom browser SDK controls and device selection; participant must deliberately enable devices. |
| Screen | Native capture after reservation/fresh admission, deliberate Start capture,1920×1080 target at10fps. |
| Removal | Session-specific HFT block, strict Cloud revoke cutoff, participant removal and durable cleanup retry. |
| Webhooks | Raw-body signature/checksum/timestamp verification; durable deduplication and current-state reconciliation. |
| Slots | Transactional one reservation/person, maximum3 total and2 student reservations; stop/disconnect/lease/track reconciliation. |
| Focus/layout | Authoritative instructor/presenter/side-by-side stage revision and custom HFT presentation. |
| Reconnect | Fresh HFT admission/lease, token revocation, chat cursor recovery, attendance deduplication. |
| Routes | `/admin/classroom/[sessionId]`, `/classroom/[sessionId]`, `/api/classroom/[sessionId]`, `/api/classroom/[sessionId]/chat`, `/api/classroom/webhook`. |
| Realtime | Dedicated classroom Worker/DO with signed single-use tickets, service bindings and periodic reconciliation. |
| Environment | Server reads Cloudflare `env` bindings; use local `.dev.vars`, never browser-public variables. |

Known unresolved media gate: source-scoped permissions do not atomically limit the number of provider screen tracks. HFT removes unauthorized/excess tracks through reconciliation. Real malicious extra-track/stale-token tests and acceptance of/mitigation for the transient enforcement interval remain required. No local reservation test establishes a hard media-plane limit.

## Development project and plan

1. Open [LiveKit Cloud](https://cloud.livekit.io/) and sign in/create your own account. Create a separate project named **HFT Development** (or equivalent clear development name). Do not select/reuse a production project. LiveKit recommends separate projects per environment: [environment guidance](https://docs.livekit.io/deploy/custom/deployments/).
2. Choose **Build (free)**. Current official pricing lists$0/month with no credit card required. Current default Build quotas allow100 concurrent WebRTC participants,5,000 participant-minutes and50GB downstream transfer; that covers the11-person development target by published concurrency limits, assuming the account has sufficient remaining allowance. Free allowances are hard caps; no paid upgrade is needed just to begin acceptance. Check your project's actual usage/limits before testing. A30-minute11-person run uses approximately330 participant-minutes; screen bandwidth remains dependent on actual media bitrate/subscriptions. Sources: [pricing](https://livekit.com/pricing), [quotas](https://docs.livekit.io/deploy/admin/quotas-and-limits/).
3. Open the project's **Settings → Project** and copy its **Project URL** (`wss://<project>.livekit.cloud`). See [connecting to LiveKit](https://docs.livekit.io/intro/basics/connect/).
4. Open the project's **Settings → API keys** (API keys section). Create a development key if needed; copy its **API Key** and **API Secret** directly into the files below. If the secret is shown only when created, save it privately then. Do not paste it into chat or send screenshots showing it. Do not enable LiveKit's unrestricted Development token server: HFT already has its protected server-side admission/token endpoint. [Development-token-server limitations](https://docs.livekit.io/frontends/build/authentication/development-token-server/).

The exact dashboard labels can vary; select the API-key settings belonging to this development project, not an agent deployment or a production project. HFT does not need an AI agent, telephony, recording, ingress/egress setup or a generic meeting template.

## Exact local files

The verified acceptance server at `http://localhost:3006` runs from the existing isolated workspace **`/private/tmp/hft-phase-b-local`**. Configure these two files for that running environment:

1. `/private/tmp/hft-phase-b-local/.dev.vars` — main HFT app (room admission/token generation/webhooks).
2. `/private/tmp/hft-phase-b-local/workers/classroom/.dev.vars` — classroom control Worker (permission enforcement/periodic reconciliation/cleanup).

Add the same development-project values to **both**, using your local editor:

```dotenv
LIVEKIT_URL="wss://YOUR-DEVELOPMENT-PROJECT.livekit.cloud"
LIVEKIT_API_KEY="YOUR-DEVELOPMENT-API-KEY"
LIVEKIT_API_SECRET="YOUR-DEVELOPMENT-API-SECRET"
```

These are placeholders only. Preserve all existing local `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `CLASSROOM_CONTROL_SECRET`, `CLASSROOM_CONTROL_URL` and delivery flags. Do not overwrite whole files or change the localhost origin. Both files are excluded by the existing `.gitignore`; keep permissions0600. Do not use `NEXT_PUBLIC_*`, source code, `wrangler.jsonc` plain vars or production `wrangler secret put` for these credentials. The canonical repository's `.dev.vars` is a different local environment and will not update this already-tested isolated server.

## Secret-safe configuration check

From a terminal, run this after saving. It prints only names/statuses and whether both files match; it makes no provider request and does not establish credential validity:

```sh
cd /private/tmp/hft-phase-b-local
node --input-type=module <<'NODE'
import {readFileSync} from 'node:fs';
import {parseEnv} from 'node:util';
const files=['.dev.vars','workers/classroom/.dev.vars'];
const keys=['LIVEKIT_URL','LIVEKIT_API_KEY','LIVEKIT_API_SECRET'];
const envs=files.map(file=>parseEnv(readFileSync(file,'utf8')));
for(let i=0;i<files.length;i++){
  const present=keys.every(k=>Boolean(envs[i][k]?.trim())&&!/YOUR-|PASTE|REPLACE/i.test(envs[i][k]));
  let urlOK=false;
  try{const u=new URL(envs[i].LIVEKIT_URL);urlOK=u.protocol==='wss:'&&/^[-a-z0-9]+\.livekit\.cloud$/i.test(u.hostname)&&u.pathname==='/'&&!u.username&&!u.password&&!u.port&&!u.search&&!u.hash;}catch{}
  console.log(files[i]+': '+(present&&urlOK?'configuration present':'INCOMPLETE or placeholder/invalid URL'));
}
console.log('Same development values in both files: '+keys.every(k=>Boolean(envs[0][k])&&envs[0][k]===envs[1][k]));
NODE
```

Do not run `cat .dev.vars`, print the environment, echo keys, include secrets as terminal command arguments, or paste secret-check output that contains values. Existing SDK dependencies are installed; **no npm install is required** for configuration alone.

## Restart and webhook setup

Both local Workers must restart to reload bindings. The agent has stopped its local QA preview intentionally. After you confirm configuration, the agent will verify presence/project matching without printing values and restart the existing local acceptance runtime safely. The restart command below is for that confirmed next step; do not run it before configuration confirmation:

```sh
cd /private/tmp/hft-phase-b-local
./node_modules/.bin/wrangler dev --local \
  --config workers/classroom/wrangler.jsonc \
  --config wrangler.jsonc \
  --ip 127.0.0.1 --port 3006 --persist-to .wrangler/state
```

This starts the app and control Worker in one local runtime sharing the existing synthetic D1 database. Do not run `deploy`, remote migrations or production secret commands. Both earlier synthetic test classes are ENDED, so a fresh local synthetic session will be prepared for media acceptance after confirmation.

LiveKit Cloud cannot deliver webhooks to localhost. After configuration confirmation, a reachable **development-only HTTPS** callback must be prepared/reviewed; this is an additional acceptance prerequisite, not permission to expose production or change production Cloudflare. Then in the development project's **Settings → Webhooks → Create new webhook**, set the callback to `https://<approved-development-host>/api/classroom/webhook` and select the same development API key as the signing key. Do not point it at `highfrequency.vip`. Official steps: [webhook configuration](https://docs.livekit.io/intro/basics/rooms-participants-tracks/webhooks-events/).

## Current acceptance status

No provider-backed exercise was attempted. Actual media participants tested in this task: **0**. Real mic/camera/screens,3 simultaneous tracks,fourth-screen denial,readability,media focus/chat,real demotion/removal/token replay,end/teardown,provider webhooks/attendance,11-person media andmobile media remain NOT TESTED. Safari/Firefox media are not tested.

Previous local control results remain valid historical evidence:159focused/474full tests,TypeScript,OpenNext,Chrome/390px controls and11local control sockets. They were not rerun during this credential-gate inspection and are not being presented as real media acceptance.

- **A. Is real LiveKit media working? NO — not verified.**
- **B. Are three simultaneous authorized screen shares verified? NO.**
- **C. Has Demi +10students been verified with real media? NO.**
- **D. Is Phase B ready for a controlled production release? NO.**

After configuration, tell the agent **“LiveKit development credentials configured in both local QA files.”** Do not include their values. Provider-backed testing must wait for that confirmation. No production changes, purchases, provisioning, messages or Stripe activity occurred.
