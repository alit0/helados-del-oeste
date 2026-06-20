interface Props {
  className?: string;
}

/** Circular brand badge placeholder until the real logo asset is provided. */
export function Logo({ className = '' }: Props) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-full bg-white text-center leading-none text-brand-red shadow ${className}`}
      aria-label="Helados del Oeste"
    >
      <span className="text-[8px] font-extrabold uppercase tracking-tight">Helados del</span>
      <span className="text-lg font-black">Lm</span>
      <span className="text-[8px] font-extrabold uppercase tracking-tight">Oeste</span>
    </div>
  );
}
