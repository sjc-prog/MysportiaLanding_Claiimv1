/**
 * ClaimClient — the single boundary between the UI and venue-claim data.
 *
 * Production target (Phase 2): `HttpClaimClient` → secure server-side BFF →
 * GHL. GHL is authoritative for claim-site search (identity, claim status,
 * eligibility, campaign matching, prepared data — decision A1); the browser
 * never calls GHL directly and never holds GHL credentials.
 *
 * How the real client replaces the stub: `createClaimClient()` is the only
 * place that chooses an implementation. Components depend on this interface
 * alone, so Phase 2 requires zero component changes — the BFF just has to
 * honor the `ClaimSearchResponse` / `ClaimSeed` contracts in `claim/types.ts`.
 *
 * Mock-data policy (2026-07-19): there is NO mock fallback. Without a
 * configured API (or the explicit dev stub), search reports unavailable and
 * the UI shows a temporary-unavailable state; the manual "add your venue"
 * path stays open.
 */
import { ClaimSearchResult, ClaimSeed } from '../claim/types';
import { CampaignId } from '../claim/campaigns';
import { claimApiBaseUrl, devStubEnabled } from '../claim/config';
import { HttpClaimClient } from './httpClaimClient';
import { UnavailableClaimClient } from './unavailableClaimClient';

export interface SearchOptions {
  /** Campaign filter — venues may match multiple campaigns; `all` = no filter. */
  campaign?: CampaignId;
  /** BCP-47-ish UI locale for the BFF (analytics + alias matching). */
  locale?: string;
  /** Max rows (server caps at 20 per pack schema). */
  limit?: number;
  /** Abort signal for stale-request cancellation while typing. */
  signal?: AbortSignal;
}

export interface ClaimClient {
  /**
   * Venue typeahead search.
   * @throws ClaimSearchUnavailableError when search cannot be served —
   * the UI must show the unavailable state, never mock results.
   */
  search(query: string, options?: SearchOptions): Promise<ClaimSearchResult[]>;

  /**
   * Loads the full personalized claim seed for an UNCLAIMED venue.
   * Phase 3 wires this into the funnel; defined now so the contract is
   * complete and the stub can exercise it in tests.
   */
  getSeed(listingId: string, options?: { campaign?: CampaignId; locale?: string }): Promise<ClaimSeed>;
}

/** Dev-only lazy wrapper: awaits the dynamically imported stub inside each
 * call so fixtures are code-split out of production bundles while dev search
 * works from the first keystroke. */
class LazyStubClaimClient implements ClaimClient {
  private loading = import('./devStubClaimClient').then((m) => new m.DevStubClaimClient());
  search(query: string, options?: SearchOptions) {
    return this.loading.then((c) => c.search(query, options));
  }
  getSeed(listingId: string, options?: { campaign?: CampaignId; locale?: string }) {
    return this.loading.then((c) => c.getSeed(listingId, options));
  }
}

let instance: ClaimClient | null = null;

/**
 * Returns the app-wide ClaimClient.
 *
 * Selection order:
 * 1. Dev stub — only when `import.meta.env.DEV` AND `VITE_CLAIM_DEV_STUB=true`
 *    (dynamically imported so fixtures are never bundled into production).
 * 2. HTTP client — when `VITE_CLAIM_API_BASE_URL` is set.
 * 3. Unavailable client — everything else; search shows the unavailable state.
 */
export function getClaimClient(): ClaimClient {
  if (!instance) {
    instance = devStubEnabled
      ? new LazyStubClaimClient()
      : claimApiBaseUrl
        ? new HttpClaimClient(claimApiBaseUrl)
        : new UnavailableClaimClient();
  }
  return instance;
}

/** Test seam: inject/reset the client (used by unit tests only). */
export function setClaimClientForTesting(client: ClaimClient | null): void {
  instance = client;
}
