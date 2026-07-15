import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BadgeCheck } from 'lucide-react';
import { Venue } from '../data/venues';
import { trackLead, trackLeadDebounced } from '../lib/leads';
import {
  BookingsCard,
  CalendarCard,
  ConciergeCard,
  GoLiveCard,
  LanguagesCard,
  OneSystemCard,
  PaymentsCard,
  SellAnythingCard,
  ShowcaseCard,
  WorldwideCard,
} from './PromoCards';

interface Props {
  venue: Venue | null; // null = manual "add your venue" path
  onFinish: (data: FunnelData) => void;
}

export interface FunnelData {
  venueName: string;
  area: string;
  city: string;
  contactName: string;
  role: string;
  phone: string;
  email: string;
  services: string[];
  weeklyClasses: string;
  openDays: string[];
  dropInPrice: string;
  monthlyPrice: string;
  instagram: string;
  facebook: string;
  languages: string[];
  currentBooking: string;
  goLive: string;
}

const SERVICE_OPTIONS = [
  'Group classes',
  'Private sessions',
  'Fight training',
  'Beginner courses',
  'Packages / passes',
  'Accommodation',
];
const DAY_OPTIONS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const LANGUAGE_OPTIONS = ['Thai', 'English', 'Russian', 'Chinese', 'French', 'German'];
const BOOKING_OPTIONS = ['Paper / notebook', 'LINE messages', 'Facebook / Instagram DMs', 'Website form', 'Another app', 'No system yet'];
const GOLIVE_OPTIONS = ['As soon as possible', 'Within a month', 'Just exploring for now'];

export default function Funnel({ venue, onFinish }: Props) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FunnelData>({
    venueName: venue?.name ?? '',
    area: venue?.area ?? '',
    city: venue?.city ?? '',
    contactName: '',
    role: '',
    phone: '',
    email: '',
    services: [],
    weeklyClasses: '',
    openDays: [],
    dropInPrice: '',
    monthlyPrice: '',
    instagram: '',
    facebook: '',
    languages: [],
    currentBooking: '',
    goLive: '',
  });

  const set = <K extends keyof FunnelData>(field: K, value: FunnelData[K]) => {
    setData((d) => ({ ...d, [field]: value }));
    trackLeadDebounced(
      {
        type: 'field_changed',
        step: step + 1,
        field,
        value: Array.isArray(value) ? value.join(', ') : String(value),
        venueName: data.venueName || venue?.name,
      },
      `field_${field}`
    );
  };

  const toggle = (field: 'services' | 'openDays' | 'languages', item: string) => {
    const list = data[field];
    set(field, list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  };

  const steps = useMemo(
    () => buildSteps(venue, data, set, toggle),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [venue, data, step]
  );

  const total = steps.length;
  const current = steps[step];

  const next = () => {
    trackLead({
      type: 'step_completed',
      step: step + 1,
      field: current.key,
      venueName: data.venueName,
    });
    if (step + 1 >= total) onFinish(data);
    else setStep(step + 1);
  };

  return (
    <div className="mx-auto flex min-h-[100svh] max-w-lg flex-col px-5 pb-28 pt-6">
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-bold text-ink-600">
            Step {step + 1} of {total}
          </span>
          <span className="font-extrabold text-punch">{Math.round(((step + 1) / total) * 100)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-ink-950/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-punch to-gold transition-all duration-500"
            style={{ width: `${((step + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* The sell — a real-product promo card above every question */}
      <div key={`sell-${step}`} className="mb-8 animate-fade-up">{current.promo}</div>

      {/* The ask */}
      <div key={`ask-${step}`} className="animate-fade-up">
        <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
          {current.title}
        </h2>
        {current.hint && <p className="mt-2 text-ink-600">{current.hint}</p>}
        <div className="mt-6">{current.body}</div>
      </div>

      {/* Nav */}
      <div className="mt-auto flex items-center gap-3 pt-10">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-1.5 rounded-full bg-white px-5 py-3.5 font-bold text-ink-950 shadow-sm ring-1 ring-ink-950/10 hover:bg-paper-3"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        )}
        <button
          onClick={next}
          disabled={current.canContinue === false}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-punch px-6 py-3.5 font-extrabold text-white shadow-lg shadow-punch/25 transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
        >
          {step + 1 >= total ? 'See my gym on MySportia' : current.cta ?? 'Continue'}
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
      <p className="mt-4 text-center text-sm font-semibold text-ink-600/70">
        Skip anything you're not sure about — we'll finish it together on your setup call.
      </p>
    </div>
  );
}

/* ---------- step definitions ---------- */

interface StepDef {
  key: string;
  title: string;
  hint?: string;
  promo: JSX.Element;
  body: JSX.Element;
  canContinue?: boolean;
  cta?: string;
}

function buildSteps(
  venue: Venue | null,
  data: FunnelData,
  set: <K extends keyof FunnelData>(f: K, v: FunnelData[K]) => void,
  toggle: (f: 'services' | 'openDays' | 'languages', item: string) => void
): StepDef[] {
  const input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      {...props}
      className="w-full rounded-2xl bg-white px-4 py-3.5 text-ink-950 shadow-sm ring-1 ring-ink-950/10 placeholder:text-ink-600/50 focus:outline-none focus:ring-2 focus:ring-punch"
    />
  );

  const chips = (options: string[], selected: string[], onTap: (o: string) => void) => (
    <div className="flex flex-wrap gap-2.5">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onTap(o)}
          className={`rounded-full px-4 py-2.5 font-bold transition-colors ${
            selected.includes(o)
              ? 'bg-punch text-white shadow-md shadow-punch/25'
              : 'bg-white text-ink-950 shadow-sm ring-1 ring-ink-950/10 hover:ring-ink-950/25'
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );

  return [
    {
      key: 'venue_confirm',
      title: venue ? "You're already on MySportia." : 'Add your gym to the map.',
      hint: venue
        ? 'Claim your listing — please check your details are correct.'
        : 'Tell us where to find you.',
      promo: <WorldwideCard venueName={data.venueName || venue?.name} />,
      canContinue: data.venueName.trim().length > 1,
      cta: venue ? 'Yes, claim my listing' : 'Add my venue',
      body: (
        <div className="space-y-3">
          {venue && (
            <div className="mb-4 flex items-center gap-2 rounded-2xl bg-mint/10 px-4 py-3 text-[#0e7a44] ring-1 ring-mint/30">
              <BadgeCheck className="h-5 w-5 shrink-0" />
              <span className="font-bold">Found in the MySportia venue list</span>
            </div>
          )}
          {input({
            value: data.venueName,
            onChange: (e) => set('venueName', e.target.value),
            placeholder: 'Gym name',
          })}
          {input({
            value: data.area,
            onChange: (e) => set('area', e.target.value),
            placeholder: 'Area (e.g. Chalong)',
          })}
          {input({
            value: data.city,
            onChange: (e) => set('city', e.target.value),
            placeholder: 'City (e.g. Phuket)',
          })}
        </div>
      ),
    },
    {
      key: 'contact',
      title: 'Who should customers reach?',
      hint: 'Your name and role at the gym.',
      promo: <BookingsCard />,
      canContinue: data.contactName.trim().length > 1,
      body: (
        <div className="space-y-3">
          {input({
            value: data.contactName,
            onChange: (e) => set('contactName', e.target.value),
            placeholder: 'Your name',
          })}
          {input({
            value: data.role,
            onChange: (e) => set('role', e.target.value),
            placeholder: 'Role — owner, manager, head trainer…',
          })}
          {input({
            value: data.phone,
            onChange: (e) => set('phone', e.target.value),
            placeholder: 'Phone / WhatsApp / LINE',
            type: 'tel',
          })}
          {input({
            value: data.email,
            onChange: (e) => set('email', e.target.value),
            placeholder: 'Email',
            type: 'email',
          })}
        </div>
      ),
    },
    {
      key: 'services',
      title: 'What do you offer?',
      promo: <SellAnythingCard />,
      body: chips(SERVICE_OPTIONS, data.services, (o) => toggle('services', o)),
    },
    {
      key: 'schedule',
      title: 'When are you open?',
      hint: 'Rough is fine — we polish it together later.',
      promo: <CalendarCard />,
      body: (
        <div className="space-y-5">
          {chips(DAY_OPTIONS, data.openDays, (o) => toggle('openDays', o))}
          {input({
            value: data.weeklyClasses,
            onChange: (e) => set('weeklyClasses', e.target.value),
            placeholder: 'Classes per week (roughly)',
            inputMode: 'numeric',
          })}
        </div>
      ),
    },
    {
      key: 'pricing',
      title: 'Your prices (optional)',
      hint: 'Leave blank if you prefer to set this on the call.',
      promo: <PaymentsCard />,
      body: (
        <div className="space-y-3">
          {input({
            value: data.dropInPrice,
            onChange: (e) => set('dropInPrice', e.target.value),
            placeholder: 'Drop-in class price (THB)',
            inputMode: 'numeric',
          })}
          {input({
            value: data.monthlyPrice,
            onChange: (e) => set('monthlyPrice', e.target.value),
            placeholder: 'Monthly unlimited price (THB)',
            inputMode: 'numeric',
          })}
        </div>
      ),
    },
    {
      key: 'socials',
      title: 'Where do you look your best?',
      hint: "Drop your socials — we'll pull your photos from there.",
      promo: <ShowcaseCard />,
      body: (
        <div className="space-y-3">
          {input({
            value: data.instagram,
            onChange: (e) => set('instagram', e.target.value),
            placeholder: 'Instagram @handle',
          })}
          {input({
            value: data.facebook,
            onChange: (e) => set('facebook', e.target.value),
            placeholder: 'Facebook page',
          })}
        </div>
      ),
    },
    {
      key: 'languages',
      title: 'What languages do you train in?',
      promo: <LanguagesCard />,
      body: chips(LANGUAGE_OPTIONS, data.languages, (o) => toggle('languages', o)),
    },
    {
      key: 'current_booking',
      title: 'How do you take bookings today?',
      promo: <OneSystemCard />,
      body: chips(BOOKING_OPTIONS, data.currentBooking ? [data.currentBooking] : [], (o) =>
        set('currentBooking', data.currentBooking === o ? '' : o)
      ),
    },
    {
      key: 'go_live',
      title: 'When do you want to go live?',
      promo: <GoLiveCard />,
      body: chips(GOLIVE_OPTIONS, data.goLive ? [data.goLive] : [], (o) =>
        set('goLive', data.goLive === o ? '' : o)
      ),
    },
    {
      key: 'preview',
      title: 'Ready to see your gym in the system?',
      hint: 'Next: a preview of your venue profile and back office — then a quick call takes you live.',
      promo: <ConciergeCard />,
      body: (
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-ink-950/5">
          <p className="font-extrabold text-ink-950">{data.venueName || 'Your gym'}</p>
          <p className="mt-1 text-sm text-ink-600">
            {[data.area, data.city].filter(Boolean).join(', ') || 'Thailand'}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(data.services.length ? data.services : ['Group classes']).map((s) => (
              <span key={s} className="rounded-full bg-punch/10 px-3 py-1 text-xs font-extrabold text-punch">
                {s}
              </span>
            ))}
          </div>
        </div>
      ),
    },
  ];
}
