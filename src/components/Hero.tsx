import { CheckCircle2, Play } from 'lucide-react';
import ScrollVideo from './ScrollVideo';
import VenueSearch from './VenueSearch';
import { Venue } from '../data/venues';

interface Props {
  onVenueSelect: (venue: Venue | null) => void;
}

/**
 * Home v1 (Justin's notes 2026-07-14): correct logo top-left, navy brand
 * backdrop instead of the photo, "confirm your gym" headline set, claim
 * search left, product video right. Assets from Branding/Assets +
 * "Email images and assets" (logo-on-black, dots, product-tour video).
 */
export default function Hero({ onVenueSelect }: Props) {
  return (
    <header className="relative overflow-hidden bg-[#0A0F24]">
      {/* Brand backdrop: navy, dot texture, brand-color glows */}
      <div className="absolute inset-0">
        <img
          src="/assets/brand/dots.png"
          alt=""
          className="absolute left-0 top-0 w-[640px] max-w-none opacity-[0.22]"
        />
        <img
          src="/assets/brand/dots.png"
          alt=""
          className="absolute -right-24 bottom-0 w-[520px] max-w-none rotate-180 opacity-[0.15]"
        />
        <div className="absolute -left-40 top-1/4 h-[420px] w-[420px] rounded-full bg-punch/25 blur-[130px]" />
        <div className="absolute right-0 top-0 h-[380px] w-[380px] rounded-full bg-[#16C25C]/15 blur-[130px]" />
        <div className="absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-[#FBBB17]/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-5">
        {/* Top bar — the correct lockup */}
        <div className="flex items-center justify-between">
          <img src="/assets/brand/logo-on-black.png" alt="MySportia" className="h-8 sm:h-9" />
          <span className="hidden text-sm font-medium text-white/60 md:block">
            Thailand's sports & activities marketplace
          </span>
        </div>

        <div className="mt-12 grid items-center gap-10 lg:mt-16 lg:grid-cols-2">
          {/* Left: the message + the claim search */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#16C25C]/40 bg-[#16C25C]/10 px-4 py-1.5 text-sm font-bold text-[#3ddc82]">
              <CheckCircle2 className="h-4 w-4" />
              400+ Muay Thai gyms already listed — make sure yours is one of them
            </span>

            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl xl:text-6xl">
              Confirm your
              <br />
              <span className="text-gold">Muay Thai gym.</span>
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
              Your Muay Thai gym, accessible to millions of global customers.
              <span className="text-white/60">
                {' '}
                MySportia drives customers to Muay Thai gyms and training centres across
                Thailand.
              </span>
            </p>

            <div className="mt-8">
              <p className="mb-3 font-semibold text-white/90">
                Claim your venue now — find your gym:
              </p>
              <VenueSearch onSelect={onVenueSelect} />
              <p className="mt-3 text-sm text-white/50">
                Free to claim · takes 2 minutes on your phone
              </p>
            </div>
          </div>

          {/* Right: the hype video (autoplays muted — browser rule; sound button unmutes) */}
          <div className="relative">
            <ScrollVideo
              src="/assets/brand/hype-hero.mp4"
              className="aspect-[4/3] border border-white/10 bg-ink-800 shadow-2xl shadow-black/50"
            />
            <div className="pointer-events-none absolute inset-x-0 -bottom-3 flex justify-center">
              <span className="flex items-center gap-2 rounded-full bg-ink-950/90 px-4 py-2 text-xs font-bold text-white/80 backdrop-blur">
                <Play className="h-3.5 w-3.5 text-gold" />
                This is MySportia — tap for sound
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
