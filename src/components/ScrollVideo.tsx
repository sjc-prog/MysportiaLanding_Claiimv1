import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

// Browsers only allow audible playback after the visitor's first real
// gesture (tap/click/keypress) anywhere on the page. Track that globally so
// scroll-in can legally enable sound.
let userHasInteracted = false;
if (typeof window !== 'undefined') {
  const mark = () => {
    userHasInteracted = true;
    window.removeEventListener('pointerdown', mark);
    window.removeEventListener('keydown', mark);
    window.removeEventListener('touchstart', mark);
  };
  window.addEventListener('pointerdown', mark, { passive: true });
  window.addEventListener('touchstart', mark, { passive: true });
  window.addEventListener('keydown', mark);
}

/**
 * Scroll-triggered video — the old exsportia-main-website pattern
 * (play at mid-viewport, pause on leave) + Justin's rule (2026-07-15):
 * sound ON when you scroll to it, sound OFF when you scroll past.
 * Falls back to the manual sound button when the browser blocks audio.
 */
export default function ScrollVideo({
  src,
  poster,
  className,
  autoSound = false,
}: {
  src: string;
  poster?: string;
  className?: string;
  autoSound?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  // React doesn't sync the `muted` prop to the DOM on re-render
  // (facebook/react#10389) — set it imperatively.
  useEffect(() => {
    if (ref.current) ref.current.muted = muted;
  }, [muted]);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.5) {
          if (autoSound && userHasInteracted) {
            video.muted = false;
            setMuted(false);
          }
          video.play().catch(() => {
            // audible autoplay refused — retry muted
            video.muted = true;
            setMuted(true);
            video.play().catch(() => undefined);
          });
        } else {
          video.pause();
          if (autoSound && !video.muted) {
            video.muted = true;
            setMuted(true);
          }
        }
      },
      { threshold: [0, 0.5] }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [autoSound]);

  return (
    <div className={`group relative overflow-hidden rounded-3xl ${className ?? ''}`}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
        onClick={() => setMuted((m) => !m)}
      />
      <button
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? 'Unmute' : 'Mute'}
        className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-transform hover:scale-105"
      >
        {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>
    </div>
  );
}
