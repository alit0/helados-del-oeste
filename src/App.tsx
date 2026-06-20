import { useMemo, useState } from 'react';
import { useCatalog } from './hooks/useCatalog';
import { usePedido } from './hooks/usePedido';
import { tokens } from './theme/tokens';
import type { Product } from './types/catalog';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Hero } from './components/Hero';
import { CategoryPills } from './components/CategoryPills';
import { OfferBanner } from './components/OfferBanner';
import { FreeShippingBanner } from './components/FreeShippingBanner';
import { CategorySection } from './components/CategorySection';
import { Testimonials } from './components/Testimonials';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { PedidoDrawer } from './components/PedidoDrawer';

export default function App() {
  const { data, loading, error } = useCatalog();
  const pedido = usePedido();
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [sinTacc, setSinTacc] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    return data.products.filter((p) => {
      const matchesCat = !selectedCat || p.category === selectedCat;
      const matchesQuery =
        !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      const matchesTacc = !sinTacc || p.tags.includes('Sin Gluten');
      return matchesCat && matchesQuery && matchesTacc;
    });
  }, [data, query, selectedCat, sinTacc]);

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
    <div className="min-h-screen pb-20 md:pb-0">
      <Header
        count={pedido.count}
        onCartClick={() => setDrawerOpen(true)}
        onSinTacc={() => setSinTacc((v) => !v)}
        sinTaccActive={sinTacc}
      />
      <div id="inicio" className="scroll-mt-20">
        <Hero query={query} onQuery={setQuery} />
      </div>
      <div id="categorias" className="scroll-mt-20">
        <CategoryPills categories={data.categories} selected={selectedCat} onSelect={setSelectedCat} />
      </div>
      <div id="ofertas" className="scroll-mt-20">
        <OfferBanner promos={data.promos ?? []} />
      </div>
      <FreeShippingBanner threshold={data.store.freeShippingThreshold} />

      {data.categories
        .filter((c) => !selectedCat || c.id === selectedCat)
        .map((c) => (
          <CategorySection
            key={c.id}
            category={c}
            products={filtered.filter((p) => p.category === c.id)}
            color={tokens.colors.brandRed}
            onAdd={onAdd}
          />
        ))}

      <Testimonials />
      <Newsletter />
      <Footer store={data.store} />
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
