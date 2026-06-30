import { useState } from 'react';
import { CATALOG_URL } from '../data/catalogUrl';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');

    // No endpoint configured (e.g. local snapshot / tests): confirm without a
    // network call so the form still behaves.
    if (!CATALOG_URL) {
      setStatus('done');
      return;
    }

    try {
      // Apps Script Web Apps don't return CORS headers, so the browser can't
      // read the response. We send a preflight-free request (simple content
      // type) in no-cors mode: the email reaches the Sheet, and a rejected
      // promise means a real network failure we should surface.
      await fetch(CATALOG_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: new URLSearchParams({ email }).toString(),
      });
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

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
        {status === 'done' ? (
          <p className="mt-3 font-bold">¡Gracias! Te sumamos a las promos. 🍦</p>
        ) : (
          <form className="mt-3 flex max-w-md gap-2" onSubmit={onSubmit}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu email"
              className="flex-1 rounded-full px-4 py-2 text-sm text-ink outline-none"
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="rounded-full bg-navy px-4 py-2 text-sm font-extrabold disabled:opacity-60"
            >
              {status === 'sending' ? 'Enviando…' : 'Suscribirme'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="mt-2 text-sm font-semibold">
            No pudimos sumarte ahora. Probá de nuevo en un momento.
          </p>
        )}
      </div>
    </section>
  );
}
