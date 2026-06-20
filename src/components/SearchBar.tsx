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
        className="w-full rounded-full bg-cardWhite px-5 py-3 pr-12 text-sm text-ink shadow-md outline-none placeholder:text-muted"
      />
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted">
        🔍
      </span>
    </div>
  );
}
