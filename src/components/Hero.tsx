import { SearchBar } from './SearchBar';

interface Props {
  query: string;
  onQuery: (v: string) => void;
}

export function Hero({ query, onQuery }: Props) {
  return (
    <section className="bg-brand-red px-4 pb-6 pt-2 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-start justify-between gap-3">
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
            className="h-24 w-24 shrink-0 object-contain md:h-36 md:w-36"
          />
        </div>
        <div className="mt-3">
          <SearchBar value={query} onChange={onQuery} />
        </div>
      </div>
    </section>
  );
}
