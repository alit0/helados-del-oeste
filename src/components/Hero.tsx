import { SearchBar } from './SearchBar';
import { Logo } from './Logo';

interface Props {
  query: string;
  onQuery: (v: string) => void;
}

export function Hero({ query, onQuery }: Props) {
  return (
    <section className="bg-brand-red px-4 pb-6 pt-4 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-start gap-3">
          <Logo className="h-14 w-14 shrink-0 md:hidden" />
          <div className="flex-1">
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
