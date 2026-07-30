import { useEffect, useRef, useState } from 'react';
import { CloudOff, Loader2, MapPin, Search, Plus } from 'lucide-react';
import { ClaimSearchResult } from '../claim/types';
import { CampaignId } from '../claim/campaigns';
import { nextEnabledIndex, toSearchRow } from '../claim/viewModels';
import { getClaimClient } from '../api/claimClient';
import { trackLead, trackLeadDebounced } from '../lib/leads';

interface Props {
  /** Receives the selected search result, or null for the manual add path. */
  onSelect: (result: ClaimSearchResult | null) => void;
  campaign?: CampaignId;
  autoFocus?: boolean;
}

type SearchState = 'idle' | 'loading' | 'ready' | 'unavailable';

const SEARCH_DEBOUNCE_MS = 350;

export default function VenueSearch({ onSelect, campaign = 'all', autoFocus }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ClaimSearchResult[]>([]);
  const [state, setState] = useState<SearchState>('idle');
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  /** listingId of a claimed row the user tried to select (non-blocking note). */
  const [claimedNoteFor, setClaimedNoteFor] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const q = query.trim();
    abortRef.current?.abort();
    if (q.length < 2) return;
    const controller = new AbortController();
    abortRef.current = controller;
    const timer = window.setTimeout(() => {
      getClaimClient()
        .search(q, { campaign, signal: controller.signal })
        .then((rows) => {
          if (controller.signal.aborted) return;
          setResults(rows);
          setHighlight(0);
          setState('ready');
        })
        .catch(() => {
          if (controller.signal.aborted) return;
          setResults([]);
          // No mock fallback by policy: any failure shows the clear
          // temporary-unavailable state; the manual add path stays open.
          setState('unavailable');
        });
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, campaign]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    if (value.trim().length >= 2) {
      // Loading state is set here (event handler) so the effect only owns
      // the debounced async fetch; results arrive via the promise callbacks.
      setState('loading');
      setOpen(true);
      trackLeadDebounced(
        { type: 'search_typed', field: 'venue_search', value },
        'venue_search'
      );
    } else {
      setResults([]);
      setState('idle');
      setOpen(false);
    }
  };

  const select = (result: ClaimSearchResult) => {
    if (result.action === 'NONE') {
      // Claimed: disabled — surface the non-blocking note, never navigate.
      setClaimedNoteFor(result.listingId);
      trackLead({ type: 'venue_selected', field: 'claimed_disabled', venueName: result.name });
      return;
    }
    trackLead({ type: 'venue_selected', venueId: result.listingId, venueName: result.name });
    setOpen(false);
    onSelect(result);
  };

  const addManually = () => {
    trackLead({ type: 'venue_not_found', field: 'venue_search', value: query });
    setOpen(false);
    onSelect(null);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => nextEnabledIndex(results, h, 1)); // skips disabled claimed rows
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => nextEnabledIndex(results, h, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (state === 'ready' && highlight < results.length) select(results[highlight]);
      else addManually();
    }
  };

  return (
    <div ref={boxRef} className="relative w-full max-w-xl">
      <div className="flex items-center gap-3 rounded-full bg-white py-2 pl-6 pr-2 shadow-xl shadow-ink-950/10 ring-1 ring-ink-950/5 pulse-gold">
        <Search className="h-5 w-5 shrink-0 text-ink-600" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => query.trim().length >= 2 && setOpen(true)}
          placeholder="Type your gym's name…"
          autoFocus={autoFocus}
          className="w-full bg-transparent py-2.5 text-base font-medium text-ink-950 placeholder:text-ink-600/60 focus:outline-none"
          aria-label="Search for your gym"
        />
        <span className="hidden shrink-0 rounded-full bg-punch px-5 py-3 text-sm font-extrabold text-white sm:block">
          Claim my gym →
        </span>
      </div>

      {open && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-3xl bg-white text-left shadow-2xl shadow-ink-950/20 ring-1 ring-ink-950/5 animate-fade-up">
          {state === 'loading' && (
            <div className="flex items-center gap-3 px-5 py-4 text-ink-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm font-semibold">Searching venues…</span>
            </div>
          )}

          {state === 'unavailable' && (
            <div className="flex items-center gap-3 px-5 py-4 text-ink-600">
              <CloudOff className="h-4 w-4 shrink-0 text-punch" />
              <span className="text-sm font-semibold">
                Venue search is temporarily unavailable — you can still add your venue below.
              </span>
            </div>
          )}

          {state === 'ready' &&
            results.map((r, i) => {
              const row = toSearchRow(r);
              return (
                <div key={row.key}>
                  {/* Claimed rows: aria-disabled (not native disabled) so the
                      attempted click can surface the non-blocking note; the
                      guarded select() never opens anything for them. */}
                  <button
                    onClick={() => select(r)}
                    onMouseEnter={() => !row.disabled && setHighlight(i)}
                    aria-disabled={row.disabled}
                    className={`flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors ${
                      highlight === i && !row.disabled ? 'bg-paper-3' : ''
                    } ${row.disabled ? 'cursor-not-allowed opacity-60' : ''}`}
                  >
                    <MapPin className="h-4 w-4 shrink-0 text-punch" />
                    <span>
                      <span className="block font-bold text-ink-950">{row.name}</span>
                      {row.locationLine && (
                        <span className="block text-sm text-ink-600">{row.locationLine}</span>
                      )}
                    </span>
                    {row.claimStatus === 'CLAIMED' ? (
                      <span className="ml-auto shrink-0 rounded-full bg-mint/15 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-[#0e7a44]">
                        Claimed
                      </span>
                    ) : (
                      <span className="ml-auto shrink-0 rounded-full bg-[#FFF6DB] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-[#8a6200]">
                        Unclaimed
                      </span>
                    )}
                  </button>
                  {claimedNoteFor === row.key && (
                    <p className="px-5 pb-2.5 text-xs font-semibold text-ink-600">
                      This venue has already been claimed.
                    </p>
                  )}
                </div>
              );
            })}

          <button
            onClick={addManually}
            onMouseEnter={() => setHighlight(results.length)}
            className={`flex w-full items-center gap-3 border-t border-ink-950/10 px-5 py-3.5 text-left transition-colors ${
              highlight === results.length ? 'bg-paper-3' : ''
            }`}
          >
            <Plus className="h-4 w-4 shrink-0 text-punch" />
            <span className="font-bold text-ink-950">
              {state === 'ready' && results.length > 0 ? 'Not in the list?' : `Can't find "${query}"?`}{' '}
              <span className="text-punch">Add your venue</span>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
