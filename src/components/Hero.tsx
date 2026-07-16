import { CheckCircle2 } from 'lucide-react';
import VenueSearch from './VenueSearch';
import { Venue } from '../data/venues';

interface Props {
  onVenueSelect: (venue: Venue | null) => void;
}

/**
 * Light hero in the marketplace-web-v3 design language: sky→peach wash,
 * huge ink display type with one pink line, white sticky nav with boxed
 * logo, white pill search, devices-on-map beneath. Structure per Justin's
 * walkthrough: message + claim box centered, video lives below the numbers.
 */
export default function Hero({ onVenueSelect }: Props) {
  return (
    <header className="hero-wash relative overflow-hidden">
      {/* Soft brand blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[12%] top-40 h-10 w-10 rounded-full bg-mint/70" />
        <div className="absolute -left-16 bottom-24 h-48 w-48 rounded-full bg-punch/15" />
        <div className="absolute right-[-60px] bottom-[30%] h-40 w-40 rounded-full bg-gold/25" />
      </div>

      {/* Sticky-style top bar */}
      <div className="relative border-b border-ink-950/5 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5">
          <span className="rounded-lg border-2 border-ink-950 bg-white px-2.5 py-1.5">
            <img src="/assets/brand/logo-on-white.png" alt="MySportia" className="h-6" />
          </span>
          <span className="hidden text-sm font-semibold text-ink-600 md:block">
            Thailand's sports &amp; activities marketplace
          </span>
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-5 pb-10 pt-12 lg:pt-16">
        {/* Centered message + claim box */}
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-ink-950 shadow-md shadow-ink-950/5">
            <span className="h-2.5 w-2.5 rounded-full bg-mint" />
            400+ gyms already listed — all of Thailand is going on the map
          </span>

          <h1 className="mt-7 font-display text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-5xl xl:text-6xl">
            Thailand's biggest Muay Thai marketplace is launching.
            <br />
            <span className="text-punch">Claim your listing now.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-600">
            Your Muay Thai gym, accessible to millions of global customers. MySportia
            drives customers to Muay Thai gyms and training centres across Thailand.
          </p>

          <div className="mt-9 flex w-full max-w-xl flex-col items-center">
            <VenueSearch onSelect={onVenueSelect} />
            <p className="mt-3 flex flex-wrap items-center justify-center gap-x-2 text-sm font-semibold text-ink-600">
              <CheckCircle2 className="h-4 w-4 text-mint" />
              Free to claim · 2 minutes on your phone
            </p>
          </div>
        </div>

        {/* The marketplace, in function: devices over the map */}
        <div className="relative mx-auto mt-14 max-w-5xl">
          <img
            src="/assets/brand/devices-map.png"
            alt="MySportia marketplace on desktop, tablet and phone — map search, venue profile, bookings"
            className="w-full rounded-3xl"
          />
        </div>
      </div>
    </header>
  );
}
