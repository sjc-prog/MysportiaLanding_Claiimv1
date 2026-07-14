import { Flame } from 'lucide-react';
import VenueSearch from './VenueSearch';
import { Venue } from '../data/venues';

interface Props {
  onVenueSelect: (venue: Venue | null) => void;
}

export default function Hero({ onVenueSelect }: Props) {
  return (
    <header className="relative overflow-hidden">
      {/* Cinematic backdrop: fighter image, dark wash, gold edge light */}
      <div className="absolute inset-0">
        <img
          src="/assets/hero-fighter.png"
          alt=""
          className="h-full w-full object-cover object-top opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/80 via-ink-950/70 to-ink-950" />
        <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-punch/20 blur-[120px]" />
        <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-gold/15 blur-[120px]" />
      </div>

      <div className="relative mx-auto flex min-h-[92svh] max-w-5xl flex-col px-5 pb-16 pt-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <img src="/assets/logo-mysportia.svg" alt="MySportia" className="h-7 brightness-0 invert" />
          <span className="hidden text-sm font-medium text-white/60 sm:block">
            Thailand's sports & activities marketplace
          </span>
        </div>

        {/* Campaign badge + headline */}
        <div className="mt-auto flex flex-col items-start gap-6 pt-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-gold">
            <Flame className="h-4 w-4" />
            The campaign is launching
          </span>

          <h1 className="font-display text-4xl font-extrabold leading-[1.05] sm:text-6xl">
            Muay Thai is going global.
            <br />
            <span className="text-gold">Is your gym on the map?</span>
          </h1>

          <p className="max-w-xl text-lg text-white/80">
            MySportia drives customers to Muay Thai gyms across Thailand — booking,
            payments, and a complete free system to run your gym.
          </p>

          {/* The claim moment */}
          <div className="w-full max-w-xl">
            <p className="mb-3 font-semibold text-white/90">
              Claim your venue — free. Start typing:
            </p>
            <VenueSearch onSelect={onVenueSelect} />
            <p className="mt-3 text-sm text-white/50">
              380+ Muay Thai gyms are already listed. Yours is probably one of them.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
