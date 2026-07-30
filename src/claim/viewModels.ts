/**
 * Component-facing view models for the claim flow.
 *
 * Components consume ONLY these shapes — never the API-facing models in
 * `types.ts` — so no component depends on GHL-specific field names and the
 * API contract can evolve behind the adapter boundary.
 */
import { ClaimSearchResult, ClaimStatus } from './types';

/** The venue identity a funnel/preview screen needs. */
export interface VenueSummary {
  /** Public listing id (Place-ID-shaped in production). */
  id: string;
  name: string;
  area: string;
  city: string;
}

/** One row of the search dropdown, ready to render. */
export interface SearchRowVM {
  key: string;
  name: string;
  /** "Area · City" line, pre-joined. */
  locationLine: string;
  claimStatus: ClaimStatus;
  /** Phase 2: claimed rows are visible but disabled — not clickable, skipped
   * by keyboard navigation, no navigation anywhere. */
  disabled: boolean;
}

/** Maps an API search result to the funnel's venue identity. */
export function toVenueSummary(r: ClaimSearchResult): VenueSummary {
  return {
    id: r.listingId,
    name: r.name,
    area: r.area ?? '',
    city: r.city ?? '',
  };
}

/** Maps an API search result to a renderable dropdown row. */
export function toSearchRow(r: ClaimSearchResult): SearchRowVM {
  return {
    key: r.listingId,
    name: r.name,
    locationLine: [r.area, r.city].filter(Boolean).join(' · '),
    claimStatus: r.claimStatus,
    disabled: r.action === 'NONE',
  };
}

/**
 * Keyboard navigation over the dropdown: moves the highlight up/down while
 * skipping disabled (claimed) rows. Index `results.length` is the always-
 * enabled manual "add your venue" row. Pure function for testability.
 */
export function nextEnabledIndex(
  results: ClaimSearchResult[],
  current: number,
  direction: 1 | -1
): number {
  const last = results.length; // the manual-add row
  let i = current;
  do {
    i += direction;
    if (i < 0 || i > last) return current; // stop at the edges
  } while (i < last && results[i].action === 'NONE');
  return i;
}
