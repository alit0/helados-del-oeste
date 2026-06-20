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
        <div className="flex items-center gap-3">
          <Logo className="h-[4.5rem] w-[4.5rem] shrink-0 md:hidden" />
          <div className="flex-1">
            <h1 className="text-xl font-black leading-tight md:text-4xl">Armá tu antojo</h1>
            <p className="mt-1 max-w-md text-xs opacity-90 md:text-sm">
              Buscá sabores, promos y opciones Sin TACC.
            </p>
          </div>
          <img
            src="/hero.webp"
            alt=""
            aria-hidden
            className="h-28 w-28 shrink-0 object-contain md:h-44 md:w-44"
          />
        </div>
        <div className="mt-3">
          <SearchBar value={query} onChange={onQuery} />
        </div>
      </div>
    </section>
  );
}
