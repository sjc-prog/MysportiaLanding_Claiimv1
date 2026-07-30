import { describe, expect, it } from 'vitest';
import { campaignMatches } from '../campaigns';

describe('campaignMatches', () => {
  it('matches everything for campaign "all", including venues without activities', () => {
    expect(campaignMatches(['MUAY_THAI'], 'all')).toBe(true);
    expect(campaignMatches([], 'all')).toBe(true);
    expect(campaignMatches(undefined, 'all')).toBe(true);
  });

  it('lets one venue belong to multiple campaigns', () => {
    const multiSport = ['MUAY_THAI', 'YOGA', 'FITNESS'];
    expect(campaignMatches(multiSport, 'combat-sports')).toBe(true);
    expect(campaignMatches(multiSport, 'yoga-wellness')).toBe(true);
    expect(campaignMatches(multiSport, 'fitness')).toBe(true);
  });

  it('excludes venues with no matching activity', () => {
    expect(campaignMatches(['MUAY_THAI'], 'yoga-wellness')).toBe(false);
    expect(campaignMatches([], 'combat-sports')).toBe(false);
    expect(campaignMatches(undefined, 'combat-sports')).toBe(false);
  });
});
