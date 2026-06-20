import { SearchBar } from './SearchBar';

interface Props {
  query: string;
  onQuery: (v: string) => void;
}

export function Hero({ query, onQuery }: Props) {
  return (
    <section className="bg-brand-red px-4 pb-6 pt-2 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4 py-2">
          <div>
            <h1 className="text-2xl font-black leading-tight md:text-4xl">Armá tu antojo</h1>
            <p className="mt-1 max-w-md text-sm opacity-90">
              Buscá sabores, promos y opciones Sin TACC.
            </p>
          </div>
          <img
            src="/hero.png"
            alt=""
            aria-hidden
            className="hidden h-28 w-52 rounded-card object-cover object-right md:block"
          />
        </div>
        <div className="mt-2">
          <SearchBar value={query} onChange={onQuery} />
        </div>
      </div>
    </section>
  );
}
