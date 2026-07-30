import { describe, expect, it } from 'vitest';
import {
  ClaimSearchUnavailableError,
  isClaimSearchResult,
  normalizeClaimStatus,
  parseClaimSearchResponse,
  toDisplayConfidence,
} from '../types';
import packSearchExample from './__fixtures__/claim-search-response.pack-example.json';

describe('parseClaimSearchResponse', () => {
  it('accepts the v4.0 pack example payload, normalizing legacy LOGIN to NONE', () => {
    const parsed = parseClaimSearchResponse(packSearchExample);
    expect(parsed.results).toHaveLength(2);
    expect(parsed.results[0]).toMatchObject({
      listingId: 'ChIJk6zBNwef4jARCQ5MmV1odd0',
      claimStatus: 'UNCLAIMED',
      action: 'START_CLAIM',
    });
    // Phase 2 contract: claimed rows are disabled (action NONE), no login routing
    expect(parsed.results[1]).toMatchObject({
      claimStatus: 'CLAIMED',
      action: 'NONE',
    });
  });

  it('normalizes the legacy pack status CLAIM_STARTED to CLAIM_IN_PROGRESS (decision A3)', () => {
    const parsed = parseClaimSearchResponse({
      results: [
        {
          listingId: 'x1',
          ghlContactId: 'g1',
          name: 'Some Gym',
          claimStatus: 'CLAIM_STARTED',
          action: 'RESUME_CLAIM',
        },
      ],
    });
    expect(parsed.results[0].claimStatus).toBe('CLAIM_IN_PROGRESS');
  });

  it('drops rows that fail validation instead of rendering them', () => {
    const parsed = parseClaimSearchResponse({
      results: [
        { listingId: '', ghlContactId: 'g', name: 'No id', claimStatus: 'UNCLAIMED', action: 'START_CLAIM' },
        { listingId: 'ok', ghlContactId: 'g', name: 'Valid', claimStatus: 'UNCLAIMED', action: 'START_CLAIM' },
        { listingId: 'bad-status', ghlContactId: 'g', name: 'Bad', claimStatus: 'WHATEVER', action: 'START_CLAIM' },
        'not-an-object',
      ],
    });
    expect(parsed.results.map((r) => r.listingId)).toEqual(['ok']);
  });

  it('throws ClaimSearchUnavailableError on a structurally invalid body', () => {
    expect(() => parseClaimSearchResponse(null)).toThrow(ClaimSearchUnavailableError);
    expect(() => parseClaimSearchResponse({ nope: true })).toThrow(ClaimSearchUnavailableError);
    expect(() => parseClaimSearchResponse('html error page')).toThrow(ClaimSearchUnavailableError);
  });
});

describe('normalizeClaimStatus', () => {
  it('passes through the three canonical statuses and rejects junk', () => {
    expect(normalizeClaimStatus('UNCLAIMED')).toBe('UNCLAIMED');
    expect(normalizeClaimStatus('CLAIM_IN_PROGRESS')).toBe('CLAIM_IN_PROGRESS');
    expect(normalizeClaimStatus('CLAIMED')).toBe('CLAIMED');
    expect(normalizeClaimStatus('CLAIM_STARTED')).toBe('CLAIM_IN_PROGRESS');
    expect(normalizeClaimStatus('LIVE')).toBeNull();
    expect(normalizeClaimStatus(42)).toBeNull();
  });
});

describe('isClaimSearchResult', () => {
  it('requires listingId, name, status and action (no ghlContactId in Phase 2)', () => {
    expect(
      isClaimSearchResult({
        listingId: 'a',
        name: 'C',
        claimStatus: 'CLAIMED',
        action: 'NONE',
      })
    ).toBe(true);
    expect(isClaimSearchResult({ listingId: 'a', name: 'C' })).toBe(false);
    // Raw LOGIN is not valid post-normalization vocabulary
    expect(
      isClaimSearchResult({ listingId: 'a', name: 'C', claimStatus: 'CLAIMED', action: 'LOGIN' })
    ).toBe(false);
  });
});

describe('toDisplayConfidence', () => {
  it('never presents generated or unknown data as confirmed', () => {
    expect(toDisplayConfidence('confirmed')).toBe('CONFIRMED');
    expect(toDisplayConfidence('inferred')).toBe('PLEASE_CONFIRM');
    expect(toDisplayConfidence('generated_default')).toBe('DRAFT_SUGGESTION');
    expect(toDisplayConfidence(undefined)).toBe('PLEASE_CONFIRM');
  });
});
