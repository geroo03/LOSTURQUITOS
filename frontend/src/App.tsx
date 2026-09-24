import { useCallback, useEffect, useMemo, useState } from 'react';
import { CategoryFilter, Product } from './types';
import { DEFAULT_LOGO_URL, LOCAL_LOGO, waLink } from './lib/config';
import { StoreData, loadStore } from './lib/supabase';
import { useCart } from './lib/useCart';
import { useRoute } from './lib/useRoute';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FloatingCartBar } from './components/FloatingCartBar';
import { HowToBuyModal } from './components/HowToBuyModal';
import { HomeView } from './components/views/HomeView';
import { CatalogView } from './components/views/CatalogView';
import { ProductDetailView } from './components/views/ProductDetailView';
import { CartView } from './components/views/CartView';

type Load = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; data: StoreData };

const EMPTY: StoreData = { categories: [], products: [], config: { logoUrl: null, heroImageUrl: null, tagline: null } };

export default function App() {
  const { route, navigate } = useRoute();
  const [load, setLoad] = useState<Load>({ status: 'loading' });
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [howToOpen, setHowToOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const fetchStore = useCallback(() => {
    setLoad({ status: 'loading' });
    loadStore()
      .then((data) => setLoad({ status: 'ready', data }))
      .catch((e: Error) => setLoad({ status: 'error', message: e.message }));
  }, []);
  useEffect(fetchStore, [fetchStore]);

  const data = load.status === 'ready' ? load.data : EMPTY;
  const cart = useCart(data.products);

  // El logo local carga al instante; solo se reemplaza si Karim subió otro distinto al de siempre desde el panel.
  const logoUrl =
    data.config.logoUrl && data.config.logoUrl !== DEFAULT_LOGO_URL ? data.config.logoUrl : LOCAL_LOGO;

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const addToCart = useCallback(
    (product: Product, unit: string, quantity: number) => {
      cart.add(product.id, unit, quantity);
      setToast(`+${quantity} ${product.title} (${unit}) agregado al pedido`);
    },
    [cart.add],
  );

  const openProduct = (p: Product) => navigate({ view: 'producto', productId: p.id });
  const goToCatalog = (category?: CategoryFilter) => {
    if (category) setSelectedCategory(category);
    navigate({ view: 'catalogo' });
  };
  const openFeatured = () => goToCatalog('destacados');

  const product = useMemo(
    () => (route.view === 'producto' ? data.products.find((p) => p.id === route.productId) : undefined),
    [route, data.products],
  );

  let content;
  if (load.status === 'loading') {
    content = (
      <div className="py-32 flex flex-col items-center gap-3 text-[#49645c]">
        <span className="material-symbols-outlined text-[36px] animate-pulse">storefront</span>
        <span className="font-mono text-xs uppercase tracking-wider">Cargando catálogo…</span>
      </div>
    );
  } else if (load.status === 'error') {
    content = (
      <div className="py-24 flex flex-col items-center gap-3 text-center">
        <span className="material-symbols-outlined text-[40px] text-[#842401]">cloud_off</span>
        <h2 className="font-serif text-lg font-bold text-[#01372e]">No pudimos cargar el catálogo</h2>
        <p className="text-xs text-[#404846] max-w-sm">{load.message}</p>
        <div className="flex gap-2 mt-2">
          <button type="button" onClick={fetchStore} className="px-4 py-2 rounded-xl bg-[#01372e] text-white text-xs font-semibold">
            Reintentar
          </button>
          <a href={waLink('Hola Karim, no me carga el catálogo')} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-xl bg-[#1ebe5d] text-white text-xs font-semibold">
            Escribir a Karim
          </a>
        </div>
      </div>
    );
  } else if (route.view === 'inicio') {
    content = (
      <HomeView
        products={data.products}
        categories={data.categories}
        config={data.config}
        onSelectProduct={openProduct}
        onAddToCart={addToCart}
        onGoToCatalog={goToCatalog}
      />
    );
  } else if (route.view === 'catalogo') {
    content = (
      <CatalogView
        products={data.products}
        categories={data.categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onSelectProduct={openProduct}
        onAddToCart={addToCart}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    );
  } else if (route.view === 'producto') {
    content = product ? (
      // key: al pasar de un producto a otro se reinician galería, variante y cantidad
      <ProductDetailView
        key={product.id}
        product={product}
        allProducts={data.products}
        onBack={() => navigate({ view: 'catalogo' })}
        onSelectProduct={openProduct}
        onAddToCart={addToCart}
      />
    ) : (
      <div className="py-24 flex flex-col items-center gap-3 text-center">
        <span className="material-symbols-outlined text-[40px] text-[#707976]">search_off</span>
        <h2 className="font-serif text-lg font-bold text-[#01372e]">No encontramos ese producto</h2>
        <button type="button" onClick={() => goToCatalog()} className="mt-2 px-4 py-2 rounded-xl bg-[#01372e] text-white text-xs font-semibold">
          Ir al catálogo
        </button>
      </div>
    );
  } else {
    content = (
      <CartView
        items={cart.items}
        total={cart.total}
        onUpdateQuantity={cart.setQuantity}
        onRemoveItem={cart.remove}
        onClearCart={cart.clear}
        onContinueShopping={() => goToCatalog()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8f0] flex flex-col font-sans selection:bg-[#01372e] selection:text-white">
      <Header
        activeView={route.view}
        logoUrl={logoUrl}
        onNavigate={navigate}
        cartCount={cart.count}
        cartTotal={cart.total}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenHowToBuy={() => setHowToOpen(true)}
        onOpenFeatured={openFeatured}
      />

      <main className="flex-1 w-full pt-20 sm:pt-24 md:pt-44 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full pt-2">{content}</div>
      </main>

      <Footer logoUrl={logoUrl} />

      <FloatingCartBar cartCount={cart.count} cartTotal={cart.total} activeView={route.view} onNavigate={navigate} />

      {/* Botón flotante de WhatsApp (tablet y PC) */}
      <a
        href={waLink('Hola Karim, quiero hacer un pedido en Los Turquitos')}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribinos por WhatsApp"
        className="fixed bottom-6 right-6 z-40 hidden sm:flex items-center gap-2 px-4 py-3 rounded-full bg-[#1ebe5d] hover:bg-[#19a550] text-white shadow-[0_8px_24px_rgba(30,190,93,0.4)] transition-all hover:scale-105 active:scale-95 font-bold text-xs sm:text-sm"
      >
        <span className="material-symbols-outlined text-[24px]">chat</span>
        <span>Escribinos</span>
        <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
      </a>

      <MobileBottomNav activeView={route.view} onNavigate={navigate} onOpenFeatured={openFeatured} />

      <HowToBuyModal isOpen={howToOpen} onClose={() => setHowToOpen(false)} onGoToCatalog={() => goToCatalog()} />

      {toast && (
        <div
          role="status"
          className="fixed top-20 md:top-44 left-1/2 -translate-x-1/2 z-[70] bg-[#01372e] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-xs font-mono border border-[#a0d0c3] animate-fade-in max-w-[92vw]"
        >
          <span className="material-symbols-outlined text-[#1ebe5d] text-[18px]">check_circle</span>
          <span className="truncate">{toast}</span>
        </div>
      )}
    </div>
  );
}
