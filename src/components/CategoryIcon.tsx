import {
  Popsicle,
  IceCreamCone,
  Candy,
  CupSoda,
  IceCreamBowl,
  Container,
  CakeSlice,
  Sparkles,
  Dumbbell,
  Scale,
  IceCream,
  type LucideIcon,
} from 'lucide-react';

const MAP: Record<string, LucideIcon> = {
  'palitos-de-agua': Popsicle,
  'palitos-de-crema': IceCreamCone,
  'bombones-y-premium': Candy,
  'vasitos-y-copas': CupSoda,
  'potes-individuales': IceCreamBowl,
  'potes-familiares': Container,
  'postres-y-tortas': CakeSlice,
  'especiales': Sparkles,
  'fit-cream': Dumbbell,
  'sabores-por-peso': Scale,
};

interface Props {
  id: string;
  className?: string;
}

export function CategoryIcon({ id, className }: Props) {
  const Icon = MAP[id] ?? IceCream;
  return <Icon className={className} aria-hidden />;
}
