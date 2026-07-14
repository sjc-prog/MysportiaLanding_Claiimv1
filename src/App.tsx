import { useState } from 'react';
import Hero from './components/Hero';
import Funnel, { FunnelData } from './components/Funnel';
import DashboardPreview from './components/DashboardPreview';
import TalkToUs from './components/TalkToUs';
import { FAQ, Footer, HowItWorks, TheDeal, TrustNumbers } from './components/Sections';
import { Venue } from './data/venues';

type View =
  | { name: 'landing' }
  | { name: 'funnel'; venue: Venue | null }
  | { name: 'dashboard'; data: FunnelData }
  | { name: 'done'; data: FunnelData };

export default function App() {
  const [view, setView] = useState<View>({ name: 'landing' });

  if (view.name === 'funnel') {
    return (
      <>
        <Funnel
          venue={view.venue}
          onFinish={(data) => {
            setView({ name: 'dashboard', data });
            window.scrollTo(0, 0);
          }}
        />
        <TalkToUs funnelStep={1} />
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
      <Hero
        onVenueSelect={(venue) => {
          setView({ name: 'funnel', venue });
          window.scrollTo(0, 0);
        }}
      />
      <TrustNumbers />
      <HowItWorks />
      <TheDeal />
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
      <p className="mt-4 text-lg text-white/70">
        A real person will confirm your claim and finish your setup with you.
        Fastest way to go live: grab a call slot now.
      </p>
      <p className="mt-8 text-sm text-white/40">
        Check your phone — we've sent a confirmation to the contact you provided.
      </p>
    </div>
  );
}
