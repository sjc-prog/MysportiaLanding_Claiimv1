import { CheckCircle2 } from 'lucide-react';
import VenueSearch from './VenueSearch';
import { Venue } from '../data/venues';

interface Props {
  onVenueSelect: (venue: Venue | null) => void;
}

/**
 * Hero per Justin's walkthrough (2026-07-15): undisturbed and centered —
 * the message + the claim box only. Below them, the marketplace on real
 * devices over the map (Group 4844). Video moved below the numbers band.
 * Brand-book palette: ink navy, pink, mint, yellow.
 */
export default function Hero({ onVenueSelect }: Props) {
  return (
    <header className="relative overflow-hidden bg-ink-950">
      {/* Brand backdrop: icon-pattern texture + pink/mint glows */}
      <div className="absolute inset-0">
        <img
          src="/assets/brand/dots.png"
          alt=""
          className="absolute left-0 top-0 w-[640px] max-w-none opacity-[0.18]"
        />
        <img
          src="/assets/brand/dots.png"
          alt=""
          className="absolute -right-24 bottom-32 w-[520px] max-w-none rotate-180 opacity-[0.12]"
        />
        <div className="absolute -left-40 top-1/4 h-[420px] w-[420px] rounded-full bg-punch/25 blur-[130px]" />
        <div className="absolute right-0 top-0 h-[380px] w-[380px] rounded-full bg-mint/15 blur-[130px]" />
        <div className="absolute bottom-40 left-1/3 h-[300px] w-[300px] rounded-full bg-gold/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 pb-10 pt-5">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <img src="/assets/brand/logo-on-black.png" alt="MySportia" className="h-8 sm:h-9" />
          <span className="hidden text-sm font-medium text-white/60 md:block">
            Thailand's sports & activities marketplace
          </span>
        </div>

        {/* Centered message + claim box */}
        <div className="mx-auto mt-14 flex max-w-3xl flex-col items-center text-center lg:mt-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-mint/40 bg-mint/10 px-4 py-1.5 text-sm font-bold text-mint-light">
            <CheckCircle2 className="h-4 w-4" />
            Thailand's number one Muay Thai marketplace — launching soon
          </span>

          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl xl:text-6xl">
            Confirm your
            <span className="text-gold"> Muay Thai gym.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">
            Your Muay Thai gym, accessible to millions of global customers.
            <span className="text-white/60">
              {' '}
              MySportia drives customers to Muay Thai gyms and training centres across Thailand.
            </span>
          </p>

          <div className="mt-8 flex w-full max-w-xl flex-col items-center">
            <p className="mb-3 font-semibold text-white/90">
              Claim your venue now — find your gym:
            </p>
            <VenueSearch onSelect={onVenueSelect} />
            <p className="mt-3 text-sm text-white/50">
              400+ Muay Thai gyms already listed · free to claim · 2 minutes on your phone
            </p>
          </div>
        </div>

        {/* The marketplace, in function: devices over the map */}
        <div className="relative mx-auto mt-12 max-w-5xl">
          <img
            src="/assets/brand/devices-map.png"
            alt="MySportia marketplace on desktop, tablet and phone — map search, venue profile, bookings"
            className="w-full"
          />
        </div>
      </div>
    </header>
  );
}
