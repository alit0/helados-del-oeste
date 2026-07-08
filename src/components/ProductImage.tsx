import { useState } from 'react';

interface Props {
  imageUrl: string | null;
  name: string;
  categoryColor: string;
}

export function ProductImage({ imageUrl, name, categoryColor }: Props) {
  const [failed, setFailed] = useState(false);

  if (!imageUrl || failed) {
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
    <div className="flex h-32 w-full items-center justify-center rounded-card bg-white p-2">
      <img
        src={imageUrl}
        alt={name}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="max-h-full max-w-full object-contain"
      />
    </div>
  );
}
