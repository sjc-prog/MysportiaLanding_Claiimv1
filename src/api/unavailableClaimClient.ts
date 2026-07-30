/**
 * UnavailableClaimClient — active when no claim API is configured (and the
 * dev stub is off). Every call reports the unavailable state so the UI shows
 * its temporary-unavailable message and keeps the manual "add your venue"
 * path open. Deliberately NO mock fallback (mock-data policy 2026-07-19).
 */
import { ClaimSearchResult, ClaimSearchUnavailableError, ClaimSeed } from '../claim/types';
import { ClaimClient } from './claimClient';

export class UnavailableClaimClient implements ClaimClient {
  search(): Promise<ClaimSearchResult[]> {
    return Promise.reject(new ClaimSearchUnavailableError());
  }
  getSeed(): Promise<ClaimSeed> {
    return Promise.reject(new ClaimSearchUnavailableError('Claim data is temporarily unavailable'));
  }
}
