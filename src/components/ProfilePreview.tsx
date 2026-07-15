import { ArrowRight, MapPin, Sparkles, Star } from 'lucide-react';
import { FunnelData } from './Funnel';
import { trackLead } from '../lib/leads';

interface Props {
  data: FunnelData;
  onContinue: () => void;
}

/**
 * "This is how your venue profile will look to global users."
 * Consumer-facing MySportia profile mock, pre-filled from the claim data.
 * Zero-pressure framing: nothing to confirm — edit later in the back office.
 * In production the gallery pulls the venue's own images from our DB records.
 */
export default function ProfilePreview({ data, onContinue }: Props) {
  const gymName = data.venueName || 'Your Gym';
  const location = [data.area, data.city].filter(Boolean).join(', ') || 'Thailand';
  const services = data.services.length
    ? data.services
    : ['Group classes', 'Private sessions'];

  return (
    <div className="mx-auto max-w-lg px-5 pb-28 pt-6">
      <div className="mb-5 flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-punch shadow-sm ring-1 ring-ink-950/5">
        <Sparkles className="h-4 w-4" />
        PREVIEW — your public profile
      </div>

      <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
        This is how {gymName} will look
        <span className="text-punch"> to global users.</span>
      </h2>

      {/* Consumer profile card */}
      <div className="mt-6 overflow-hidden rounded-3xl bg-white text-ink-900 shadow-2xl shadow-ink-950/15 ring-1 ring-ink-950/5">
        {/* Gallery — in production: their own photos from our DB record */}
        <div className="relative grid h-44 grid-cols-3 gap-0.5 overflow-hidden">
          <img src="/assets/hero-fighter.png" alt="" className="col-span-2 h-44 w-full object-cover" />
          <div className="grid h-44 grid-rows-2 gap-0.5">
            <img src="/assets/trainer-boxer.png" alt="" className="h-full w-full object-cover object-top" style={{ maxHeight: '87px' }} />
            <img src="/assets/trainer-kohfit.png" alt="" className="h-full w-full object-cover object-top" style={{ maxHeight: '87px' }} />
          </div>
          <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white">
            Your photos here
          </span>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-xl font-extrabold leading-tight">{gymName}</h3>
              <p className="mt-1 flex items-center gap-1 text-sm text-ink-600">
                <MapPin className="h-3.5 w-3.5 text-punch" /> {location}
              </p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-ink-950 px-2.5 py-1.5 text-sm font-extrabold text-white">
              <Star className="h-3.5 w-3.5 fill-[#FBBB17] text-[#FBBB17]" /> New
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {services.map((s) => (
              <span key={s} className="rounded-full bg-ink-950/5 px-3 py-1 text-xs font-bold text-ink-900">
                {s}
              </span>
            ))}
            {data.languages.length > 0 && (
              <span className="rounded-full bg-ink-950/5 px-3 py-1 text-xs font-bold text-ink-900">
                {data.languages.join(' · ')}
              </span>
            )}
          </div>

          {(data.dropInPrice || data.monthlyPrice) && (
            <p className="mt-3 text-sm text-ink-600">
              {data.dropInPrice && (
                <>
                  Drop-in from <span className="font-extrabold text-ink-900">{data.dropInPrice}฿</span>
                </>
              )}
              {data.dropInPrice && data.monthlyPrice && ' · '}
              {data.monthlyPrice && (
                <>
                  Monthly <span className="font-extrabold text-ink-900">{data.monthlyPrice}฿</span>
                </>
              )}
            </p>
          )}

          <button className="mt-4 w-full rounded-full bg-[#16C25C] py-3 font-extrabold text-ink-950">
            Book now
          </button>
        </div>
      </div>

      <p className="mt-4 text-center text-sm font-semibold text-ink-600/80">
        Don't worry — nothing is published yet, and you can change everything.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={() => {
            trackLead({ type: 'step_completed', field: 'profile_preview', venueName: data.venueName });
            onContinue();
          }}
          className="flex items-center justify-center gap-2 rounded-full bg-punch px-6 py-4 font-extrabold text-white shadow-lg shadow-punch/25 transition-transform hover:scale-[1.02]"
        >
          Go to my dashboard <ArrowRight className="h-5 w-5" />
        </button>
        <button
          onClick={() => {
            trackLead({ type: 'field_changed', field: 'edit_later_clicked', venueName: data.venueName });
            onContinue();
          }}
          className="rounded-full bg-white px-6 py-3.5 font-bold text-ink-950 shadow-sm ring-1 ring-ink-950/10 hover:bg-paper-3"
        >
          Edit later in your back office
        </button>
      </div>
    </div>
  );
}
