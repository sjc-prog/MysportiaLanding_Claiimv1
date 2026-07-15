import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

/**
 * Scroll-triggered video — the old exsportia-main-website pattern
 * (Section_Video: play when the block reaches mid-viewport, pause when it
 * leaves), rebuilt on IntersectionObserver. Autoplays muted (browser policy);
 * one tap toggles sound.
 */
export default function ScrollVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.5) {
          video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: [0, 0.5] }
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

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
