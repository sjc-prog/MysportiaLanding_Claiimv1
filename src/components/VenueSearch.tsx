import { useEffect, useRef, useState } from 'react';
import { MapPin, Search, Plus } from 'lucide-react';
import { searchVenues, Venue } from '../data/venues';
import { trackLead, trackLeadDebounced } from '../lib/leads';

interface Props {
  onSelect: (venue: Venue | null) => void; // null = "add my venue" manual path
  autoFocus?: boolean;
}

export default function VenueSearch({ onSelect, autoFocus }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Venue[]>([]);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const matches = searchVenues(query);
    setResults(matches);
    setHighlight(0);
    setOpen(query.trim().length >= 2);
  }, [query]);

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
      trackLeadDebounced(
        { type: 'search_typed', field: 'venue_search', value },
        'venue_search'
      );
    }
  };

  const select = (venue: Venue) => {
    trackLead({ type: 'venue_selected', venueId: venue.id, venueName: venue.name });
    setOpen(false);
    onSelect(venue);
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
      setHighlight((h) => Math.min(h + 1, results.length)); // last index = "add manually" row
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlight < results.length) select(results[highlight]);
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
          Find my gym →
        </span>
      </div>

      {open && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-3xl bg-white text-left shadow-2xl shadow-ink-950/20 ring-1 ring-ink-950/5 animate-fade-up">
          {results.map((v, i) => (
            <button
              key={v.id}
              onClick={() => select(v)}
              onMouseEnter={() => setHighlight(i)}
              className={`flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors ${
                highlight === i ? 'bg-paper-3' : ''
              }`}
            >
              <MapPin className="h-4 w-4 shrink-0 text-punch" />
              <span>
                <span className="block font-bold text-ink-950">{v.name}</span>
                <span className="block text-sm text-ink-600">
                  {v.area} · {v.city}
                </span>
              </span>
              <span className="ml-auto shrink-0 rounded-full bg-[#FFF6DB] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-[#8a6200]">
                Unclaimed
              </span>
            </button>
          ))}
          <button
            onClick={addManually}
            onMouseEnter={() => setHighlight(results.length)}
            className={`flex w-full items-center gap-3 border-t border-ink-950/10 px-5 py-3.5 text-left transition-colors ${
              highlight === results.length ? 'bg-paper-3' : ''
            }`}
          >
            <Plus className="h-4 w-4 shrink-0 text-punch" />
            <span className="font-bold text-ink-950">
              {results.length === 0 ? `Can't find "${query}"?` : 'Not in the list?'}{' '}
              <span className="text-punch">Add your venue</span>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
