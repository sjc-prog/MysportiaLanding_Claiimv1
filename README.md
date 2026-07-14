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

- `VITE_LEAD_WEBHOOK_URL` — GoHighLevel inbound webhook. Every event (search keystrokes
  debounced 600ms, venue selected, each field change, each step completed) POSTs JSON:
  `{type, step, field, value, venueName, at, sessionId}`. Without it, events log to console
  and persist to localStorage (`mysportia_lead_events`) so dev sessions lose nothing.
- `VITE_BOOKING_EMBED_URL` — GoHighLevel calendar embed for the "Talk to us" modal.
  Without it, a LINE @mysportia fallback button shows.

## Venue data

`src/data/venues.ts` — 41 real well-known gyms + deterministic filler to 380 records,
standing in for the scraped venue DB. Swap `VENUES`/`searchVenues` for the real API when ready.

## Assets

`public/assets/` — MySportia logos (from investor landing), fighter/trainer photos and real
gym logos pulled from the Figma investor-pitch file, brand athlete from the brand book.

## Copy rules honored (do not regress)

- "The marketplace sends you customers" — never "we are a marketplace" (BOI language rule).
- No live-consumer-app claims — launch framing only.
- 5% on online transactions stated plainly; free means free (no setup/monthly/contract).
- Footer keeps all-sports positioning; Muay Thai is "where the campaign begins."
