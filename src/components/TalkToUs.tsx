import { useState } from 'react';
import { PhoneCall, X } from 'lucide-react';
import { trackLead } from '../lib/leads';

// GoHighLevel calendar embed goes here at launch; swap the placeholder iframe src.
const BOOKING_EMBED_URL = import.meta.env.VITE_BOOKING_EMBED_URL as string | undefined;

export default function TalkToUs({ funnelStep }: { funnelStep?: number }) {
  const [openModal, setOpenModal] = useState(false);

  const open = () => {
    trackLead({ type: 'talk_to_us_clicked', step: funnelStep });
    setOpenModal(true);
  };

  return (
    <>
      <button
        onClick={open}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-punch px-5 py-3.5 font-bold text-white shadow-xl shadow-punch/30 transition-transform hover:scale-105 active:scale-95"
      >
        <PhoneCall className="h-5 w-5" />
        Talk to us
      </button>

      {openModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-6"
          onClick={() => setOpenModal(false)}
        >
          <div
            className="w-full max-w-lg rounded-t-3xl bg-white p-6 text-ink-900 sm:rounded-3xl animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="font-display text-2xl font-bold">Talk to a human — now</h3>
                <p className="mt-1 text-ink-600">
                  Book a quick video call. We answer fast — often within minutes.
                </p>
              </div>
              <button
                onClick={() => setOpenModal(false)}
                aria-label="Close"
                className="rounded-full p-2 hover:bg-ink-900/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {BOOKING_EMBED_URL ? (
              <iframe
                src={BOOKING_EMBED_URL}
                title="Book a call"
                className="h-[420px] w-full rounded-xl border border-ink-900/10"
              />
            ) : (
              <div className="rounded-xl bg-ink-900/5 p-6 text-center">
                <p className="font-semibold">Booking calendar loads here</p>
                <p className="mt-1 text-sm text-ink-600">
                  (GoHighLevel embed — set VITE_BOOKING_EMBED_URL)
                </p>
                <a
                  href="https://line.me/R/ti/p/@mysportia"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block rounded-full bg-brand-green px-6 py-3 font-bold text-white"
                  onClick={() => trackLead({ type: 'call_requested', field: 'line', step: funnelStep })}
                >
                  Chat on LINE @mysportia
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
