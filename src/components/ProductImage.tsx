interface Props {
  imageUrl: string | null;
  name: string;
  categoryColor: string;
}

export function ProductImage({ imageUrl, name, categoryColor }: Props) {
  if (!imageUrl) {
    return (
      <div
        data-testid="product-placeholder"
        className="flex h-32 w-full items-center justify-center rounded-card"
        style={{ background: `${categoryColor}1A` }}
        aria-label={`${name} (imagen próximamente)`}
      >
        <span className="text-4xl" style={{ color: categoryColor }}>
          🍦
        </span>
      </div>
    );
  }
  return (
    <img
      src={imageUrl}
      alt={name}
      loading="lazy"
      decoding="async"
      className="h-32 w-full rounded-card object-cover"
    />
  );
}
