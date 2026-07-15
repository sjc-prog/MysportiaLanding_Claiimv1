// Visual promo cards shown above each funnel question — each one advertises a
// real product outcome, styled after the actual Muay VMS design system
// (muay-vms src/index.css tokens: ink #0f1b3d, paper #f5f6f7, grass #16C25C,
// brand amaranth #ED3163, category tints amber/mint/lilac/blue/rose).
import { BadgeCheck, CalendarCheck, Globe2, QrCode, Star } from 'lucide-react';

/* Shared card chrome: a mini product screen floating on the dark funnel bg */
function Screen({ children, caption }: { children: React.ReactNode; caption: string }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-[#f5f6f7] shadow-xl shadow-ink-950/10 ring-1 ring-ink-950/5">
      <div className="p-3.5">{children}</div>
      <div className="bg-[#0f1b3d] px-4 py-2.5 text-center text-[13px] font-bold text-white">
        {caption}
      </div>
    </div>
  );
}

/* Step 1 — worldwide visibility: profile card being found */
export function WorldwideCard({ venueName }: { venueName?: string }) {
  return (
    <Screen caption="They find you. They book you. They pay you.">
      <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#16C25C] font-extrabold text-[#0f1b3d]">
          {(venueName || 'Your Gym').charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-extrabold text-[#0f1b3d]">
            {venueName || 'Your Gym'}
          </p>
          <p className="flex items-center gap-1 text-xs text-[#5d6780]">
            <Star className="h-3 w-3 fill-[#FBBB17] text-[#FBBB17]" /> 4.9 · Muay Thai · Thailand
          </p>
        </div>
        <span className="rounded-full bg-[#16C25C] px-3 py-1.5 text-xs font-extrabold text-[#0f1b3d]">
          Book
        </span>
      </div>
      <div className="mt-2 flex items-center justify-center gap-2 text-xs font-semibold text-[#5d6780]">
        <Globe2 className="h-3.5 w-3.5 text-[#16C25C]" />
        Seen by customers in 40+ countries
      </div>
    </Screen>
  );
}

/* Step 2 — bookings land in YOUR system: mini booking rows */
export function BookingsCard() {
  const rows = [
    { name: 'Emma W.', what: 'Morning class', tint: '#fff6db', text: '#8a6200', tag: 'PAID' },
    { name: 'Jakob N.', what: 'Private · Kru Anan', tint: '#e3eefb', text: '#21467f', tag: 'PAID' },
    { name: 'Mook S.', what: '10-class pass', tint: '#fdeaf1', text: '#b51e4b', tag: 'NEW' },
  ];
  return (
    <Screen caption="Customers the marketplace sends you land straight in your system.">
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div key={r.name} className="flex items-center gap-2.5 rounded-lg bg-white px-3 py-2 shadow-sm">
            <span className="text-[13px] font-bold text-[#0f1b3d]">{r.name}</span>
            <span className="truncate text-xs text-[#5d6780]">{r.what}</span>
            <span
              className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-extrabold"
              style={{ background: r.tint, color: r.text }}
            >
              {r.tag}
            </span>
          </div>
        ))}
      </div>
    </Screen>
  );
}

/* Step 3 — sell anything online: subscription products */
export function SellAnythingCard() {
  const items = [
    { name: 'Drop-in class', price: '450฿' },
    { name: '10-class pass', price: '3,900฿' },
    { name: 'Monthly unlimited', price: '8,500฿' },
  ];
  return (
    <Screen caption="Sell any membership, class pass, or package — online.">
      <div className="grid grid-cols-3 gap-2">
        {items.map((i) => (
          <div key={i.name} className="rounded-xl border border-[#f9cada] bg-[#fdeaf1] p-2.5 text-center">
            <p className="text-[11px] font-bold leading-tight text-[#b51e4b]">{i.name}</p>
            <p className="mt-1 text-sm font-extrabold text-[#0f1b3d]">{i.price}</p>
          </div>
        ))}
      </div>
    </Screen>
  );
}

/* Step 4 — schedule: mini calendar with the real class tint system */
export function CalendarCard() {
  const slots = [
    { t: '07:00', n: 'Group', bg: '#fff6db', bd: '#f3d16a', tx: '#8a6200' },
    { t: '10:00', n: 'Open mat', bg: '#e0f6ea', bd: '#6ad69a', tx: '#14633b' },
    { t: '16:00', n: 'Kids', bg: '#fce5e5', bd: '#eb8e8e', tx: '#7e2020' },
    { t: '18:00', n: 'Fighters', bg: '#efe7fb', bd: '#b79ae8', tx: '#4e2e96' },
  ];
  return (
    <Screen caption="Your schedule runs itself — no double bookings, no missed messages.">
      <div className="flex items-center gap-2">
        <CalendarCheck className="h-4 w-4 text-[#16C25C]" />
        <span className="text-xs font-extrabold text-[#0f1b3d]">Today</span>
      </div>
      <div className="mt-2 grid grid-cols-4 gap-1.5">
        {slots.map((s) => (
          <div
            key={s.t}
            className="rounded-lg border p-2 text-center"
            style={{ background: s.bg, borderColor: s.bd }}
          >
            <p className="font-mono text-[10px] font-bold" style={{ color: s.tx }}>
              {s.t}
            </p>
            <p className="text-[11px] font-extrabold leading-tight" style={{ color: s.tx }}>
              {s.n}
            </p>
          </div>
        ))}
      </div>
    </Screen>
  );
}

/* Step 5 — payments: accept every method */
export function PaymentsCard() {
  return (
    <Screen caption="Get paid by card and Thai QR — automatically.">
      <div className="flex items-center gap-2.5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-[#e7e8ea] bg-white">
          <QrCode className="h-10 w-10 text-[#0f1b3d]" />
        </div>
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between rounded-lg bg-white px-3 py-1.5 shadow-sm">
            <span className="text-[11px] font-extrabold italic tracking-tight text-[#1A1F71]">VISA</span>
            <span className="text-[11px] font-bold text-[#14633b]">+ 3,200฿</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-white px-3 py-1.5 shadow-sm">
            <span className="flex items-center gap-0.5">
              <span className="inline-block h-3 w-3 rounded-full bg-[#EB001B]" />
              <span className="-ml-1 inline-block h-3 w-3 rounded-full bg-[#F79E1B] opacity-90" />
              <span className="ml-1 text-[10px] font-bold text-[#0f1b3d]">mastercard</span>
            </span>
            <span className="text-[11px] font-bold text-[#14633b]">+ 8,500฿</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-white px-3 py-1.5 shadow-sm">
            <span className="text-[11px] font-extrabold text-[#113566]">PromptPay QR</span>
            <span className="text-[11px] font-bold text-[#14633b]">+ 450฿</span>
          </div>
        </div>
      </div>
    </Screen>
  );
}

/* Step 6 — photos/socials: gym looking its best */
export function ShowcaseCard() {
  return (
    <Screen caption="Your gym, looking its best, on every phone.">
      <div className="grid grid-cols-3 gap-1.5">
        <img src="/assets/hero-fighter.png" alt="" className="h-16 w-full rounded-lg object-cover" />
        <img src="/assets/trainer-boxer.png" alt="" className="h-16 w-full rounded-lg object-cover object-top" />
        <img src="/assets/trainer-kohfit.png" alt="" className="h-16 w-full rounded-lg object-cover object-top" />
      </div>
    </Screen>
  );
}

/* Step 7 — languages: global reach chips */
export function LanguagesCard() {
  const langs = ['🇹🇭 ไทย', '🇬🇧 EN', '🇷🇺 RU', '🇨🇳 中文', '🇫🇷 FR', '🇩🇪 DE'];
  return (
    <Screen caption="Travelers from every continent — found in their own language.">
      <div className="flex flex-wrap justify-center gap-1.5">
        {langs.map((l) => (
          <span
            key={l}
            className="rounded-full border border-[#e7e8ea] bg-white px-3 py-1.5 text-xs font-bold text-[#0f1b3d] shadow-sm"
          >
            {l}
          </span>
        ))}
      </div>
    </Screen>
  );
}

/* Step 8 — everything in one system */
export function OneSystemCard() {
  const items = ['Paper', 'LINE', 'DMs', 'Forms'];
  return (
    <Screen caption="Whatever you use now moves into one system — nothing slips.">
      <div className="flex items-center justify-center gap-2">
        {items.map((i) => (
          <span key={i} className="rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-bold text-[#5d6780] line-through shadow-sm">
            {i}
          </span>
        ))}
        <span className="text-lg font-extrabold text-[#16C25C]">→</span>
        <span className="rounded-lg bg-[#16C25C] px-3 py-1.5 text-[11px] font-extrabold text-[#0f1b3d] shadow-sm">
          One dashboard
        </span>
      </div>
    </Screen>
  );
}

/* Step 9 — go live: campaign wave */
export function GoLiveCard() {
  return (
    <Screen caption="Gyms live on day one get the first wave of customers.">
      <div className="flex items-center justify-center gap-3 py-1">
        <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-2 shadow-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-[#16C25C]" />
          <span className="text-xs font-extrabold text-[#0f1b3d]">LIVE</span>
        </div>
        <div className="text-xs font-semibold text-[#5d6780]">
          The campaign starts soon.
          <br />
          Be ready for launch.
        </div>
      </div>
    </Screen>
  );
}

/* Step 10 — concierge: we finish it with you */
export function ConciergeCard() {
  return (
    <Screen caption="We finish your setup with you on a quick call — and take you live.">
      <div className="flex items-center justify-center gap-3 py-1">
        <img src="/assets/trainer-female.png" alt="" className="h-12 w-12 rounded-full object-cover object-top" />
        <div className="text-left">
          <p className="flex items-center gap-1 text-xs font-extrabold text-[#0f1b3d]">
            <BadgeCheck className="h-3.5 w-3.5 text-[#16C25C]" /> Real human, 15 minutes
          </p>
          <p className="text-xs text-[#5d6780]">No tech skills needed.</p>
        </div>
      </div>
    </Screen>
  );
}
