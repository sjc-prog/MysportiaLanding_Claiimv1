import { describe, expect, it, vi } from 'vitest';
import { routeClaimedVenueToLogin } from '../config';

describe('routeClaimedVenueToLogin', () => {
  it('navigates to the result-level loginUrl when present', () => {
    const navigate = vi.fn();
    const routed = routeClaimedVenueToLogin('https://backoffice.example/login', navigate);
    expect(routed).toBe(true);
    expect(navigate).toHaveBeenCalledWith('https://backoffice.example/login');
  });

  it('returns false (no navigation) when no login URL is configured', () => {
    const navigate = vi.fn();
    // VITE_BACKOFFICE_LOGIN_URL is unset in the test environment
    const routed = routeClaimedVenueToLogin(undefined, navigate);
    expect(routed).toBe(false);
    expect(navigate).not.toHaveBeenCalled();
  });
});
