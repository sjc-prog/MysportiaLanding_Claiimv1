import { useState } from 'react';
import Hero from './components/Hero';
import Funnel, { FunnelData } from './components/Funnel';
import ProfilePreview from './components/ProfilePreview';
import DashboardPreview from './components/DashboardPreview';
import TalkToUs from './components/TalkToUs';
import {
  CustomerSection,
  DanSection,
  FAQ,
  FilmSection,
  Footer,
  HowItWorks,
  MarketplaceSection,
  ScreensShowcase,
  TheDeal,
  ThailandSection,
  TrustNumbers,
  VmsSection,
} from './components/Sections';
import { ClaimSearchResult, ClaimSeed, VenueClaimedError } from './claim/types';
import { toVenueSummary, VenueSummary } from './claim/viewModels';
import { getClaimClient } from './api/claimClient';
import { trackLead } from './lib/leads';

type View =
  | { name: 'landing' }
  | { name: 'seed-loading'; result: ClaimSearchResult }
  | { name: 'seed-error'; result: ClaimSearchResult; claimed: boolean }
  | { name: 'funnel'; venue: VenueSummary | null }
  | { name: 'profile'; data: FunnelData }
  | { name: 'dashboard'; data: FunnelData }
  | { name: 'done'; data: FunnelData };

export default function App() {
  const [view, setView] = useState<View>({ name: 'landing' });
  // Prepared claim seed for the selected venue. Loaded in Phase 2, consumed
  // by the funnel/preview personalization in later phases.
  const [, setClaimSeed] = useState<ClaimSeed | null>(null);

  // Phase 2 scope: claimed rows never reach here (disabled in VenueSearch).
  // Unclaimed selection loads the prepared seed via the secure BFF, then
  // opens the funnel. Manual add (null) opens the funnel blank.
  const handleVenueSelect = (result: ClaimSearchResult | null) => {
    if (!result) {
      setClaimSeed(null);
      setView({ name: 'funnel', venue: null });
      window.scrollTo(0, 0);
      return;
    }
    loadSeed(result);
  };

  const loadSeed = (result: ClaimSearchResult) => {
    setView({ name: 'seed-loading', result });
    window.scrollTo(0, 0);
    getClaimClient()
      .getSeed(result.listingId)
      .then((seed) => {
        setClaimSeed(seed);
        trackLead({ type: 'venue_selected', field: 'seed_loaded', venueName: result.name });
        setView({ name: 'funnel', venue: toVenueSummary(result) });
      })
      .catch((err: unknown) => {
        setClaimSeed(null);
        setView({ name: 'seed-error', result, claimed: err instanceof VenueClaimedError });
      });
  };

  if (view.name === 'seed-loading') {
    return (
      <div className="mx-auto flex min-h-[100svh] max-w-lg flex-col items-center justify-center px-5 text-center">
        <img src="/assets/logo-sign.svg" alt="" className="h-14 animate-pulse" />
        <p className="mt-6 font-display text-xl font-extrabold">
          Getting {view.result.name} ready…
        </p>
        <p className="mt-2 text-ink-600">Loading everything we already know about your venue.</p>
      </div>
    );
  }

  if (view.name === 'seed-error') {
    return (
      <div className="mx-auto flex min-h-[100svh] max-w-lg flex-col items-center justify-center px-5 text-center">
        <p className="font-display text-2xl font-extrabold">
          {view.claimed ? 'This venue has already been claimed.' : "We couldn't load your venue data."}
        </p>
        <p className="mt-3 text-ink-600">
          {view.claimed
            ? 'If this is your venue, our team can help — use "Talk to us" below.'
            : 'This is usually temporary. You can retry, or continue and fill in the details yourself.'}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {!view.claimed && (
            <button
              onClick={() => loadSeed(view.result)}
              className="rounded-full bg-punch px-8 py-3.5 font-extrabold text-white shadow-lg shadow-punch/25"
            >
              Retry
            </button>
          )}
          {!view.claimed && (
            <button
              onClick={() => {
                setView({ name: 'funnel', venue: toVenueSummary(view.result) });
                window.scrollTo(0, 0);
              }}
              className="rounded-full bg-white px-8 py-3.5 font-bold text-ink-950 shadow-sm ring-1 ring-ink-950/10"
            >
              Continue anyway
            </button>
          )}
          <button
            onClick={() => setView({ name: 'landing' })}
            className="rounded-full bg-white px-8 py-3.5 font-bold text-ink-950 shadow-sm ring-1 ring-ink-950/10"
          >
            Back to search
          </button>
        </div>
        <TalkToUs />
      </div>
    );
  }

  if (view.name === 'funnel') {
    return (
      <>
        <Funnel
          venue={view.venue}
          onFinish={(data) => {
            setView({ name: 'profile', data });
            window.scrollTo(0, 0);
          }}
        />
        <TalkToUs funnelStep={1} />
      </>
    );
  }

  if (view.name === 'profile') {
    return (
      <>
        <ProfilePreview
          data={view.data}
          onContinue={() => {
            setView({ name: 'dashboard', data: view.data });
            window.scrollTo(0, 0);
          }}
        />
        <TalkToUs />
      </>
    );
  }

  if (view.name === 'dashboard' || view.name === 'done') {
    return (
      <>
        {view.name === 'dashboard' ? (
          <DashboardPreview
            data={view.data}
            onCreateAccount={() => setView({ name: 'done', data: view.data })}
          />
        ) : (
          <FinalStep data={view.data} />
        )}
        <TalkToUs />
      </>
    );
  }

  return (
    <>
      <Hero onVenueSelect={handleVenueSelect} />
      <TrustNumbers />
      <FilmSection />
      <CustomerSection />
      <VmsSection />
      <ScreensShowcase />
      <MarketplaceSection />
      <DanSection />
      <HowItWorks />
      <TheDeal />
      <ThailandSection />
      <FAQ />
      <Footer />
      <TalkToUs />
    </>
  );
}

function FinalStep({ data }: { data: FunnelData }) {
  return (
    <div className="mx-auto flex min-h-[100svh] max-w-lg flex-col items-center justify-center px-5 text-center">
      <img src="/assets/logo-sign.svg" alt="" className="h-16" />
      <h1 className="mt-8 font-display text-3xl font-extrabold sm:text-4xl">
        {data.venueName || 'Your gym'} is claimed. 🥊
      </h1>
      <p className="mt-4 text-lg text-ink-600">
        A real person will confirm your claim and finish your setup with you.
        Fastest way to go live: grab a call slot now.
      </p>
      <p className="mt-8 text-sm font-semibold text-ink-600/70">
        Check your phone — we've sent a confirmation to the contact you provided.
      </p>
    </div>
  );
}
