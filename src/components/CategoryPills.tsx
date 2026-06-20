import type { Category } from '../types/catalog';
import { CategoryIcon } from './CategoryIcon';

interface Props {
  categories: Category[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export function CategoryPills({ categories, selected, onSelect }: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto px-4 py-4 md:justify-center">
      {categories.map((c) => {
        const active = selected === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(active ? null : c.id)}
            className={`flex min-w-[72px] flex-col items-center gap-1 rounded-card border px-3 py-2 text-center text-[11px] font-semibold leading-tight transition ${
              active
                ? 'border-brand-red bg-brand-red/10 text-brand-red'
                : 'border-transparent bg-cardWhite text-ink shadow-sm'
            }`}
          >
            <CategoryIcon id={c.id} className="mx-auto h-6 w-6" />
            <span className="block w-full text-center">{c.name}</span>
          </button>
        );
      })}
    </div>
  );
}
