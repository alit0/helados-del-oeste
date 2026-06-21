import { useEffect, useMemo, useRef, useState } from 'react';
import { useCatalog } from './hooks/useCatalog';
import { usePedido } from './hooks/usePedido';
import { tokens } from './theme/tokens';
import type { Product } from './types/catalog';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Hero } from './components/Hero';
import { QuickFilters, type QuickFilterKey } from './components/QuickFilters';
import { OfferBanner } from './components/OfferBanner';
import { CategorySection } from './components/CategorySection';
import { Testimonials } from './components/Testimonials';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { PedidoDrawer } from './components/PedidoDrawer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

const GROUP_CATS: Record<'potes' | 'palitos', string[]> = {
  potes: ['potes-individuales', 'potes-familiares'],
  palitos: ['palitos-de-agua', 'palitos-de-crema'],
};

const BADGE_OF: Record<string, string> = {
  ofertas: 'Oferta',
  masvendido: 'Más vendido',
  nuevo: 'Nuevo',
};

export default function App() {
  const { data, loading, error } = useCatalog();
  const pedido = usePedido();
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<'potes' | 'palitos' | null>(null);
  const [sinTacc, setSinTacc] = useState(false);
  const [badge, setBadge] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pendingCat, setPendingCat] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const groupCats = group ? GROUP_CATS[group] : null;

  useEffect(() => {
    if (group || sinTacc || badge)
      resultsRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
  }, [group, sinTacc, badge]);

  // After clearing filters, scroll to the category chosen from the header dropdown.
  useEffect(() => {
    if (!pendingCat) return;
    document
      .getElementById(`cat-${pendingCat}`)
      ?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
    setPendingCat(null);
  }, [pendingCat, group, sinTacc]);

  const onCategory = (id: string) => {
    setGroup(null);
    setSinTacc(false);
    setBadge(null);
    setPendingCat(id);
  };

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    return data.products.filter((p) => {
      const matchesGroup = !groupCats || groupCats.includes(p.category);
      const matchesQuery =
        !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      const matchesTacc = !sinTacc || p.tags.includes('Sin Gluten');
      const matchesBadge =
        !badge || (p.badge != null && p.badge.toLowerCase() === badge.toLowerCase());
      return matchesGroup && matchesQuery && matchesTacc && matchesBadge;
    });
  }, [data, query, groupCats, sinTacc, badge]);

  const isActive = (key: QuickFilterKey) => {
    if (key === 'ofertas' || key === 'masvendido' || key === 'nuevo') return badge === BADGE_OF[key];
    if (key === 'potes' || key === 'palitos') return group === key;
    if (key === 'sintacc') return sinTacc;
    return false;
  };

  const onQuickSelect = (key: QuickFilterKey) => {
    if (key === 'ofertas' || key === 'masvendido' || key === 'nuevo') {
      const b = BADGE_OF[key];
      setBadge((v) => (v === b ? null : b));
    } else if (key === 'sintacc') {
      setSinTacc((v) => !v);
    } else {
      setGroup((g) => (g === key ? null : key));
    }
  };

  const onAdd = (p: Product) => {
    const modo: 'unidad' | 'caja' = p.priceUnit != null ? 'unidad' : 'caja';
    const precio = modo === 'unidad' ? p.priceUnit! : p.priceBox!;
    pedido.add({ id: p.id, name: p.name, modo, precio });
    setDrawerOpen(true);
  };

  if (loading && !data) return <div className="p-8 text-center">Cargando catálogo…</div>;
  if (error && !data)
    return <div className="p-8 text-center text-brand-red">No se pudo cargar el catálogo.</div>;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-brand-red pb-20 md:pb-0">
      <Header
        count={pedido.count}
        onCartClick={() => setDrawerOpen(true)}
        onSinTacc={() => setSinTacc((v) => !v)}
        sinTaccActive={sinTacc}
        categories={data.categories}
        onCategory={onCategory}
      />
      <div id="inicio">
        <Hero query={query} onQuery={setQuery} />
      </div>

      <div className="relative z-10 -mt-3 rounded-t-[2rem] bg-cream pt-1">
        <div id="categorias">
          <QuickFilters isActive={isActive} onSelect={onQuickSelect} />
        </div>
        <div id="ofertas" className="scroll-mt-20">
          <OfferBanner promos={data.promos ?? []} />
        </div>

        <div ref={resultsRef} className="scroll-mt-24">
          {data.categories
            .filter((c) => !groupCats || groupCats.includes(c.id))
            .map((c) => (
              <CategorySection
                key={c.id}
                category={c}
                products={filtered.filter((p) => p.category === c.id)}
                color={tokens.colors.brandRed}
                onAdd={onAdd}
              />
            ))}
        </div>

        <Testimonials />
        <Newsletter />
      </div>

      <Footer store={data.store} />
      <FloatingWhatsApp />
      <BottomNav count={pedido.count} onCartClick={() => setDrawerOpen(true)} />
      <PedidoDrawer
        open={drawerOpen}
        lines={pedido.lines}
        whatsapp={data.store.whatsapp}
        onClose={() => setDrawerOpen(false)}
        onRemove={pedido.remove}
      />
    </div>
  );
}
