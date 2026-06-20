import { useRef } from 'react';

const REVIEWS = [
  { name: 'Mariana L.', text: 'Los mejores helados del oeste, con mucho sabor y atención excelente.' },
  { name: 'Diego P.', text: 'Pedí unos potes y llegaron impecables. ¡Calidad de siempre!' },
  { name: 'Sofía R.', text: 'Me encantan los palitos y los bombones. ¡Calidad premium!' },
  { name: 'Lucas M.', text: 'El dulce de leche granizado es otro nivel. Lo pido siempre.' },
  { name: 'Carla V.', text: 'Las opciones sin TACC y aptas diabéticos son un golazo para casa.' },
  { name: 'Martín G.', text: 'Compré por mayor para el cumple y fue un éxito total. Recomendados.' },
];

export function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByPage = (dir: number) => {
    const t = trackRef.current;
    if (!t) return;
    t.scrollBy({ left: dir * t.clientWidth * 0.9, behavior: 'smooth' });
  };

  return (
    <section className="px-4 py-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-extrabold">Lo que dicen nuestros clientes</h2>
          <div className="hidden gap-2 md:flex">
            <button
              type="button"
              aria-label="Comentarios anteriores"
              onClick={() => scrollByPage(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-cardWhite text-xl shadow-sm"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Comentarios siguientes"
              onClick={() => scrollByPage(1)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-cardWhite text-xl shadow-sm"
            >
              ›
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {REVIEWS.map((r) => (
            <div key={r.name} className="shrink-0 basis-full snap-start sm:basis-1/2 lg:basis-1/3">
              <div className="h-full rounded-card bg-cardWhite p-4 shadow-sm">
                <div className="text-brand-red" aria-label="5 de 5 estrellas">
                  ★★★★★
                </div>
                <p className="mt-2 text-sm text-ink">{r.text}</p>
                <p className="mt-2 text-xs font-bold text-muted">{r.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
