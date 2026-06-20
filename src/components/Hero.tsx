import { SearchBar } from './SearchBar';

interface Props {
  query: string;
  onQuery: (v: string) => void;
}

export function Hero({ query, onQuery }: Props) {
  return (
    <section
      className="flex min-h-[200px] items-center bg-brand-red bg-cover bg-right px-4 pb-6 pt-4 text-white md:min-h-[320px]"
      style={{
        backgroundImage:
          'linear-gradient(90deg, rgba(225,27,34,0.98) 0%, rgba(225,27,34,0.82) 38%, rgba(225,27,34,0.25) 72%, rgba(225,27,34,0.05) 100%), url(/hero.png)',
      }}
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-xl py-3 md:py-10">
          <h1 className="text-3xl font-black leading-tight drop-shadow md:text-5xl">
            Armá tu antojo
          </h1>
          <p className="mt-2 text-sm opacity-95 md:text-base">
            Buscá sabores, promos y opciones Sin TACC.
          </p>
        </div>
        <div className="max-w-xl">
          <SearchBar value={query} onChange={onQuery} />
        </div>
      </div>
    </section>
  );
}
