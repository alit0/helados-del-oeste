interface Props {
  className?: string;
}

/** Brand badge — the real Helados del Oeste logo (transparent, already circular). */
export function Logo({ className = '' }: Props) {
  return (
    <img src="/logo.png" alt="Helados del Oeste" className={`object-contain ${className}`} />
  );
}
