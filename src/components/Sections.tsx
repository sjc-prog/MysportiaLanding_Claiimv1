import { useEffect, useRef, useState } from 'react';
import {
  BadgeCheck,
  CalendarDays,
  ChevronDown,
  CreditCard,
  QrCode,
  ScanLine,
  Search,
  Smartphone,
  Store,
  Rocket,
  Users,
} from 'lucide-react';
import ScrollVideo from './ScrollVideo';
import CustomerPhone from './CustomerPhone';

/* ————— Design system (mysportia-marketplace-web-v3): light sections on
   paper/peach washes, dark ink bands for proof moments, white cards,
   pink primary / mint live / yellow highlight accents. ————— */

/* ---------- Trust numbers — dark proof band, animated ---------- */

const NUMBERS = [
  { value: 162, suffix: 'M฿', label: 'processed through the platform' },
  { value: 34, suffix: '', label: 'venues already live' },
  { value: 105000, suffix: '+', label: 'transactions handled' },
  { value: 32000, suffix: '+', label: 'players on the platform' },
  { value: 94, suffix: '%', label: 'growth year on year' },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [val, setVal] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        const t0 = performance.now();
        const dur = 1600;
        const tick = (t: number) => {
          const p = Math.min((t - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(target * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        // Guarantee the final value even if rAF is throttled.
        window.setTimeout(() => setVal(target), dur + 200);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return (
    <p ref={ref} className="font-display text-4xl font-extrabold text-white sm:text-5xl">
      {val.toLocaleString('en-US')}
      <span className="text-punch">{suffix}</span>
    </p>
  );
}

export function TrustNumbers() {
  return (
    <section className="bg-ink-950 py-16">
      <div className="mx-auto max-w-5xl px-5 text-center">
        <p className="mb-10 text-xs font-extrabold uppercase tracking-[0.2em] text-white/50">
          The platform behind the campaign
        </p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-5">
          {NUMBERS.map((n) => (
            <div key={n.label}>
              <CountUp target={n.value} suffix={n.suffix} />
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-white/50">
                {n.label}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-12 font-display text-xl font-extrabold text-white/70 sm:text-2xl">
          One search. One tap.{' '}
          <span className="text-punch">One button between customers and your gym.</span>
        </p>
      </div>
    </section>
  );
}

/* ---------- The film — moved from the hero to below the numbers ---------- */

export function FilmSection() {
  return (
    <section className="mx-auto max-w-5xl px-5 pt-16 sm:pt-24">
      <ScrollVideo
        src="/assets/brand/hype-hero.mp4"
        autoSound
        className="aspect-video shadow-2xl shadow-ink-950/20 ring-1 ring-ink-950/5"
      />
      <p className="mt-4 text-center text-sm font-semibold text-ink-600">
        This is MySportia — sound comes on as you scroll to it.
      </p>
    </section>
  );
}

/* ---------- MySportia, for your customers (end-customer experience ONLY) ---------- */

const CUSTOMER_CAN = [
  'Book classes, privates, and sessions at your venue — instantly',
  'Buy subscriptions, class passes, and memberships online',
  'See everything about your venue: times, classes, trainers, prices',
  'Manage their own bookings — reschedule or cancel, with cancellation protection',
  'Pay how they like — card, Apple Pay, Thai QR — and see all payment history',
];

export function CustomerSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-punch">
            MySportia · for your customers
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Everything your customer needs,
            <span className="text-punch"> at their fingertips.</span>
          </h2>
          <p className="mt-4 text-lg text-ink-600">
            Your customers do everything themselves — without disturbing you.
          </p>
          <ul className="mt-6 space-y-3.5">
            {CUSTOMER_CAN.map((li) => (
              <li key={li} className="flex items-start gap-3 text-ink-950/85">
                <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-mint" />
                {li}
              </li>
            ))}
          </ul>
          <p className="mt-6 rounded-2xl bg-[#FFF6DB] px-4 py-3 text-sm font-bold text-[#8a6200]">
            No more LINE messages at midnight — bookings, changes, and payments
            happen on their phone, and land in your system.
          </p>
        </div>
        <CustomerPhone />
      </div>
    </section>
  );
}

/* ---------- Exsportia VMS — the venue back office ---------- */

const VMS_FEATURES = [
  { icon: CalendarDays, label: 'Real-time multi-calendar', text: 'Every area, class, and trainer on one live calendar.' },
  { icon: CreditCard, label: 'All payment methods', text: 'Card, Apple Pay, Thai QR — one flat 5% on online sales.' },
  { icon: Users, label: 'Members & subscriptions', text: 'Passes, memberships, and renewals on autopilot.' },
  { icon: QrCode, label: 'Automated QR check-in', text: 'Customers scan in at the door — no front-desk queue.' },
  { icon: ScanLine, label: 'Statements & invoices', text: 'Automated invoicing and monthly statements.' },
  { icon: Smartphone, label: 'Manage on any device', text: 'The whole back office, on your phone.' },
  { icon: Search, label: 'Analytics & reports', text: 'See what sells, who returns, and what to grow.' },
  { icon: Rocket, label: 'Broadcast messages', text: 'Tell all your members at once — schedule changes, promos.' },
  { icon: BadgeCheck, label: 'Cancellation protection', text: 'Late-cancel and no-show rules that protect your revenue.' },
];

export function VmsSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-16 sm:pb-24">
      {/* Big lockup */}
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-3">
          <img src="/assets/brand/exsportia-icon.png" alt="" className="h-12 w-12 sm:h-14 sm:w-14" />
          <span className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            exsportia
            <span className="ml-2 align-super text-sm font-extrabold tracking-[0.2em] text-mint">
              VMS
            </span>
          </span>
        </div>
        <h2 className="mt-5 max-w-2xl font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
          Your free back office —
          <span className="text-punch"> it runs the business for you.</span>
        </h2>
        <p className="mt-3 max-w-2xl text-ink-600">
          Every MySportia venue gets the full Exsportia venue management system.
          50+ features. No setup fee, no monthly fee.
        </p>
      </div>

      {/* Features grid */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {VMS_FEATURES.map((f) => (
          <div key={f.label} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-ink-950/5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-mint/10">
              <f.icon className="h-5 w-5 text-mint" />
            </span>
            <p className="mt-3 font-display font-extrabold">{f.label}</p>
            <p className="mt-1 text-sm text-ink-600">{f.text}</p>
          </div>
        ))}
      </div>

      {/* The system on real devices */}
      <img
        src="/assets/brand/product-devices.png"
        alt="Exsportia VMS on laptop, tablet and phone"
        className="mx-auto mt-12 w-full max-w-4xl"
        loading="lazy"
      />
    </section>
  );
}

/* ---------- Screens, in function — dark band, press screen screen screen ---------- */

const SCREENS = [
  { src: '/assets/brand/screen-1.png', label: 'Search venues on the map' },
  { src: '/assets/brand/screen-2.png', label: 'Venue profile & booking' },
  { src: '/assets/brand/screen-3.png', label: 'Classes & schedules' },
  { src: '/assets/brand/screen-4.png', label: 'Instant checkout' },
  { src: '/assets/brand/screen-5.png', label: 'Members & subscriptions' },
  { src: '/assets/brand/screen-6.png', label: 'Your back office' },
];

export function ScreensShowcase() {
  const [active, setActive] = useState(0);
  return (
    <section className="bg-ink-950 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-5">
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          See it <span className="text-punch">in function.</span>
        </h2>
        <p className="mt-2 text-white/60">Tap through the screens — this is the live product.</p>

        <button
          onClick={() => setActive((active + 1) % SCREENS.length)}
          className="mt-8 block w-full overflow-hidden rounded-3xl bg-white shadow-2xl shadow-black/40 ring-1 ring-white/10 transition-transform active:scale-[0.99]"
          aria-label="Next screen"
        >
          <img
            key={active}
            src={SCREENS[active].src}
            alt={SCREENS[active].label}
            className="w-full animate-fade-up"
          />
        </button>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {SCREENS.map((s, i) => (
            <button
              key={s.src}
              onClick={() => setActive(i)}
              className={`rounded-full px-3.5 py-2 text-xs font-extrabold transition-colors ${
                i === active
                  ? 'bg-punch text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Marketplace: three sides + player flow ---------- */

const SIDES = [
  {
    name: 'Players',
    color: '#FF3D7E',
    text: 'Locals and travelers looking for Muay Thai — they search, book, and pay on MySportia.',
  },
  {
    name: 'Venues',
    color: '#16C25C',
    text: 'Your gym, listed and bookable — with a complete free system to run everything behind it.',
  },
  {
    name: 'Trainers',
    color: '#FFCB1F',
    text: 'Your krus and coaches, visible on your profile — privates and classes filled automatically.',
  },
];

const FLOW = [
  {
    icon: Search,
    title: 'Search',
    text: 'Customers search Muay Thai gyms, classes and trainers in your area — and beyond.',
  },
  {
    icon: CalendarDays,
    title: 'Book',
    text: 'They book instantly — your real schedule, your real availability.',
  },
  {
    icon: QrCode,
    title: 'Pay',
    text: 'They pay by card or Thai QR before they arrive. It lands in your system.',
  },
  {
    icon: ScanLine,
    title: 'Train',
    text: 'They walk in, check in, and train. You just see the ring fill up.',
  },
];

export function PlayerFlow() {
  return (
    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {FLOW.map((f, i) => (
        <div key={f.title} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-ink-950/5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-punch/10">
              <f.icon className="h-5 w-5 text-punch" />
            </span>
            <span className="font-display text-lg font-extrabold">
              <span className="mr-1.5 text-ink-950/30">{i + 1}</span>
              {f.title}
            </span>
          </div>
          <p className="mt-3 text-sm text-ink-600">{f.text}</p>
        </div>
      ))}
    </div>
  );
}

export function MarketplaceSection() {
  return (
    <section className="bg-[#FFEDE6]/60 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <img
            src="/assets/brand/x-collage.png"
            alt="Every sport on one marketplace"
            className="order-2 w-full lg:order-1"
            loading="lazy"
          />
          <div className="order-1 lg:order-2">
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              One marketplace.
              <br />
              <span className="text-punch">Three sides, working for you.</span>
            </h2>
            <div className="mt-8 space-y-4">
              {SIDES.map((s) => (
                <div key={s.name} className="flex items-start gap-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-ink-950/5">
                  <span
                    className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-sm font-extrabold text-white"
                    style={{ background: s.color }}
                  >
                    {s.name[0]}
                  </span>
                  <div>
                    <p className="font-display font-extrabold">{s.name}</p>
                    <p className="mt-0.5 text-sm text-ink-600">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm font-semibold text-ink-600">
              The brand is all sports &amp; activities — Muay Thai is where the campaign begins.
            </p>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="font-display text-2xl font-extrabold tracking-tight">
            How a customer reaches your gym
          </h3>
          <PlayerFlow />
        </div>
      </div>
    </section>
  );
}

/* ---------- Dan: the cinematic trainer film — dark band ---------- */

export function DanSection() {
  return (
    <section className="bg-ink-950 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-5">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-punch">
          Dan, 35 · Trainer
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          For the gyms. For the trainers.
          <span className="text-punch"> For the ones who show up.</span>
        </h2>
        <ScrollVideo
          src="/assets/brand/dan-trainer.mp4"
          autoSound
          className="mt-8 aspect-video shadow-2xl shadow-black/50"
        />
        <p className="mt-4 text-center text-sm text-white/40">
          Scroll — it plays, sound on. Scroll past — sound off.
        </p>
      </div>
    </section>
  );
}

/* ---------- How it works ---------- */

const STEPS = [
  {
    icon: Store,
    title: 'Claim your venue',
    text: 'Find your gym in the list, check your details, tell us what you offer. Ten easy steps, phone-friendly.',
  },
  {
    icon: Rocket,
    title: 'We set you up',
    text: 'A real person finishes your setup with you on a call and takes your gym live. No tech skills needed.',
  },
  {
    icon: CreditCard,
    title: 'Customers book & pay',
    text: 'The marketplace sends you customers. They book your classes and pay by card or QR — straight into your system.',
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
      <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
        How it works
      </h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {STEPS.map((s, i) => (
          <div key={s.title} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink-950/5">
            <div className="mb-4 flex items-center gap-3">
              <span className="font-display text-4xl font-extrabold text-punch/25">{i + 1}</span>
              <s.icon className="h-7 w-7 text-punch" />
            </div>
            <h3 className="font-display text-xl font-extrabold">{s.title}</h3>
            <p className="mt-2 text-ink-600">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- What you get, free + the deal ---------- */

const FREE_ITEMS = [
  'Marketplace listing — the campaign drives customers to you',
  'Full booking, payment & membership system (powered by Exsportia)',
  'Your own branded page to share on socials',
  'Payments by card & Thai QR',
];

export function TheDeal() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-16 sm:pb-24">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            What you get. <span className="text-punch">Free.</span>
          </h2>
          <ul className="mt-8 space-y-4">
            {FREE_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <BadgeCheck className="mt-0.5 h-6 w-6 shrink-0 text-mint" />
                <span className="text-lg text-ink-950/85">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl bg-ink-950 p-8 text-white shadow-xl shadow-ink-950/20">
          <p className="font-display text-xl font-extrabold text-gold">The deal, plainly:</p>
          <ul className="mt-4 space-y-2 text-lg text-white/90">
            <li>· No setup fee</li>
            <li>· No monthly fee</li>
            <li>· No contract</li>
          </ul>
          <p className="mt-6 border-t border-white/15 pt-6 text-lg font-semibold">
            We take <span className="font-display text-3xl font-extrabold text-gold">5%</span> on
            online transactions only.
          </p>
          <p className="mt-2 text-white/60">
            Everything else — walk-ins, cash, your existing customers — is 100% yours.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Thailand ---------- */

const TH_STATS = [
  { v: '400,000', l: 'football pitches' },
  { v: '40,000', l: 'sports centres' },
  { v: '22,150', l: 'personal trainers' },
  { v: '33,098', l: 'schools in Thailand' },
];

export function ThailandSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-16 sm:pb-24">
      <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-ink-950/5 sm:p-12">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-mint">
          🇹🇭 The bigger picture
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Making Thailand a global
          <span className="text-punch"> sports participation hub.</span>
        </h2>
        <p className="mt-4 max-w-2xl text-ink-600">
          Thailand's sports market is enormous — and Muay Thai is its global icon.
          MySportia connects it all in one place, starting with your gym.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {TH_STATS.map((s) => (
            <div key={s.l}>
              <p className="font-display text-3xl font-extrabold text-punch sm:text-4xl">{s.v}</p>
              <p className="mt-1 text-sm font-semibold text-ink-600">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */

const FAQS = [
  {
    q: 'Is it really free?',
    a: 'Yes. No setup fee, no monthly fee, no contract. The only cost is 5% on transactions that happen online through the platform. Cash, walk-ins, and everything you sell outside the system stay 100% yours.',
  },
  {
    q: "What's the 5% exactly?",
    a: 'When a customer books and pays online — a class, a package, a membership — 5% of that transaction is our fee. It already includes card and QR processing. If nothing is sold online, you pay nothing.',
  },
  {
    q: 'Do I need tech skills?',
    a: "No. You claim your venue in ten small steps from your phone, then a real person finishes the setup with you on a video call and takes you live. If you get stuck at any point, hit 'Talk to us'.",
  },
  {
    q: 'What happens to my existing bookings?',
    a: 'They keep working. We help you move your current schedule and regulars into the system during your setup call, so nothing is lost and nothing double-books.',
  },
  {
    q: 'When do customers start coming?',
    a: 'The Muay Thai campaign is launching now — venues that claim early are ready on day one, with a complete profile, when the marketing wave goes out across Thailand and internationally.',
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mx-auto max-w-3xl px-5 pb-16 sm:pb-24">
      <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
        Questions, answered
      </h2>
      <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-ink-950/5">
        {FAQS.map((f, i) => (
          <div key={f.q} className="border-b border-ink-950/5 last:border-0">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="font-display text-lg font-extrabold">{f.q}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-punch transition-transform ${
                  open === i ? 'rotate-180' : ''
                }`}
              />
            </button>
            {open === i && <p className="px-6 pb-5 text-ink-600 animate-fade-up">{f.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Footer — ink band, v3 style ---------- */

const SOCIALS = [
  { label: 'FB @mysportia', href: 'https://facebook.com/mysportia' },
  { label: 'IG @mysportia.official', href: 'https://instagram.com/mysportia.official' },
  { label: 'LINE @mysportia', href: 'https://line.me/R/ti/p/@mysportia' },
  { label: 'TikTok @mysportia', href: 'https://tiktok.com/@mysportia' },
];

export function Footer() {
  return (
    <footer className="bg-ink-950 text-white">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <img src="/assets/brand/logo-on-black.png" alt="MySportia" className="h-7" />
            <p className="mt-4 text-sm text-white/60">
              Thailand's sports &amp; activities marketplace — every sport, every venue.
              Muay Thai is where the campaign begins.
            </p>
            <p className="mt-3 text-xs text-white/35">Venue back office powered by Exsportia.</p>
          </div>
          <div>
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-white/40">
              Owners
            </p>
            <div className="flex flex-col gap-2 text-sm font-semibold text-white/70">
              <span>Claim your gym →</span>
              <span>Pricing (5% flat)</span>
              <span>Talk to a human</span>
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-white/40">
              Social
            </p>
            <div className="flex flex-col gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-white/70 hover:text-punch"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/35 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} MySportia · mysportia.com</span>
          <span>Running across 34 venues</span>
        </div>
      </div>
    </footer>
  );
}
