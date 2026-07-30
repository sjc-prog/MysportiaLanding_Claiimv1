/**
 * HttpClaimClient — the production ClaimClient targeting the secure claim
 * BFF (Phase 2). The BFF owns GHL access, rate limiting, sanitization and
 * the public projection; this client only speaks the typed contract.
 *
 * Endpoints (pack doc 03 §2 / doc 04 §3):
 *   GET {base}/api/claim/venues/search?q&campaign&locale&limit
 *   GET {base}/api/claim/venues/{listingId}/seed?campaign&locale
 *
 * Any transport/shape failure surfaces as ClaimSearchUnavailableError —
 * never a mock fallback (mock-data policy 2026-07-19).
 */
import {
  ClaimSearchResult,
  ClaimSearchUnavailableError,
  ClaimSeed,
  parseClaimSearchResponse,
  VenueClaimedError,
} from '../claim/types';
import { CampaignId } from '../claim/campaigns';
import { ClaimClient, SearchOptions } from './claimClient';

export class HttpClaimClient implements ClaimClient {
  constructor(private readonly baseUrl: string) {}

  async search(query: string, options: SearchOptions = {}): Promise<ClaimSearchResult[]> {
    const params = new URLSearchParams({ q: query });
    if (options.campaign && options.campaign !== 'all') params.set('campaign', options.campaign);
    if (options.locale) params.set('locale', options.locale);
    params.set('limit', String(options.limit ?? 6));

    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}/api/claim/venues/search?${params}`, {
        signal: options.signal,
        headers: { Accept: 'application/json' },
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') throw err;
      throw new ClaimSearchUnavailableError();
    }
    if (!response.ok) throw new ClaimSearchUnavailableError(`Search failed (${response.status})`);
    return parseClaimSearchResponse(await response.json().catch(() => null)).results;
  }

  async getSeed(
    listingId: string,
    options: { campaign?: CampaignId; locale?: string } = {}
  ): Promise<ClaimSeed> {
    const params = new URLSearchParams();
    if (options.campaign) params.set('campaign', options.campaign);
    if (options.locale) params.set('locale', options.locale);
    const qs = params.size > 0 ? `?${params}` : '';

    let response: Response;
    try {
      response = await fetch(
        `${this.baseUrl}/api/claim/venues/${encodeURIComponent(listingId)}/seed${qs}`,
        { headers: { Accept: 'application/json' } }
      );
    } catch {
      throw new ClaimSearchUnavailableError('Claim data is temporarily unavailable');
    }
    if (response.status === 409) throw new VenueClaimedError();
    if (!response.ok) {
      throw new ClaimSearchUnavailableError(`Claim data unavailable (${response.status})`);
    }
    return (await response.json()) as ClaimSeed;
  }
}
