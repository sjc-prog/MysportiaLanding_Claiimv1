import { afterEach, describe, expect, it, vi } from 'vitest';
import { ClaimSearchUnavailableError, ClaimSeed, VenueClaimedError } from '../../claim/types';
import { DevStubClaimClient, DEV_FIXTURES } from '../devStubClaimClient';
import { HttpClaimClient } from '../httpClaimClient';
import { UnavailableClaimClient } from '../unavailableClaimClient';
import packSeedExample from '../../claim/__tests__/__fixtures__/claim-seed.pack-example.json';

describe('DevStubClaimClient', () => {
  const client = new DevStubClaimClient();

  it('serves exactly the 3 labeled fixtures — the 380-record mock dataset is retired', () => {
    expect(DEV_FIXTURES).toHaveLength(3);
    for (const f of DEV_FIXTURES) expect(f.name).toContain('Dev Fixture');
  });

  it('returns both CLAIMED and UNCLAIMED results', async () => {
    const rows = await client.search('dev fixture');
    const statuses = new Set(rows.map((r) => r.claimStatus));
    expect(statuses).toContain('UNCLAIMED');
    expect(statuses).toContain('CLAIMED');
  });

  it('claimed fixture carries action NONE (disabled row); unclaimed carries START_CLAIM', async () => {
    const rows = await client.search('gym');
    const claimed = rows.find((r) => r.claimStatus === 'CLAIMED');
    const unclaimed = rows.find((r) => r.claimStatus === 'UNCLAIMED');
    expect(claimed?.action).toBe('NONE');
    expect(unclaimed?.action).toBe('START_CLAIM');
  });

  it('never exposes ghlContactId or loginUrl in results (Phase 2 contract)', async () => {
    const rows = await client.search('gym');
    for (const row of rows) {
      expect(row).not.toHaveProperty('ghlContactId');
      expect(row).not.toHaveProperty('loginUrl');
    }
  });

  it('refuses to build a seed for the claimed fixture (mirrors BFF 409)', async () => {
    await expect(client.getSeed('dev-fixture-claimed-3')).rejects.toBeInstanceOf(VenueClaimedError);
  });

  it('applies campaign filtering; a multi-campaign venue appears in each matching campaign', async () => {
    const combat = await client.search('fixture', { campaign: 'combat-sports' });
    const yoga = await client.search('fixture', { campaign: 'yoga-wellness' });
    const multi = 'Multi-Sport Club (Dev Fixture)';
    expect(combat.map((r) => r.name)).toContain(multi);
    expect(yoga.map((r) => r.name)).toContain(multi);
    // Pure Muay Thai fixture is filtered out of yoga-wellness
    expect(yoga.map((r) => r.name)).not.toContain('Unclaimed Gym (Dev Fixture)');
  });

  it('requires 2+ characters', async () => {
    expect(await client.search('a')).toEqual([]);
  });

  it('builds a seed whose shape matches the pack example contract', async () => {
    const seed = await client.getSeed('dev-fixture-unclaimed-1', { campaign: 'all', locale: 'en' });
    const packSeed = packSeedExample as ClaimSeed;
    // Same top-level contract as the pack's claim-seed example
    for (const key of Object.keys(packSeed) as Array<keyof ClaimSeed>) {
      if (key === 'contactHints' || key === 'review') continue; // optional
      expect(seed).toHaveProperty(key);
    }
    expect(seed.identity.claimStatus).toBe('UNCLAIMED');
    expect(Object.keys(seed.entities).sort()).toEqual(
      Object.keys(packSeed.entities).sort()
    );
  });
});

describe('UnavailableClaimClient', () => {
  it('rejects with ClaimSearchUnavailableError — no mock fallback by policy', async () => {
    const client = new UnavailableClaimClient();
    await expect(client.search()).rejects.toBeInstanceOf(ClaimSearchUnavailableError);
    await expect(client.getSeed()).rejects.toBeInstanceOf(ClaimSearchUnavailableError);
  });
});

describe('HttpClaimClient', () => {
  afterEach(() => vi.unstubAllGlobals());

  const ok = (body: unknown) =>
    Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));

  it('calls the BFF search endpoint with q, campaign and limit', async () => {
    const fetchMock = vi.fn((_input: RequestInfo | URL, _init?: RequestInit) => ok({ results: [] }));
    vi.stubGlobal('fetch', fetchMock);
    await new HttpClaimClient('https://bff.example').search('tiger', {
      campaign: 'combat-sports',
      limit: 6,
    });
    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toBe(
      'https://bff.example/api/claim/venues/search?q=tiger&campaign=combat-sports&limit=6'
    );
  });

  it('omits the campaign param for "all"', async () => {
    const fetchMock = vi.fn((_input: RequestInfo | URL, _init?: RequestInit) => ok({ results: [] }));
    vi.stubGlobal('fetch', fetchMock);
    await new HttpClaimClient('https://bff.example').search('tiger', { campaign: 'all' });
    expect(String(fetchMock.mock.calls[0][0])).not.toContain('campaign=');
  });

  it('maps network failure to ClaimSearchUnavailableError', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new TypeError('offline'))));
    await expect(new HttpClaimClient('https://bff.example').search('xx')).rejects.toBeInstanceOf(
      ClaimSearchUnavailableError
    );
  });

  it('maps non-200 and malformed bodies to ClaimSearchUnavailableError', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(new Response('nope', { status: 503 }))));
    await expect(new HttpClaimClient('https://bff.example').search('xx')).rejects.toBeInstanceOf(
      ClaimSearchUnavailableError
    );
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(new Response('<html>', { status: 200 }))));
    await expect(new HttpClaimClient('https://bff.example').search('xx')).rejects.toBeInstanceOf(
      ClaimSearchUnavailableError
    );
  });

  it('parses a valid response and drops invalid rows', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        ok({
          results: [
            { listingId: 'p1', ghlContactId: 'g1', name: 'Real Gym', claimStatus: 'UNCLAIMED', action: 'START_CLAIM' },
            { listingId: 'p2', name: 'Broken row' },
          ],
        })
      )
    );
    const rows = await new HttpClaimClient('https://bff.example').search('real');
    expect(rows).toHaveLength(1);
    expect(rows[0].name).toBe('Real Gym');
  });
});
