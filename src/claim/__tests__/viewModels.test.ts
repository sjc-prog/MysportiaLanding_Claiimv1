import { describe, expect, it } from 'vitest';
import { ClaimSearchResult } from '../types';
import { nextEnabledIndex, toSearchRow } from '../viewModels';

const row = (id: string, action: ClaimSearchResult['action']): ClaimSearchResult => ({
  listingId: id,
  name: id,
  claimStatus: action === 'NONE' ? 'CLAIMED' : 'UNCLAIMED',
  action,
});

describe('toSearchRow', () => {
  it('marks claimed (action NONE) rows disabled', () => {
    expect(toSearchRow(row('a', 'NONE')).disabled).toBe(true);
    expect(toSearchRow(row('b', 'START_CLAIM')).disabled).toBe(false);
  });
});

describe('nextEnabledIndex — keyboard navigation skips disabled claimed rows', () => {
  // results: [unclaimed, CLAIMED, unclaimed]; index 3 = manual-add row
  const results = [row('u1', 'START_CLAIM'), row('c1', 'NONE'), row('u2', 'START_CLAIM')];

  it('skips the claimed row moving down', () => {
    expect(nextEnabledIndex(results, 0, 1)).toBe(2);
  });

  it('skips the claimed row moving up', () => {
    expect(nextEnabledIndex(results, 2, -1)).toBe(0);
  });

  it('reaches the manual-add row after the last result', () => {
    expect(nextEnabledIndex(results, 2, 1)).toBe(3);
  });

  it('stays at the edges', () => {
    expect(nextEnabledIndex(results, 0, -1)).toBe(0);
    expect(nextEnabledIndex(results, 3, 1)).toBe(3);
  });

  it('lands on manual-add even when every result is claimed', () => {
    const allClaimed = [row('c1', 'NONE'), row('c2', 'NONE')];
    expect(nextEnabledIndex(allClaimed, 0, 1)).toBe(2);
  });
});
