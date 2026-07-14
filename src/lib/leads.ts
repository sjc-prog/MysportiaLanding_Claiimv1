// Lead capture — every field the visitor touches becomes a lead event.
// Events queue locally and flush to the CRM webhook (GoHighLevel) when configured.
// Set VITE_LEAD_WEBHOOK_URL to enable network delivery; without it events
// persist to localStorage and log to console so nothing is lost in dev.

export interface LeadEvent {
  type:
    | 'search_typed'
    | 'venue_selected'
    | 'venue_not_found'
    | 'field_changed'
    | 'step_completed'
    | 'funnel_abandoned'
    | 'talk_to_us_clicked'
    | 'call_requested'
    | 'account_started';
  step?: number;
  field?: string;
  value?: string;
  venueId?: string;
  venueName?: string;
  at: string;
  sessionId: string;
}

const WEBHOOK_URL: string | undefined = import.meta.env.VITE_LEAD_WEBHOOK_URL;
const STORAGE_KEY = 'mysportia_lead_events';

function getSessionId(): string {
  const key = 'mysportia_session_id';
  let sid = sessionStorage.getItem(key);
  if (!sid) {
    sid = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem(key, sid);
  }
  return sid;
}

let debounceTimers: Record<string, number> = {};

export function trackLead(event: Omit<LeadEvent, 'at' | 'sessionId'>): void {
  const full: LeadEvent = {
    ...event,
    at: new Date().toISOString(),
    sessionId: getSessionId(),
  };

  try {
    const existing: LeadEvent[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    existing.push(full);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(-500)));
  } catch {
    // storage full/unavailable — still attempt delivery
  }

  // eslint-disable-next-line no-console
  console.info('[lead]', full.type, full.field ?? full.venueName ?? '', full);

  if (WEBHOOK_URL) {
    const body = JSON.stringify(full);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(WEBHOOK_URL, new Blob([body], { type: 'application/json' }));
    } else {
      fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => undefined);
    }
  }
}

// Debounced variant for keystroke-level fields so the CRM isn't flooded,
// while still capturing partial input (fires 600ms after typing pauses).
export function trackLeadDebounced(
  event: Omit<LeadEvent, 'at' | 'sessionId'>,
  key: string,
  delay = 600
): void {
  window.clearTimeout(debounceTimers[key]);
  debounceTimers[key] = window.setTimeout(() => {
    delete debounceTimers[key];
    trackLead(event);
  }, delay);
}
