/**
 * DevStubClaimClient — DEVELOPMENT-ONLY stub with three clearly labeled
 * fixtures. Never bundled into production: only reachable via dynamic import
 * behind `import.meta.env.DEV && VITE_CLAIM_DEV_STUB === 'true'`
 * (see claimClient.ts). Fixtures are obviously fake ("Dev Fixture" in every
 * name) per the mock-data policy of 2026-07-19 — the 380-record mock dataset
 * is retired and must not come back.
 *
 * Fixture coverage (the minimum needed to exercise the flows):
 * 1. UNCLAIMED single-campaign venue → opens the claim funnel.
 * 2. UNCLAIMED multi-campaign venue → proves multi-campaign matching.
 * 3. CLAIMED venue → proves login routing instead of the funnel.
 */
import { ClaimSearchResult, ClaimSeed, VenueClaimedError } from '../claim/types';
import { CampaignId, campaignMatches } from '../claim/campaigns';
import { ClaimClient, SearchOptions } from './claimClient';

export const DEV_FIXTURES: ClaimSearchResult[] = [
  {
    listingId: 'dev-fixture-unclaimed-1',
    name: 'Unclaimed Gym (Dev Fixture)',
    area: 'Chalong',
    city: 'Phuket',
    address: 'Chalong, Phuket, Thailand',
    primarySport: 'Muay Thai',
    sportsAndActivities: ['MUAY_THAI'],
    claimStatus: 'UNCLAIMED',
    action: 'START_CLAIM',
  },
  {
    listingId: 'dev-fixture-multisport-2',
    name: 'Multi-Sport Club (Dev Fixture)',
    area: 'Sukhumvit',
    city: 'Bangkok',
    address: 'Sukhumvit, Bangkok, Thailand',
    primarySport: 'Muay Thai',
    sportsAndActivities: ['MUAY_THAI', 'YOGA', 'FITNESS'],
    claimStatus: 'UNCLAIMED',
    action: 'START_CLAIM',
  },
  {
    listingId: 'dev-fixture-claimed-3',
    name: 'Claimed Gym (Dev Fixture)',
    area: 'Jomtien',
    city: 'Pattaya',
    address: 'Jomtien, Pattaya, Thailand',
    primarySport: 'Muay Thai',
    sportsAndActivities: ['MUAY_THAI', 'BOXING'],
    claimStatus: 'CLAIMED',
    action: 'NONE', // Phase 2: claimed rows are disabled, no login routing
  },
];

/** Minimal seed for the unclaimed fixtures — enough for Phase 3 wiring tests. */
export function buildDevSeed(listingId: string, campaign: CampaignId, locale: string): ClaimSeed {
  const fixture = DEV_FIXTURES.find((f) => f.listingId === listingId);
  return {
    schemaVersion: '1.0',
    session: {
      id: `dev-session-${listingId}`,
      campaign,
      locale,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    },
    identity: {
      listingId,
      googlePlaceId: listingId,
      claimStatus: 'UNCLAIMED',
      venueName: fixture?.name,
    },
    directoryListing: {
      id: listingId,
      name: fixture?.name,
      area: fixture?.area,
      city: fixture?.city,
      address: fixture?.address,
    },
    marketplaceProfile: {
      name: fixture?.name,
      primarySport: fixture?.primarySport,
      sportsAndActivities: fixture?.sportsAndActivities,
      services: [{ name: 'Group class (Dev Fixture)', classification: 'generated_default' }],
    },
    entities: {
      areas: [],
      services: [],
      classes: [],
      classSessions: [],
      privateSessions: [],
      trainers: [],
      memberships: [],
      packages: [],
    },
    ui: { campaign, locale },
  };
}

export class DevStubClaimClient implements ClaimClient {
  async search(query: string, options: SearchOptions = {}): Promise<ClaimSearchResult[]> {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const campaign = options.campaign ?? 'all';
    return DEV_FIXTURES.filter(
      (f) =>
        `${f.name} ${f.area} ${f.city}`.toLowerCase().includes(q) &&
        campaignMatches(f.sportsAndActivities, campaign)
    ).slice(0, options.limit ?? 6);
  }

  async getSeed(
    listingId: string,
    options: { campaign?: CampaignId; locale?: string } = {}
  ): Promise<ClaimSeed> {
    // Mirror the BFF's live claim-status recheck: claimed venues get no seed.
    const fixture = DEV_FIXTURES.find((f) => f.listingId === listingId);
    if (fixture?.claimStatus === 'CLAIMED') throw new VenueClaimedError();
    return buildDevSeed(listingId, options.campaign ?? 'all', options.locale ?? 'en');
  }
}
