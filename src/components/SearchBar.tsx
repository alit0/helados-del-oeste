import { Search } from 'lucide-react';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar sabores, promos y más..."
        className="w-full rounded-full bg-white py-3 pl-5 pr-14 text-sm text-ink shadow-md outline-none placeholder:text-muted"
      />
      <span className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-navy text-white">
        <Search className="h-4 w-4" />
      </span>
    </div>
  );
}
