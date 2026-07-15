// Faithful mock of the real Muay VMS back office (muay-vms repo, "VMS Polish"
// system 2026-07-14): ink #0f1b3d chrome, paper #f5f6f7 surface, grass #16C25C
// CTA, category tints per class type (Group→amber, Open→mint, Kids→rose,
// Fighters→lilac, Private→blue), services in brand amaranth #ED3163.
import { useEffect, useState } from 'react';
import { PhoneCall, Sparkles, Video, X } from 'lucide-react';
import { FunnelData } from './Funnel';
import { trackLead } from '../lib/leads';

interface Props {
  data: FunnelData;
  onCreateAccount: () => void;
}

const TINTS = {
  group: { bg: '#fff6db', bd: '#f3d16a', tx: '#8a6200', label: 'Group' },
  open: { bg: '#e0f6ea', bd: '#6ad69a', tx: '#14633b', label: 'Open mat' },
  kids: { bg: '#fce5e5', bd: '#eb8e8e', tx: '#7e2020', label: 'Kids' },
  fighters: { bg: '#efe7fb', bd: '#b79ae8', tx: '#4e2e96', label: 'Fighters' },
  private: { bg: '#e3eefb', bd: '#7bb0eb', tx: '#21467f', label: 'Private' },
} as const;

const CLASSES: Array<{ time: string; name: string; tint: keyof typeof TINTS; booked: number; cap: number }> = [
  { time: '07:00', name: 'Morning Muay Thai', tint: 'group', booked: 9, cap: 14 },
  { time: '10:00', name: 'Open mat', tint: 'open', booked: 6, cap: 20 },
  { time: '16:00', name: 'Kids Muay Thai', tint: 'kids', booked: 11, cap: 14 },
  { time: '18:00', name: 'Fighters sparring', tint: 'fighters', booked: 7, cap: 8 },
  { time: '19:30', name: 'Private · Kru Anan', tint: 'private', booked: 1, cap: 1 },
];

const BOOKINGS = [
  { name: 'Emma Wilson', what: 'Morning Muay Thai · tomorrow 07:00', amount: '450฿', status: 'PAID' },
  { name: 'Jakob Nilsen', what: 'Private session · Thu 19:30', amount: '1,200฿', status: 'PAID' },
  { name: 'Mook Siriporn', what: '10-class pass', amount: '3,900฿', status: 'NEW' },
];

export default function DashboardPreview({ data, onCreateAccount }: Props) {
  const gymName = data.venueName || 'Your Gym';
  const initials =
    gymName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase() || '?';

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetDismissed, setSheetDismissed] = useState(false);

  // The conversion moment: the join-call sheet slides up while they're
  // looking at "their" dashboard.
  useEffect(() => {
    const t = window.setTimeout(() => setSheetOpen(true), 2600);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-5 pb-40 pt-6">
      <div className="mb-5 flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-punch shadow-sm ring-1 ring-ink-950/5">
        <Sparkles className="h-4 w-4" />
        PREVIEW — your back office
      </div>

      <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
        {gymName}, <span className="text-punch">running on autopilot.</span>
      </h2>
      <p className="mt-2 text-ink-600">
        The free system every MySportia venue gets — shown with sample data. Powered by Exsportia.
      </p>

      {/* ——— The VMS replica ——— */}
      <div className="mt-6 overflow-hidden rounded-3xl shadow-2xl shadow-ink-950/20 ring-1 ring-ink-950/5">
        {/* Ink top bar — venue switcher card, exactly like the real sidebar header */}
        <div className="flex items-center justify-between bg-[#0f1b3d] px-4 py-3">
          <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.04] p-2 pr-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#16C25C] text-[14px] font-extrabold text-[#0f1b3d]">
              {initials}
            </div>
            <div>
              <div className="text-[14px] font-extrabold tracking-tight text-white">{gymName}</div>
              <div className="mt-0.5 flex items-center gap-1.5 text-[11px] font-bold">
                <span className="h-2 w-2 rounded-full bg-[#16C25C]" />
                <span className="text-[#16C25C]">Live (demo)</span>
              </div>
            </div>
          </div>
          <div className="hidden gap-4 text-[12px] font-bold text-white/50 sm:flex">
            <span className="text-white">Calendar</span>
            <span>Bookings</span>
            <span>Finance</span>
            <span>Analytics</span>
          </div>
        </div>

        {/* Paper surface */}
        <div className="space-y-4 bg-[#f5f6f7] p-4">
          {/* Stat tiles */}
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { v: '33', l: 'Bookings this week' },
              { v: '18,400฿', l: 'Paid online' },
              { v: '12', l: 'Active members' },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-white p-3 shadow-sm">
                <p className="font-display text-lg font-extrabold text-[#0f1b3d] sm:text-xl">{s.v}</p>
                <p className="text-[11px] font-semibold text-[#5d6780]">{s.l}</p>
              </div>
            ))}
          </div>

          {/* Today's classes — real tint system */}
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-extrabold text-[#0f1b3d]">Today's classes</p>
              <button className="rounded-full bg-[#16C25C] px-3.5 py-1.5 text-xs font-extrabold text-[#0f1b3d]">
                + Add booking
              </button>
            </div>
            <div className="space-y-2">
              {CLASSES.map((c) => {
                const t = TINTS[c.tint];
                return (
                  <div
                    key={c.time + c.name}
                    className="flex items-center gap-3 rounded-xl border px-3 py-2.5"
                    style={{ background: t.bg, borderColor: t.bd }}
                  >
                    <span className="font-mono text-xs font-extrabold" style={{ color: t.tx }}>
                      {c.time}
                    </span>
                    <span className="flex-1 truncate text-[13px] font-bold" style={{ color: t.tx }}>
                      {c.name}
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[11px] font-extrabold"
                      style={{ background: '#ffffffb0', color: t.tx }}
                    >
                      {c.booked}/{c.cap}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Latest bookings */}
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="mb-3 text-sm font-extrabold text-[#0f1b3d]">Latest bookings</p>
            <div className="space-y-2">
              {BOOKINGS.map((b) => (
                <div key={b.name} className="flex items-center gap-3 border-b border-[#e7e8ea] pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="text-[13px] font-bold text-[#0f1b3d]">{b.name}</p>
                    <p className="text-[11px] text-[#5d6780]">{b.what}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-[13px] font-extrabold text-[#0f1b3d]">{b.amount}</p>
                    <p
                      className="text-[10px] font-extrabold"
                      style={{ color: b.status === 'PAID' ? '#0e7a44' : '#b51e4b' }}
                    >
                      {b.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trainers strip */}
          <div className="flex items-center gap-4 rounded-2xl bg-white p-3.5 shadow-sm">
            {[
              { img: '/assets/trainer-boxer.png', name: 'Kru Anan' },
              { img: '/assets/trainer-female.png', name: 'Kru Fon' },
              { img: '/assets/trainer-kohfit.png', name: 'Coach Mike' },
            ].map((t) => (
              <div key={t.name} className="flex items-center gap-2">
                <img src={t.img} alt="" className="h-8 w-8 rounded-full object-cover object-top" />
                <span className="text-xs font-bold text-[#0f1b3d]">{t.name}</span>
              </div>
            ))}
            <span className="ml-auto text-[11px] font-semibold text-[#5d6780]">Trainers</span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-sm font-semibold text-ink-600/80">
        Sample data — your real setup happens on the call. We verify every claim by hand.
      </p>

      {/* Fallback CTAs for anyone who dismissed the sheet */}
      {sheetDismissed && (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => {
              trackLead({ type: 'call_requested', field: 'setup_call', venueName: data.venueName });
              setSheetOpen(true);
              setSheetDismissed(false);
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-punch px-6 py-4 font-extrabold text-white shadow-lg shadow-punch/25"
          >
            <PhoneCall className="h-5 w-5" /> Join the call — finalize my venue
          </button>
          <button
            onClick={() => {
              trackLead({ type: 'account_started', venueName: data.venueName });
              onCreateAccount();
            }}
            className="flex-1 rounded-full bg-white px-6 py-4 font-bold text-ink-950 shadow-sm ring-1 ring-ink-950/10 hover:bg-paper-3"
          >
            Create my account
          </button>
        </div>
      )}

      {/* ——— The join-call bottom sheet (the conversion moment) ——— */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 transition-transform duration-500 ${
          sheetOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="mx-auto max-w-lg rounded-t-3xl border-t-2 border-punch/60 bg-ink-950 p-6 pb-8 shadow-[0_-20px_60px_rgba(0,0,0,0.6)]">
          <button
            onClick={() => {
              setSheetOpen(false);
              setSheetDismissed(true);
              trackLead({ type: 'field_changed', field: 'call_sheet_dismissed', venueName: data.venueName });
            }}
            aria-label="Not now"
            className="absolute right-4 top-4 rounded-full p-2 text-white/40 hover:bg-white/5"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-punch">
              <Video className="h-6 w-6 text-white" />
              <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-ink-800 bg-[#16C25C]" />
            </span>
            <div>
              <p className="font-display text-lg font-extrabold leading-tight">
                Join the call now — finalize your venue
              </p>
              <p className="text-sm text-white/60">
                15 minutes, with a real human. We set up your full venue together and take you live.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              trackLead({ type: 'call_requested', field: 'join_call_now', venueName: data.venueName });
              onCreateAccount();
            }}
            className="mt-5 w-full rounded-full bg-punch py-4 text-center font-extrabold text-white shadow-lg shadow-punch/30 transition-transform hover:scale-[1.01]"
          >
            Join the call now
          </button>
          <button
            onClick={() => {
              trackLead({ type: 'call_requested', field: 'book_call_later', venueName: data.venueName });
              onCreateAccount();
            }}
            className="mt-2.5 w-full rounded-full border border-white/20 py-3.5 text-center font-semibold text-white/80 hover:bg-white/5"
          >
            Book a time instead
          </button>
        </div>
      </div>
    </div>
  );
}
