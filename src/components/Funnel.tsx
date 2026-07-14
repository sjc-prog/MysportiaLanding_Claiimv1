import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Camera,
  CheckCircle2,
  CreditCard,
  Globe2,
  Rocket,
  Users,
} from 'lucide-react';
import { Venue } from '../data/venues';
import { trackLead, trackLeadDebounced } from '../lib/leads';

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
          <span className="font-semibold text-white/70">
            Step {step + 1} of {total}
          </span>
          <span className="font-bold text-gold">{Math.round(((step + 1) / total) * 100)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-ink-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold to-punch transition-all duration-500"
            style={{ width: `${((step + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* The sell */}
      <div key={`sell-${step}`} className="mb-8 flex items-start gap-3 rounded-2xl border border-gold/25 bg-gold/10 p-4 animate-fade-up">
        <current.sellIcon className="mt-0.5 h-6 w-6 shrink-0 text-gold" />
        <p className="font-medium text-white/90">{current.sell}</p>
      </div>

      {/* The ask */}
      <div key={`ask-${step}`} className="animate-fade-up">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">{current.title}</h2>
        {current.hint && <p className="mt-2 text-white/60">{current.hint}</p>}
        <div className="mt-6">{current.body}</div>
      </div>

      {/* Nav */}
      <div className="mt-auto flex items-center gap-3 pt-10">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-1.5 rounded-full border border-white/20 px-5 py-3.5 font-semibold text-white/80 hover:bg-white/5"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        )}
        <button
          onClick={next}
          disabled={current.canContinue === false}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 font-bold text-ink-950 shadow-lg shadow-gold/25 transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
        >
          {step + 1 >= total ? 'See my gym on MySportia' : current.cta ?? 'Continue'}
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
      <p className="mt-4 text-center text-sm text-white/40">
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
  sell: string;
  sellIcon: typeof Globe2;
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
      className="w-full rounded-xl border border-white/15 bg-ink-800 px-4 py-3.5 text-white placeholder:text-white/30 focus:border-gold focus:outline-none"
    />
  );

  const chips = (options: string[], selected: string[], onTap: (o: string) => void) => (
    <div className="flex flex-wrap gap-2.5">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onTap(o)}
          className={`rounded-full border px-4 py-2.5 font-semibold transition-colors ${
            selected.includes(o)
              ? 'border-gold bg-gold text-ink-950'
              : 'border-white/20 text-white/80 hover:border-white/40'
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
      sell: "You'll be visible to customers worldwide — they find you, book you, pay you.",
      sellIcon: Globe2,
      canContinue: data.venueName.trim().length > 1,
      cta: venue ? 'Yes, claim my listing' : 'Add my venue',
      body: (
        <div className="space-y-3">
          {venue && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-brand-green/15 px-4 py-3 text-brand-green">
              <BadgeCheck className="h-5 w-5 shrink-0" />
              <span className="font-semibold">Found in the MySportia venue list</span>
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
      sell: 'Customers the marketplace sends you land straight in your own system — not in someone else\'s inbox.',
      sellIcon: Users,
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
      sell: 'Sell any membership, class pass, or package online — customers pay before they even arrive.',
      sellIcon: CreditCard,
      body: chips(SERVICE_OPTIONS, data.services, (o) => toggle('services', o)),
    },
    {
      key: 'schedule',
      title: 'When are you open?',
      hint: 'Rough is fine — we polish it together later.',
      sell: 'No more double bookings, no more missed messages — your calendar runs itself.',
      sellIcon: CalendarCheck,
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
      sell: 'Get paid by card and QR — automatically, straight to you.',
      sellIcon: CreditCard,
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
      sell: 'Your gym, looking its best, on every phone in Thailand and beyond.',
      sellIcon: Camera,
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
      sell: 'Muay Thai travelers from every continent search in their own language — be found by all of them.',
      sellIcon: Globe2,
      body: chips(LANGUAGE_OPTIONS, data.languages, (o) => toggle('languages', o)),
    },
    {
      key: 'current_booking',
      title: 'How do you take bookings today?',
      sell: 'Whatever you use now keeps working — we move it into one system so nothing slips.',
      sellIcon: CheckCircle2,
      body: chips(BOOKING_OPTIONS, data.currentBooking ? [data.currentBooking] : [], (o) =>
        set('currentBooking', data.currentBooking === o ? '' : o)
      ),
    },
    {
      key: 'go_live',
      title: 'When do you want to go live?',
      sell: 'The campaign starts soon — gyms that are live on day one get the first wave of customers.',
      sellIcon: Rocket,
      body: chips(GOLIVE_OPTIONS, data.goLive ? [data.goLive] : [], (o) =>
        set('goLive', data.goLive === o ? '' : o)
      ),
    },
    {
      key: 'preview',
      title: 'Ready to see your gym in the system?',
      hint: 'Next: a preview of your back office — then a quick call takes you live.',
      sell: 'Jump on a quick call — we finish your setup with you and take you live. No tech skills needed.',
      sellIcon: Rocket,
      body: (
        <div className="rounded-2xl border border-white/10 bg-ink-800 p-5">
          <p className="font-semibold text-white/90">{data.venueName || 'Your gym'}</p>
          <p className="mt-1 text-sm text-white/50">
            {[data.area, data.city].filter(Boolean).join(', ') || 'Thailand'}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(data.services.length ? data.services : ['Group classes']).map((s) => (
              <span key={s} className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-gold">
                {s}
              </span>
            ))}
          </div>
        </div>
      ),
    },
  ];
}
