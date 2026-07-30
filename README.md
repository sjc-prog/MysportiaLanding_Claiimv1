# MySportia — Venue Claim Landing (Muay Thai campaign)

Venue-facing landing page + "claim your venue" funnel, built per the 2026-07-14 build brief
(Justin's angle). Sells demand first; Exsportia appears only as "powered by / your free back office."

## Run

```bash
npm install
npm run dev        # local dev on vite default or --port
npm run build      # production bundle → dist/
npm run typecheck
```

## Flow

Landing (hero + typeahead search) → 10-step funnel (each step = tiny input + one benefit)
→ mock dashboard preview (their gym name in it, labeled PREVIEW) → account creation / setup call.
"Talk to us" floats on every screen.

## Wiring for launch

Set these env vars (`.env.local`):

- `VITE_CLAIM_API_BASE_URL` — base URL of the secure claim BFF (Phase 2). While unset,
  venue search shows a temporary-unavailable state (there is deliberately NO mock
  fallback); the manual "add your venue" path stays open.
- `VITE_BACKOFFICE_LOGIN_URL` — back-office login target for CLAIMED search results
  (used when the API result carries no venue-specific loginUrl).
- `VITE_CLAIM_DEV_STUB=true` — dev-only: serves 3 clearly-labeled fixture venues
  instead of the API (ignored in production builds).
- `VITE_LEAD_WEBHOOK_URL` — GoHighLevel inbound webhook. Every event (search keystrokes
  debounced 600ms, venue selected, each field change, each step completed) POSTs JSON:
  `{type, step, field, value, venueName, at, sessionId}`. Without it, events log to console
  and persist to localStorage (`mysportia_lead_events`) so dev sessions lose nothing.
- `VITE_BOOKING_EMBED_URL` — GoHighLevel calendar embed for the "Talk to us" modal.
  Without it, a LINE @mysportia fallback button shows.

See `.env.example`. Never put GHL secrets or Firebase Admin credentials in `VITE_*` vars.

## Venue data

The old 380-record local mock dataset (`src/data/venues.ts`) is retired (mock-data
policy 2026-07-19). Search goes through the typed `ClaimClient` boundary
(`src/api/claimClient.ts`): production targets the secure GHL-backed BFF
(`HttpClaimClient`); without configuration search reports unavailable; a 3-fixture
dev stub exists behind `VITE_CLAIM_DEV_STUB` for local testing only.

## Assets

`public/assets/` — MySportia logos (from investor landing), fighter/trainer photos and real
gym logos pulled from the Figma investor-pitch file, brand athlete from the brand book.

## Deployment (Cloudflare Pages — staging)

This app deploys from the dedicated private repo **`Exsportia/mysportia-venues-landing`**
(a `git subtree split` of this folder — created because the executive-team
monorepo contains an unrelated broken submodule reference that Cloudflare
Pages cannot skip). Pages project settings:

| Setting | Value |
|---|---|
| Production branch | `staging` |
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |
| Environment variable | `VITE_CLAIM_API_BASE_URL=https://mysportia-claim-bff-staging-59568589018.asia-southeast1.run.app` |

No other env vars are needed for staging. Never add GHL or Firebase
credentials here — the frontend only ever knows the BFF URL.
Reminder: the BFF's Cloud Run `ALLOWED_ORIGINS` must include the Pages
origin or browser calls will fail CORS.

## Syncing the deployment repo (from executive-team)

Work happens in the monorepo; the deploy repo is a read-only mirror of this
folder. After landing changes on the working branch, refresh it with:

```bash
cd /Users/jcohen/Dropbox/executive-team
SPLIT=$(git subtree split --prefix=mysportia-venues-landing <branch>)
git push https://github.com/Exsportia/mysportia-venues-landing.git "$SPLIT:staging"
```

Do not commit directly in the deploy repo — extra commits there break the
fast-forward subtree push (if that happens, re-split and push with
`+$SPLIT:staging` after confirming nothing in the deploy repo is unique).

## Copy rules honored (do not regress)

- "The marketplace sends you customers" — never "we are a marketplace" (BOI language rule).
- No live-consumer-app claims — launch framing only.
- 5% on online transactions stated plainly; free means free (no setup/monthly/contract).
- Footer keeps all-sports positioning; Muay Thai is "where the campaign begins."

## Documentation status

Reconciled 2026-07-20. Service-level README for the current landing app. The canonical product and architecture source is `Mysportia-GHL_mysportia database synce work/MySportia_Full_Documentation_Bundle_v4.0/MySportia_Internal_Master_Documentation_v4.0/MASTER_INTERNAL_BLUEPRINT_SINGLE_FILE.md`. Future venue/vault binary assets belong in Cloudflare R2 with Asset Registry metadata; checked-in `public/assets/` files are small system/demo assets only.
