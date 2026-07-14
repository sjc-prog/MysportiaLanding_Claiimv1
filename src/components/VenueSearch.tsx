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
      <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-2xl shadow-black/40 ring-2 ring-gold/70 pulse-gold">
        <Search className="h-5 w-5 shrink-0 text-ink-600" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => query.trim().length >= 2 && setOpen(true)}
          placeholder="Find your gym… e.g. Tiger Muay Thai"
          autoFocus={autoFocus}
          className="w-full bg-transparent text-base font-medium text-ink-900 placeholder:text-ink-600/60 focus:outline-none"
          aria-label="Search for your gym"
        />
      </div>

      {open && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/50 animate-fade-up">
          {results.map((v, i) => (
            <button
              key={v.id}
              onClick={() => select(v)}
              onMouseEnter={() => setHighlight(i)}
              className={`flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors ${
                highlight === i ? 'bg-gold/15' : ''
              }`}
            >
              <MapPin className="h-4 w-4 shrink-0 text-punch" />
              <span>
                <span className="block font-semibold text-ink-900">{v.name}</span>
                <span className="block text-sm text-ink-600">
                  {v.area} · {v.city}
                </span>
              </span>
              <span className="ml-auto shrink-0 rounded-full bg-gold/20 px-2.5 py-1 text-xs font-bold text-gold-dark">
                On MySportia
              </span>
            </button>
          ))}
          <button
            onClick={addManually}
            onMouseEnter={() => setHighlight(results.length)}
            className={`flex w-full items-center gap-3 border-t border-ink-900/10 px-5 py-3.5 text-left transition-colors ${
              highlight === results.length ? 'bg-gold/15' : ''
            }`}
          >
            <Plus className="h-4 w-4 shrink-0 text-brand-blue" />
            <span className="font-semibold text-ink-900">
              {results.length === 0 ? `Can't find "${query}"?` : 'Not in the list?'}{' '}
              <span className="text-brand-blue">Add your venue</span>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
