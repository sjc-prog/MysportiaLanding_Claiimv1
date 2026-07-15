import { useEffect, useState } from 'react';
import {
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  MapPin,
  QrCode,
  Search,
  Star,
} from 'lucide-react';

/**
 * iPhone frame with mock customer screens rotating every 3 seconds —
 * a customer discovering, booking, paying for, and managing a Muay Thai
 * session. Built in the brand design system (ink/pink/mint/yellow).
 */

function DiscoverScreen() {
  return (
    <div className="flex h-full flex-col bg-paper-2 p-3">
      <p className="font-display text-[15px] font-extrabold text-ink-950">Hello, Sporty! 👋</p>
      <div className="mt-2 flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-ink-950/10">
        <Search className="h-3.5 w-3.5 text-ink-600" />
        <span className="text-[11px] font-semibold text-ink-600">Muay Thai · near me</span>
      </div>
      <div className="mt-3 space-y-2">
        {[
          { n: 'Lamai Muay Thai Camp', a: 'Lamai · 1.2 km', r: '4.9' },
          { n: 'Superpro Samui', a: 'Chaweng · 4 km', r: '4.8' },
          { n: 'Wech Pinyo Gym', a: 'Lamai · 2 km', r: '4.7' },
        ].map((g, i) => (
          <div key={g.n} className="flex items-center gap-2 rounded-2xl bg-white p-2.5 shadow-sm">
            <span className={`flex h-8 w-8 items-center justify-center rounded-xl font-display text-[11px] font-extrabold text-white ${i === 0 ? 'bg-punch' : i === 1 ? 'bg-mint' : 'bg-gold'}`}>
              {g.n[0]}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[11px] font-extrabold text-ink-950">{g.n}</span>
              <span className="block text-[10px] text-ink-600">{g.a}</span>
            </span>
            <span className="flex items-center gap-0.5 text-[10px] font-extrabold text-ink-950">
              <Star className="h-2.5 w-2.5 fill-[#FFCB1F] text-[#FFCB1F]" /> {g.r}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-auto text-center text-[9px] font-bold text-ink-600/60">Find your gym in seconds</p>
    </div>
  );
}

function VenueScreen() {
  return (
    <div className="flex h-full flex-col bg-paper-2">
      <div className="relative h-24 shrink-0">
        <img src="/assets/hero-fighter.png" alt="" className="h-full w-full object-cover" />
        <span className="absolute left-2 top-2 rounded-full bg-mint px-2 py-0.5 text-[9px] font-extrabold text-white">
          LIVE
        </span>
      </div>
      <div className="flex-1 p-3">
        <p className="font-display text-[13px] font-extrabold text-ink-950">Lamai Muay Thai Camp</p>
        <p className="mt-0.5 flex items-center gap-1 text-[10px] text-ink-600">
          <MapPin className="h-2.5 w-2.5 text-punch" /> Lamai, Koh Samui · ⭐ 4.9
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {['Group classes', 'Privates', '10-passes', 'Monthly'].map((c) => (
            <span key={c} className="rounded-full bg-ink-950/5 px-2 py-0.5 text-[9px] font-bold text-ink-950">
              {c}
            </span>
          ))}
        </div>
        <div className="mt-3 space-y-1.5">
          <p className="text-[10px] font-extrabold uppercase tracking-wide text-ink-600">Trainers</p>
          <div className="flex items-center gap-2">
            <img src="/assets/trainer-boxer.png" alt="" className="h-7 w-7 rounded-full object-cover object-top" />
            <img src="/assets/trainer-female.png" alt="" className="h-7 w-7 rounded-full object-cover object-top" />
            <img src="/assets/trainer-kohfit.png" alt="" className="h-7 w-7 rounded-full object-cover object-top" />
            <span className="text-[10px] font-bold text-ink-600">Kru Anan +2</span>
          </div>
        </div>
      </div>
      <button className="m-3 rounded-full bg-punch py-2.5 text-[12px] font-extrabold text-white">
        Book now
      </button>
    </div>
  );
}

function ClassScreen() {
  return (
    <div className="flex h-full flex-col bg-paper-2 p-3">
      <p className="flex items-center gap-1.5 font-display text-[13px] font-extrabold text-ink-950">
        <CalendarDays className="h-3.5 w-3.5 text-punch" /> Tomorrow · pick a class
      </p>
      <div className="mt-3 space-y-2">
        {[
          { t: '07:00', n: 'Morning Muay Thai', left: '5 spots', hot: false },
          { t: '16:00', n: 'Pads & Clinch', left: '3 spots', hot: true },
          { t: '18:00', n: 'All levels', left: '8 spots', hot: false },
        ].map((c) => (
          <div
            key={c.t}
            className={`flex items-center gap-2 rounded-2xl p-2.5 ${
              c.hot ? 'bg-punch text-white shadow-md shadow-punch/30' : 'bg-white text-ink-950 shadow-sm'
            }`}
          >
            <span className="font-mono text-[11px] font-extrabold">{c.t}</span>
            <span className="flex-1 text-[11px] font-bold">{c.n}</span>
            <span className={`text-[9px] font-extrabold ${c.hot ? 'text-white/90' : 'text-mint'}`}>
              {c.left}
            </span>
            <ChevronRight className="h-3 w-3 opacity-60" />
          </div>
        ))}
      </div>
      <div className="mt-auto rounded-2xl bg-[#FFF6DB] p-2.5 text-center">
        <p className="text-[10px] font-extrabold text-[#8a6200]">
          450฿ drop-in · free cancel up to 4h before
        </p>
      </div>
    </div>
  );
}

function PayScreen() {
  return (
    <div className="flex h-full flex-col bg-paper-2 p-3">
      <p className="font-display text-[13px] font-extrabold text-ink-950">Checkout</p>
      <div className="mt-2 rounded-2xl bg-white p-3 shadow-sm">
        <p className="text-[11px] font-extrabold text-ink-950">Pads & Clinch · 16:00</p>
        <p className="text-[10px] text-ink-600">Lamai Muay Thai Camp · tomorrow</p>
        <p className="mt-1.5 font-display text-[15px] font-extrabold text-ink-950">450฿</p>
      </div>
      <div className="mt-3 space-y-1.5">
        <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow-sm ring-2 ring-punch">
          <span className="flex items-center gap-1.5 text-[11px] font-extrabold text-ink-950">
            <QrCode className="h-3.5 w-3.5 text-punch" /> Thai QR / PromptPay
          </span>
          <span className="h-3.5 w-3.5 rounded-full border-4 border-punch" />
        </div>
        <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow-sm">
          <span className="text-[11px] font-bold text-ink-600">💳 Card · Apple Pay</span>
          <span className="h-3.5 w-3.5 rounded-full border-2 border-ink-950/20" />
        </div>
      </div>
      <button className="mt-auto rounded-full bg-mint py-2.5 text-[12px] font-extrabold text-white">
        Pay 450฿
      </button>
    </div>
  );
}

function BookedScreen() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-paper-2 p-4 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-mint/15">
        <BadgeCheck className="h-8 w-8 text-mint" />
      </span>
      <p className="mt-3 font-display text-[15px] font-extrabold text-ink-950">You're booked!</p>
      <p className="mt-1 text-[10px] font-semibold text-ink-600">
        Pads & Clinch · tomorrow 16:00
        <br />
        Show this at the door:
      </p>
      <div className="mt-3 rounded-2xl bg-white p-3 shadow-sm">
        <QrCode className="h-16 w-16 text-ink-950" />
      </div>
      <div className="mt-3 flex gap-1.5">
        <span className="rounded-full bg-white px-2.5 py-1 text-[9px] font-extrabold text-ink-950 shadow-sm">
          Reschedule
        </span>
        <span className="rounded-full bg-white px-2.5 py-1 text-[9px] font-extrabold text-ink-950 shadow-sm">
          Cancel free
        </span>
        <span className="rounded-full bg-white px-2.5 py-1 text-[9px] font-extrabold text-ink-950 shadow-sm">
          History
        </span>
      </div>
    </div>
  );
}

const SCREENS = [
  { key: 'discover', el: <DiscoverScreen />, label: 'They find you' },
  { key: 'venue', el: <VenueScreen />, label: 'They see everything at your venue' },
  { key: 'class', el: <ClassScreen />, label: 'They pick a class' },
  { key: 'pay', el: <PayScreen />, label: 'They pay — card or Thai QR' },
  { key: 'booked', el: <BookedScreen />, label: 'Booked, managed, no calls to you' },
];

export default function CustomerPhone() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => setI((v) => (v + 1) % SCREENS.length), 3000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* iPhone frame */}
      <div className="relative h-[560px] w-[270px] rounded-[44px] bg-ink-950 p-[10px] shadow-2xl shadow-ink-950/30">
        {/* Dynamic island */}
        <div className="absolute left-1/2 top-[18px] z-10 h-[22px] w-[84px] -translate-x-1/2 rounded-full bg-ink-950" />
        <div className="h-full w-full overflow-hidden rounded-[34px] bg-paper-2">
          <div key={SCREENS[i].key} className="h-full pt-10 animate-fade-up">
            {SCREENS[i].el}
          </div>
        </div>
      </div>
      {/* Caption + dots */}
      <p className="mt-4 font-display text-sm font-extrabold text-ink-950">{SCREENS[i].label}</p>
      <div className="mt-2 flex gap-1.5">
        {SCREENS.map((s, idx) => (
          <button
            key={s.key}
            onClick={() => setI(idx)}
            aria-label={s.label}
            className={`h-1.5 rounded-full transition-all ${
              idx === i ? 'w-6 bg-punch' : 'w-1.5 bg-ink-950/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
