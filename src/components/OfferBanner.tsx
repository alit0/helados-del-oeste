import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, IceCream } from 'lucide-react';
import type { Promo } from '../types/catalog';

interface Props {
  promos: Promo[];
  onAdd?: (promo: Promo) => void;
  onCategory?: (id: string) => void;
}

export function OfferBanner({ promos, onAdd, onCategory }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track || promos.length === 0) return;
    const clamped = (i + promos.length) % promos.length;
    track.scrollTo?.({ left: clamped * track.clientWidth, behavior: 'smooth' });
    setIndex(clamped);
  };

  // Autoplay: advance every 5s, looping.
  useEffect(() => {
    if (promos.length <= 1) return;
    const t = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const next = (index + 1) % promos.length;
      track.scrollTo?.({ left: next * track.clientWidth, behavior: 'smooth' });
      setIndex(next);
    }, 5000);
    return () => clearInterval(t);
  }, [index, promos.length]);

  const onScroll = () => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    const i = Math.round(track.scrollLeft / track.clientWidth);
    if (i !== index) setIndex(i);
  };

  if (promos.length === 0) return null;

  return (
    <div className="px-4 py-2">
      <div className="group relative mx-auto max-w-6xl">
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-card [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {promos.map((p) => (
            <div key={p.id} className="w-full shrink-0 snap-center">
              <div
                className="flex min-h-[160px] items-center justify-between gap-4 bg-navy bg-cover bg-center p-5 text-white"
                style={
                  p.image
                    ? {
                        backgroundImage: `linear-gradient(90deg, rgba(13,20,38,0.94) 0%, rgba(13,20,38,0.6) 45%, rgba(13,20,38,0.1) 100%), url(${p.image})`,
                      }
                    : p.bg
                      ? { background: p.bg }
                      : undefined
                }
              >
                <div>
                  {p.eyebrow && (
                    <span className="text-xs font-bold uppercase tracking-wide text-white/70">
                      {p.eyebrow}
                    </span>
                  )}
                  <p className="mt-1 text-3xl font-black leading-none">{p.title}</p>
                  <p className="mt-1 text-sm font-semibold">{p.subtitle}</p>
                  {p.cta && (p.price != null || p.categoryId) && (
                    <button
                      type="button"
                      onClick={() => {
                        if (p.price != null) onAdd?.(p);
                        else if (p.categoryId) onCategory?.(p.categoryId);
                      }}
                      className="mt-3 rounded-full bg-brand-red px-4 py-2 text-xs font-extrabold transition hover:bg-brand-redDark"
                    >
                      {p.cta}
                    </button>
                  )}
                </div>
                {p.productImage ? (
                  <img
                    src={p.productImage}
                    alt=""
                    aria-hidden
                    className="h-32 w-32 shrink-0 object-contain drop-shadow-xl md:h-40 md:w-40"
                  />
                ) : (
                  !p.image && (
                    <div
                      className="hidden h-24 w-20 items-center justify-center rounded-card bg-white/10 sm:flex"
                      aria-hidden
                    >
                      <IceCream className="h-10 w-10" />
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        {promos.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Promo anterior"
              onClick={() => goTo(index - 1)}
              className="absolute left-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white opacity-0 transition group-hover:opacity-100 md:flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Promo siguiente"
              onClick={() => goTo(index + 1)}
              className="absolute right-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white opacity-0 transition group-hover:opacity-100 md:flex"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {promos.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  aria-label={`Ir a la promo ${i + 1}`}
                  aria-current={i === index}
                  onClick={() => goTo(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? 'w-5 bg-white' : 'w-2 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
