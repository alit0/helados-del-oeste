interface Props {
  className?: string;
}

/** Brand badge — circular crop of the real Helados del Oeste logo. */
export function Logo({ className = '' }: Props) {
  return (
    <div className={`overflow-hidden rounded-full bg-white ${className}`}>
      <img
        src="/logo.png"
        alt="Helados del Oeste"
        className="h-full w-full scale-[1.12] object-cover"
      />
    </div>
  );
}
