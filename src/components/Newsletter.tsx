import { useState } from 'react';

export function Newsletter() {
  const [done, setDone] = useState(false);

  return (
    <section className="px-4 py-2">
      <div
        className="mx-auto max-w-6xl rounded-card bg-brand-red bg-cover bg-center px-5 py-6 text-white"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(225,27,34,0.96) 0%, rgba(225,27,34,0.78) 45%, rgba(225,27,34,0.25) 100%), url(/promos/newsletter.webp)',
        }}
      >
        <h2 className="text-lg font-extrabold">Sumate a las promos</h2>
        <p className="mt-1 text-sm opacity-90">Recibí ofertas exclusivas y novedades en tu mail.</p>
        {done ? (
          <p className="mt-3 font-bold">¡Gracias! Te sumamos a las promos. 🍦</p>
        ) : (
          <form
            className="mt-3 flex max-w-md gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
          >
            <input
              type="email"
              required
              placeholder="Tu email"
              className="flex-1 rounded-full px-4 py-2 text-sm text-ink outline-none"
            />
            <button type="submit" className="rounded-full bg-navy px-4 py-2 text-sm font-extrabold">
              Suscribirme
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
