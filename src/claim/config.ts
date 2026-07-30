/**
 * Claim-flow runtime configuration.
 *
 * Frontend-safe values ONLY. GHL credentials, Firebase Admin credentials and
 * session secrets are server-side concerns and must never appear in any
 * `VITE_*` variable (pack doc 08 §1).
 */

/** Base URL of the secure claim BFF (Phase 2). Empty = search unavailable. */
export const claimApiBaseUrl: string =
  (import.meta.env.VITE_CLAIM_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? '';

/**
 * Opt-in development stub (2–3 labeled fixtures). Only honored in dev builds;
 * production bundles never include or serve fixture venues.
 */
export const devStubEnabled: boolean =
  import.meta.env.DEV && import.meta.env.VITE_CLAIM_DEV_STUB === 'true';

/**
 * Back-office login target for CLAIMED results (decision A3: claimed venues
 * route to the MySportia/Exsportia back-office login, never into the claim
 * funnel). Result-level `loginUrl` from the API wins over this default.
 */
export const backOfficeLoginUrl: string =
  (import.meta.env.VITE_BACKOFFICE_LOGIN_URL as string | undefined) ?? '';

/**
 * Routes a claimed venue to back-office login. Configurable/injectable so
 * tests and future routing changes don't touch call sites.
 *
 * @returns true when navigation happened, false when no login URL is
 * configured (callers should surface a neutral "already claimed" notice).
 */
export function routeClaimedVenueToLogin(
  resultLoginUrl: string | undefined,
  navigate: (url: string) => void = (url) => window.location.assign(url)
): boolean {
  const url = resultLoginUrl || backOfficeLoginUrl;
  if (!url) return false;
  navigate(url);
  return true;
}
