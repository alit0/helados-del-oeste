const REVIEWS = [
  { name: 'Mariana L.', text: 'Los mejores helados del oeste, con mucho sabor y atención excelente.' },
  { name: 'Diego P.', text: 'Pedí unos potes y llegaron impecables. ¡Calidad de siempre!' },
  { name: 'Sofía R.', text: 'Me encantan los palitos y los bombones. ¡Calidad premium!' },
];

export function Testimonials() {
  return (
    <section className="px-4 py-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-3 text-lg font-extrabold">Lo que dicen nuestros clientes</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <div key={r.name} className="rounded-card bg-cardWhite p-4 shadow-sm">
              <div className="text-brand-red" aria-label="5 de 5 estrellas">
                ★★★★★
              </div>
              <p className="mt-2 text-sm text-ink">{r.text}</p>
              <p className="mt-2 text-xs font-bold text-muted">{r.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
