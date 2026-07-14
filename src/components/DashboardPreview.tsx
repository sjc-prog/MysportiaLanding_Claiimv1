import { CalendarDays, CreditCard, PhoneCall, Sparkles, Users } from 'lucide-react';
import { FunnelData } from './Funnel';
import { trackLead } from '../lib/leads';

interface Props {
  data: FunnelData;
  onCreateAccount: () => void;
}

const MOCK_CLASSES = [
  { time: '07:00', name: 'Morning Muay Thai — All levels', booked: 9, cap: 14 },
  { time: '10:00', name: 'Beginner Fundamentals', booked: 6, cap: 10 },
  { time: '16:00', name: 'Clinch & Pads', booked: 11, cap: 14 },
  { time: '18:00', name: 'Fighter Sparring (invite)', booked: 7, cap: 8 },
];

const MOCK_TRAINERS = [
  { img: '/assets/trainer-boxer.png', name: 'Kru Anan', tag: 'Head trainer' },
  { img: '/assets/trainer-female.png', name: 'Kru Fon', tag: 'Beginners & clinch' },
  { img: '/assets/trainer-kohfit.png', name: 'Coach Mike', tag: 'S&C / fight prep' },
];

export default function DashboardPreview({ data, onCreateAccount }: Props) {
  const gymName = data.venueName || 'Your Gym';

  return (
    <div className="mx-auto max-w-3xl px-5 pb-28 pt-8">
      <div className="mb-6 flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-sm font-bold text-gold w-fit">
        <Sparkles className="h-4 w-4" />
        PREVIEW — this is what your back office looks like
      </div>

      <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
        {gymName}, <span className="text-gold">running on autopilot.</span>
      </h2>
      <p className="mt-2 max-w-xl text-white/60">
        A demo of the free system every MySportia venue gets — filled with sample data
        so you can see your gym in it. Powered by Exsportia.
      </p>

      {/* Mock dashboard card */}
      <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-ink-800 shadow-2xl shadow-black/40">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold font-display font-extrabold text-ink-950">
              {gymName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold leading-tight">{gymName}</p>
              <p className="text-xs text-white/40">
                {[data.area, data.city].filter(Boolean).join(' · ') || 'Thailand'}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-brand-green/20 px-3 py-1 text-xs font-bold text-brand-green">
            LIVE (demo)
          </span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 divide-x divide-white/10 border-b border-white/10 text-center">
          <div className="px-2 py-4">
            <p className="font-display text-xl font-extrabold text-gold sm:text-2xl">33</p>
            <p className="text-xs text-white/50">bookings this week</p>
          </div>
          <div className="px-2 py-4">
            <p className="font-display text-xl font-extrabold text-gold sm:text-2xl">18,400฿</p>
            <p className="text-xs text-white/50">paid online this week</p>
          </div>
          <div className="px-2 py-4">
            <p className="font-display text-xl font-extrabold text-gold sm:text-2xl">12</p>
            <p className="text-xs text-white/50">active members</p>
          </div>
        </div>

        {/* Today's classes */}
        <div className="px-5 py-4">
          <p className="mb-3 flex items-center gap-2 text-sm font-bold text-white/70">
            <CalendarDays className="h-4 w-4 text-gold" /> Today's classes
          </p>
          <div className="space-y-2">
            {MOCK_CLASSES.map((c) => (
              <div
                key={c.time}
                className="flex items-center gap-3 rounded-xl bg-ink-700/60 px-4 py-3"
              >
                <span className="font-mono text-sm font-bold text-gold">{c.time}</span>
                <span className="flex-1 truncate text-sm font-medium">{c.name}</span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                    c.booked / c.cap > 0.8
                      ? 'bg-punch/20 text-punch'
                      : 'bg-brand-green/20 text-brand-green'
                  }`}
                >
                  {c.booked}/{c.cap}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Trainers */}
        <div className="border-t border-white/10 px-5 py-4">
          <p className="mb-3 flex items-center gap-2 text-sm font-bold text-white/70">
            <Users className="h-4 w-4 text-gold" /> Trainers
          </p>
          <div className="flex gap-4 overflow-x-auto pb-1">
            {MOCK_TRAINERS.map((t) => (
              <div key={t.name} className="flex shrink-0 items-center gap-2.5">
                <img
                  src={t.img}
                  alt={t.name}
                  className="h-10 w-10 rounded-full object-cover object-top"
                />
                <div>
                  <p className="text-sm font-bold leading-tight">{t.name}</p>
                  <p className="text-xs text-white/40">{t.tag}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payments strip */}
        <div className="flex items-center gap-2 border-t border-white/10 bg-ink-900/60 px-5 py-3 text-xs text-white/40">
          <CreditCard className="h-4 w-4 text-brand-green" />
          Card & Thai QR payments on — payouts weekly · powered by Exsportia
        </div>
      </div>

      {/* CTAs */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => {
            trackLead({ type: 'account_started', venueName: data.venueName });
            onCreateAccount();
          }}
          className="flex-1 rounded-full bg-gold px-6 py-4 text-center font-bold text-ink-950 shadow-lg shadow-gold/25 transition-transform hover:scale-[1.02]"
        >
          Make this real — create my account
        </button>
        <button
          onClick={() => trackLead({ type: 'call_requested', field: 'setup_call', venueName: data.venueName })}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-4 font-bold text-white hover:bg-white/5"
        >
          <PhoneCall className="h-5 w-5" /> Book my setup call
        </button>
      </div>
      <p className="mt-4 text-center text-sm text-white/40">
        We verify every claim by hand — a real person confirms you represent {gymName}.
      </p>
    </div>
  );
}
