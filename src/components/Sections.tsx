import { useState } from 'react';
import {
  BadgeCheck,
  ChevronDown,
  CreditCard,
  Megaphone,
  Rocket,
  Store,
} from 'lucide-react';

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
    <section className="mx-auto max-w-5xl px-5 py-16 sm:py-24">
      <h2 className="font-display text-3xl font-extrabold sm:text-4xl">How it works</h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {STEPS.map((s, i) => (
          <div key={s.title} className="rounded-3xl border border-white/10 bg-ink-800 p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="font-display text-4xl font-extrabold text-gold/40">{i + 1}</span>
              <s.icon className="h-7 w-7 text-gold" />
            </div>
            <h3 className="font-display text-xl font-bold">{s.title}</h3>
            <p className="mt-2 text-white/60">{s.text}</p>
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
    <section className="mx-auto max-w-5xl px-5 py-16 sm:py-24">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
            What you get. <span className="text-gold">Free.</span>
          </h2>
          <ul className="mt-8 space-y-4">
            {FREE_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <BadgeCheck className="mt-0.5 h-6 w-6 shrink-0 text-brand-green" />
                <span className="text-lg text-white/85">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border-2 border-gold/50 bg-gradient-to-br from-gold/15 to-punch/10 p-8">
          <p className="font-display text-xl font-bold text-gold">The deal, plainly:</p>
          <ul className="mt-4 space-y-2 text-lg text-white/90">
            <li>· No setup fee</li>
            <li>· No monthly fee</li>
            <li>· No contract</li>
          </ul>
          <p className="mt-6 border-t border-white/15 pt-6 text-lg font-semibold text-white">
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

/* ---------- Trust numbers ---------- */

const NUMBERS = [
  { value: '162M฿', label: 'processed through the platform' },
  { value: '34', label: 'venues already live' },
  { value: '105,000+', label: 'transactions handled' },
  { value: '32,000+', label: 'players on the platform' },
  { value: '94%', label: 'growth year on year' },
];

export function TrustNumbers() {
  return (
    <section className="border-y border-white/10 bg-ink-900 py-14">
      <div className="mx-auto max-w-5xl px-5">
        <p className="mb-8 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/50">
          <Megaphone className="h-4 w-4 text-gold" /> The platform behind the campaign
        </p>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-5">
          {NUMBERS.map((n) => (
            <div key={n.label}>
              <p className="font-display text-3xl font-extrabold text-gold sm:text-4xl">{n.value}</p>
              <p className="mt-1 text-sm text-white/50">{n.label}</p>
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
    <section className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
      <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Questions, answered</h2>
      <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
        {FAQS.map((f, i) => (
          <div key={f.q}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span className="font-display text-lg font-bold">{f.q}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-gold transition-transform ${
                  open === i ? 'rotate-180' : ''
                }`}
              />
            </button>
            {open === i && <p className="pb-5 text-white/65 animate-fade-up">{f.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */

const SOCIALS = [
  { label: 'FB @mysportia', href: 'https://facebook.com/mysportia' },
  { label: 'IG @mysportia.official', href: 'https://instagram.com/mysportia.official' },
  { label: 'LINE @mysportia', href: 'https://line.me/R/ti/p/@mysportia' },
  { label: 'TikTok @mysportia', href: 'https://tiktok.com/@mysportia' },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink-900">
      <div className="mx-auto max-w-5xl px-5 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <img src="/assets/logo-mysportia.svg" alt="MySportia" className="h-6 brightness-0 invert" />
            <p className="mt-3 text-sm text-white/50">
              Thailand's sports & activities marketplace — every sport, every venue.
              Muay Thai is where the campaign begins.
            </p>
            <p className="mt-3 text-xs text-white/30">
              Venue back office powered by Exsportia.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-white/60 hover:text-gold"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
        <p className="mt-10 text-xs text-white/25">
          © {new Date().getFullYear()} MySportia · mysportia.com
        </p>
      </div>
    </footer>
  );
}
