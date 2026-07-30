/**
 * Claim domain types — API-facing models for the Claim Your Venue flow.
 *
 * Derived from the MySportia Claude Implementation Pack v4.0 schemas
 * (`claim-search-result.schema.json`, `claim-seed.schema.json`) and the
 * founder decisions of 2026-07-19 (A1–A3, C1–C2):
 *
 * - Claim-site search is GHL-backed through a secure server-side BFF.
 *   The browser NEVER talks to GHL directly; these types describe the
 *   BFF's sanitized public projection only.
 * - Claim states (A3): UNCLAIMED → (CLAIM_IN_PROGRESS) → CLAIMED.
 *   CLAIMED means an authenticated owner account + Firebase venue link
 *   exist; it does NOT mean the venue is live.
 * - Search responses never contain human-contact fields, evidence data,
 *   or raw GHL payloads.
 *
 * These are API-facing models. Components must not consume them directly —
 * they use the view models in `viewModels.ts`, so no component ever depends
 * on GHL-specific field names.
 */

/** Ownership state of a venue record (decision A3). `CLAIM_STARTED` from the
 * v4.0 pack schema is a legacy alias, normalized to `CLAIM_IN_PROGRESS` at
 * parse time. */
export type ClaimStatus = 'UNCLAIMED' | 'CLAIM_IN_PROGRESS' | 'CLAIMED';

/** What clicking a search result should do. Computed server-side; the
 * browser never derives routing from raw status alone.
 * Phase 2 scope: `NONE` = claimed rows render disabled (no navigation,
 * no funnel). The pack's legacy `LOGIN` action is normalized to `NONE`
 * at parse time; login routing returns in a later phase. */
export type ClaimAction = 'START_CLAIM' | 'RESUME_CLAIM' | 'NONE';

/** Provenance classification carried by every prepared entity in a claim
 * seed. `generated_default` items must always render as editable
 * suggestions, never as confirmed facts. */
export type EntityClassification = 'confirmed' | 'inferred' | 'generated_default';

/** UI-safe display mapping of {@link EntityClassification}. */
export type DisplayConfidence = 'CONFIRMED' | 'PLEASE_CONFIRM' | 'DRAFT_SUGGESTION';

/** Maps a source classification to its UI display state. Unknown/absent
 * classifications are treated as PLEASE_CONFIRM (never as confirmed). */
export function toDisplayConfidence(c: EntityClassification | undefined): DisplayConfidence {
  if (c === 'confirmed') return 'CONFIRMED';
  if (c === 'generated_default') return 'DRAFT_SUGGESTION';
  return 'PLEASE_CONFIRM';
}

/**
 * One row of the claim-search response (BFF public projection).
 * Based on pack `claim-search-result.schema.json`, tightened per the approved
 * Phase 2 contract: NO `ghlContactId` (server-internal), NO `loginUrl`,
 * NO human-contact data.
 */
export interface ClaimSearchResult {
  /** Stable public listing identity — Google Place ID when available.
   * The only identifier the browser holds; the BFF resolves it internally. */
  listingId: string;
  /** Official venue name. */
  name: string;
  area?: string;
  city?: string;
  address?: string;
  primarySport?: string;
  /** Canonical activity codes (e.g. `MUAY_THAI`) — drives campaign matching. */
  sportsAndActivities?: string[];
  claimStatus: ClaimStatus;
  action: ClaimAction;
}

export interface ClaimSearchResponse {
  results: ClaimSearchResult[];
}

/* ------------------------------------------------------------------ */
/* Claim seed (fetched AFTER an unclaimed venue is selected)           */
/* ------------------------------------------------------------------ */

/** Directory-listing slice of a claim seed (pack doc 02 §5, Tier-1 shape). */
export interface SeedDirectoryListing {
  id?: string;
  name?: string;
  area?: string;
  city?: string;
  address?: string;
  phone?: string;
  website?: string;
  socials?: { facebook?: string; instagram?: string; whatsapp?: string };
  hours?: Record<string, { isActive: boolean; from: string; to: string }>;
  operatingStatus?: 'open' | 'possibly_closed' | 'closed' | 'unknown';
}

/** Public marketplace-profile slice of a claim seed (pack doc 02 §6). */
export interface SeedMarketplaceProfile {
  name?: string;
  description?: string;
  primarySport?: string;
  sportsAndActivities?: string[];
  services?: SeedEntity[];
  classes?: SeedEntity[];
  trainers?: SeedEntity[];
  approvedMedia?: Array<{ url: string; kind?: string }>;
  bookingMode?: string;
}

/**
 * A prepared entity (service, class, trainer, membership…). Field payload is
 * entity-specific; every entity carries its provenance classification.
 */
export interface SeedEntity {
  name?: string;
  classification?: EntityClassification;
  [key: string]: unknown;
}

/** Entity arrays of a claim seed. Arrays may be empty — the UI must never
 * break on an empty array (pack doc 04 §9). */
export interface SeedEntities {
  areas: SeedEntity[];
  services: SeedEntity[];
  classes: SeedEntity[];
  classSessions: SeedEntity[];
  privateSessions: SeedEntity[];
  trainers: SeedEntity[];
  memberships: SeedEntity[];
  packages: SeedEntity[];
}

/**
 * Human-contact hints for editable confirmation (decision C1): shown only
 * when supported by direct venue communication or an official public source,
 * and only as "is this correct?" prompts. Never rendered from search results.
 */
export interface SeedContactHints {
  primaryContactName?: string;
  primaryContactRole?: string;
  ownerName?: string;
  managerName?: string;
  preferredLanguage?: string;
}

/**
 * The full personalized claim seed, loaded only after an UNCLAIMED venue is
 * selected. Mirrors pack `claim-seed.schema.json`. Loaded regardless of the
 * campaign entry page — always the complete venue record.
 */
export interface ClaimSeed {
  schemaVersion: string;
  session: {
    id: string;
    campaign: string;
    locale: string;
    expiresAt: string;
    seedHash?: string;
  };
  identity: {
    /** Server-internal in Phase 2 — the BFF never returns it. */
    ghlContactId?: string;
    listingId: string;
    googlePlaceId: string;
    claimStatus: Extract<ClaimStatus, 'UNCLAIMED' | 'CLAIM_IN_PROGRESS'>;
    venueName?: string;
    normalisedVenueName?: string;
  };
  directoryListing: SeedDirectoryListing;
  marketplaceProfile: SeedMarketplaceProfile;
  entities: SeedEntities;
  contactHints?: SeedContactHints;
  review?: { dataGaps?: string[]; warnings?: string[] };
  ui: {
    campaign: string;
    locale: string;
    approvedMedia?: Array<{ url: string; kind?: string }>;
    displayClassifications?: boolean;
  };
}

/* ------------------------------------------------------------------ */
/* Errors                                                              */
/* ------------------------------------------------------------------ */

/**
 * Thrown when venue search cannot be served (API unreachable, not yet
 * configured, malformed response…). The UI must show a clear
 * temporarily-unavailable state and MUST NOT fall back to mock data
 * (mock-data policy, 2026-07-19).
 */
export class ClaimSearchUnavailableError extends Error {
  constructor(message = 'Venue search is temporarily unavailable') {
    super(message);
    this.name = 'ClaimSearchUnavailableError';
  }
}

/** Thrown by seed loading when the venue is already claimed (BFF 409).
 * The UI shows the non-blocking "already claimed" notice — never the funnel. */
export class VenueClaimedError extends Error {
  constructor(message = 'This venue has already been claimed.') {
    super(message);
    this.name = 'VenueClaimedError';
  }
}

/* ------------------------------------------------------------------ */
/* Runtime validation (no external deps)                               */
/* ------------------------------------------------------------------ */

const CLAIM_STATUSES: ReadonlySet<string> = new Set([
  'UNCLAIMED',
  'CLAIM_IN_PROGRESS',
  'CLAIMED',
]);
const CLAIM_ACTIONS: ReadonlySet<string> = new Set(['START_CLAIM', 'RESUME_CLAIM', 'NONE']);

/** Normalizes the pack's legacy `CLAIM_STARTED` value to `CLAIM_IN_PROGRESS`. */
export function normalizeClaimStatus(value: unknown): ClaimStatus | null {
  if (value === 'CLAIM_STARTED') return 'CLAIM_IN_PROGRESS';
  return typeof value === 'string' && CLAIM_STATUSES.has(value) ? (value as ClaimStatus) : null;
}

/** Normalizes the pack's legacy `LOGIN` action to Phase 2's `NONE`
 * (claimed rows are disabled; login routing is a later phase). */
export function normalizeClaimAction(value: unknown): ClaimAction | null {
  if (value === 'LOGIN') return 'NONE';
  return typeof value === 'string' && CLAIM_ACTIONS.has(value) ? (value as ClaimAction) : null;
}

/** Structural guard for one search-result row (after status normalization). */
export function isClaimSearchResult(v: unknown): v is ClaimSearchResult {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.listingId === 'string' &&
    o.listingId.length > 0 &&
    typeof o.name === 'string' &&
    o.name.length > 0 &&
    typeof o.claimStatus === 'string' &&
    CLAIM_STATUSES.has(o.claimStatus) &&
    typeof o.action === 'string' &&
    CLAIM_ACTIONS.has(o.action)
  );
}

/**
 * Parses and validates a raw BFF search response body. Rows that fail
 * validation are dropped (never rendered); a structurally invalid body
 * throws {@link ClaimSearchUnavailableError}.
 */
export function parseClaimSearchResponse(body: unknown): ClaimSearchResponse {
  if (typeof body !== 'object' || body === null || !Array.isArray((body as { results?: unknown }).results)) {
    throw new ClaimSearchUnavailableError('Malformed search response');
  }
  const results: ClaimSearchResult[] = [];
  for (const raw of (body as { results: unknown[] }).results) {
    if (typeof raw !== 'object' || raw === null) continue;
    const normalized = {
      ...(raw as Record<string, unknown>),
      claimStatus: normalizeClaimStatus((raw as Record<string, unknown>).claimStatus),
      action: normalizeClaimAction((raw as Record<string, unknown>).action),
    };
    if (isClaimSearchResult(normalized)) results.push(normalized);
  }
  return { results };
}
