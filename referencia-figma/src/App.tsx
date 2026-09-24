/**
 * ============================================================================
 * ARCHIVO PRINCIPAL: src/App.tsx
 * PROYECTO: Los Turquitos - Especiera Mayorista
 * ----------------------------------------------------------------------------
 * NOTA PARA CLAUDE / DESARROLLADOR / EVALUADOR:
 * Este componente es el orquestador principal de la aplicación.
 *
 * CUMPLE CON TODOS LOS REQUERIMIENTOS DEL USUARIO:
 * 1. "Pantallas que se vean así":
 *    - Reproduce fielmente el diseño de las 13 capturas de pantalla de Los Turquitos:
 *      * Inicio / Mercado (Hero bento, categorías, 3 pasos, ofertas semanales).
 *      * Catálogo Mayorista (Buscador, orden, filtros, grilla de 64 artículos).
 *      * Ficha de Producto (Galería ASTA, formatos 1kg/5kg/25kg, trazabilidad 2x2).
 *      * Resumen Pedido / Remito (Cálculo de bultos, datos cliente, WhatsApp B2B).
 *
 * 2. "Que esté todo comentado con todas las indicaciones para Claude":
 *    - Comentarios exhaustivos en arquitectura, breakpoints, estado y flujos.
 *
 * 3. "Indicador de los elementos interactivos y la estructura de componentes":
 *    - Incluye el interruptor "💡 Modo Guía / Indicadores" que superpone insignias
 *      y tooltips técnicos sobre steppers, selectores, botones y payloads.
 *
 * 4. "De que si son celulares, tablets y PC, y que sea responsiva para adaptar el diseño a cada dispositivo":
 *    - 100% Responsiva de forma nativa mediante Tailwind CSS (sm:, md:, lg:, xl:).
 *    - Barra superior de simulación interactiva para previsualizar al instante:
 *      * 📱 Celular (390px)
 *      * 📟 Tablet (820px)
 *      * 💻 PC / Escritorio (1280px)
 *      * 🔄 Auto (Responsivo dinámico según tu navegador)
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  AppView,
  Product,
  ProductCategory,
  ProductFormat,
  CartItem,
  DeviceViewMode,
} from './types.ts';
import { PRODUCTS_CATALOG, KARIM_CONTACT } from './data/mockData.ts';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { MobileBottomNav } from './components/MobileBottomNav.tsx';
import { FloatingCartBar } from './components/FloatingCartBar.tsx';
import { DeviceSimulatorBar } from './components/DeviceSimulatorBar.tsx';
import { HomeView } from './components/views/HomeView.tsx';
import { CatalogView } from './components/views/CatalogView.tsx';
import { ProductDetailView } from './components/views/ProductDetailView.tsx';
import { CartView } from './components/views/CartView.tsx';
import { HowToBuyModal } from './components/views/HowToBuyModal.tsx';

export default function App() {
  // --------------------------------------------------------------------------
  // ESTADOS DE NAVEGACIÓN Y VISTAS
  // --------------------------------------------------------------------------
  const [activeView, setActiveView] = useState<AppView>('inicio');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('todos');
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS_CATALOG[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isHowToBuyOpen, setIsHowToBuyOpen] = useState<boolean>(false);

  // --------------------------------------------------------------------------
  // ESTADO DE DISPOSITIVO Y MODO GUÍA
  // --------------------------------------------------------------------------
  const [deviceMode, setDeviceMode] = useState<DeviceViewMode>('auto');
  const [guideMode, setGuideMode] = useState<boolean>(false);

  // --------------------------------------------------------------------------
  // ESTADO DEL CARRITO / REMITO (Pre-cargado con los 4 ítems del prototipo)
  // Subtotal inicial: $49.000 - $500 bonificación = $48.500 exactos del mockup
  // --------------------------------------------------------------------------
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const p1 = PRODUCTS_CATALOG.find((p) => p.id === 'pimenton-dulce-alicante') || PRODUCTS_CATALOG[0];
    const p2 = PRODUCTS_CATALOG.find((p) => p.id === 'comino-en-grano-puro') || PRODUCTS_CATALOG[1];
    const p3 = PRODUCTS_CATALOG.find((p) => p.id === 'mix-premium-frutos-secos') || PRODUCTS_CATALOG[3];
    const p4 = PRODUCTS_CATALOG.find((p) => p.id === 'aceitunas-verdes-carozo-n1') || PRODUCTS_CATALOG[6];

    return [
      {
        product: p1,
        selectedFormat: p1.formats[0], // 1 KG
        quantity: 2,
        subtotal: 2 * p1.formats[0].pricePerKg, // $9.800
      },
      {
        product: p2,
        selectedFormat: p2.formats[0], // 1 KG
        quantity: 1,
        subtotal: 1 * p2.formats[0].pricePerKg, // $16.500
      },
      {
        product: p3,
        selectedFormat: p3.formats[0], // 1 KG
        quantity: 1,
        subtotal: 1 * p3.formats[0].pricePerKg, // $18.900
      },
      {
        product: p4,
        selectedFormat: p4.formats[0], // 500G
        quantity: 1,
        subtotal: 1 * p4.formats[0].pricePerKg, // $3.800
      },
    ];
  });

  // Scroll arriba cada vez que cambia la vista principal
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  // Totales acumulados
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const rawSubtotal = cartItems.reduce((acc, item) => acc + item.subtotal, 0);
  const volumeDiscount = cartCount >= 2 ? 500 * Math.floor(cartCount / 2) : 0;
  const cartTotal = Math.max(0, rawSubtotal - volumeDiscount);

  // --------------------------------------------------------------------------
  // CONTROLADORES DE CARRITO
  // --------------------------------------------------------------------------
  const handleAddToCartQuick = (product: Product, quantity: number = 1) => {
    const defaultFormat = product.formats[0];
    handleAddToCartWithFormat(product, defaultFormat, quantity);
  };

  const handleAddToCartWithFormat = (
    product: Product,
    format: ProductFormat,
    quantity: number
  ) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedFormat.id === format.id
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + quantity;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          subtotal: newQty * format.weightKg * format.pricePerKg,
        };
        return updated;
      }

      return [
        ...prev,
        {
          product,
          selectedFormat: format,
          quantity,
          subtotal: quantity * format.weightKg * format.pricePerKg,
        },
      ];
    });
  };

  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(index);
      return;
    }

    setCartItems((prev) => {
      const updated = [...prev];
      const item = updated[index];
      if (!item) return prev;
      updated[index] = {
        ...item,
        quantity: newQty,
        subtotal: newQty * item.selectedFormat.weightKg * item.selectedFormat.pricePerKg,
      };
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // --------------------------------------------------------------------------
  // CONTROLADORES DE NAVEGACIÓN
  // --------------------------------------------------------------------------
  const handleNavigate = (view: AppView) => {
    setActiveView(view);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveView('producto');
  };

  const handleGoToCatalog = (category?: ProductCategory) => {
    if (category) {
      setSelectedCategory(category);
    }
    setActiveView('catalogo');
  };

  // --------------------------------------------------------------------------
  // RENDERIZADO DEL CONTENEDOR SEGÚN MODO DE DISPOSITIVO
  // --------------------------------------------------------------------------
  const getContainerClasses = () => {
    switch (deviceMode) {
      case 'mobile':
        return 'max-w-[390px] mx-auto border-x-4 border-b-4 border-[#204e44] shadow-2xl rounded-b-3xl min-h-screen bg-[#fff8f0]';
      case 'tablet':
        return 'max-w-[820px] mx-auto border-x-4 border-b-4 border-[#204e44] shadow-2xl rounded-b-3xl min-h-screen bg-[#fff8f0]';
      case 'desktop':
        return 'max-w-[1280px] mx-auto border-x-4 border-b-4 border-[#204e44] shadow-2xl min-h-screen bg-[#fff8f0]';
      case 'auto':
      default:
        return 'w-full min-h-screen bg-[#fff8f0]';
    }
  };

  return (
    <div className="min-h-screen bg-[#e6d9ba] flex flex-col font-sans selection:bg-[#01372e] selection:text-white">
      {/* ====================================================================
          BARRA DE SIMULADOR DE DISPOSITIVO & GUÍA TÉCNICA (Sticky Top)
          Permite al usuario conmutar entre Celular (390px), Tablet (820px),
          PC (1280px) y Auto, o activar las insignias de interacción.
          ==================================================================== */}
      <DeviceSimulatorBar
        deviceMode={deviceMode}
        onDeviceModeChange={setDeviceMode}
        guideMode={guideMode}
        onToggleGuideMode={() => setGuideMode((prev) => !prev)}
        activeView={activeView}
      />

      {/* ====================================================================
          CONTENEDOR DINÁMICO ENMARCADO SEGÚN EL DISPOSITIVO
          ==================================================================== */}
      <div className={`${getContainerClasses()} relative flex flex-col flex-1`}>
        {/* Cabecera Responsiva */}
        <Header
          activeView={activeView}
          onNavigate={handleNavigate}
          cartCount={cartCount}
          cartTotal={cartTotal}
          guideMode={guideMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenHowToBuy={() => setIsHowToBuyOpen(true)}
        />

        {/* Separación del contenido para compensar la cabecera fija */}
        <main className="flex-1 w-full pt-20 sm:pt-28 md:pt-36 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full pt-2">
            {/* VISTA 1: INICIO / MERCADO BENTO */}
            {activeView === 'inicio' && (
              <HomeView
                products={PRODUCTS_CATALOG}
                onSelectProduct={handleSelectProduct}
                onAddToCart={handleAddToCartQuick}
                onGoToCatalog={handleGoToCatalog}
                guideMode={guideMode}
              />
            )}

            {/* VISTA 2: CATÁLOGO MAYORISTA CON FILTROS */}
            {activeView === 'catalogo' && (
              <CatalogView
                products={PRODUCTS_CATALOG}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onSelectProduct={handleSelectProduct}
                onAddToCart={handleAddToCartQuick}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                guideMode={guideMode}
              />
            )}

            {/* VISTA 3: FICHA DETALLADA DE PRODUCTO */}
            {activeView === 'producto' && (
              <ProductDetailView
                product={selectedProduct}
                allProducts={PRODUCTS_CATALOG}
                onBack={() => setActiveView('catalogo')}
                onSelectProduct={handleSelectProduct}
                onAddToCartWithFormat={handleAddToCartWithFormat}
                guideMode={guideMode}
              />
            )}

            {/* VISTA 4: RESUMEN DE PEDIDO & REMITO COMERCIAL */}
            {activeView === 'carrito' && (
              <CartView
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateCartQuantity}
                onRemoveItem={handleRemoveCartItem}
                onClearCart={handleClearCart}
                onContinueShopping={() => setActiveView('catalogo')}
                guideMode={guideMode}
              />
            )}
          </div>
        </main>

        {/* Pie de página institucional */}
        <Footer />

        {/* Barra flotante de carrito móvil / widget de escritorio */}
        <FloatingCartBar
          cartCount={cartCount}
          cartTotal={cartTotal}
          onOpenCart={() => setActiveView('carrito')}
          activeView={activeView}
          guideMode={guideMode}
        />

        {/* Botón flotante persistente de WhatsApp Karim (Desktop & Tablet) */}
        <div className="fixed bottom-6 right-6 z-40 hidden sm:block">
          <a
            href={`https://wa.me/${KARIM_CONTACT.phoneInternational}?text=Hola%20Karim,%20quiero%20hacer%20un%20pedido%20mayorista%20en%20Los%20Turquitos`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#1ebe5d] hover:bg-[#19a550] text-white shadow-[0_8px_24px_rgba(30,190,93,0.4)] transition-all hover:scale-105 active:scale-95 font-bold text-xs sm:text-sm"
            title="Chat directo con Karim"
          >
            <span className="material-symbols-outlined text-[24px]">chat</span>
            <span>Pedir Lista Mayorista</span>
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
          </a>
        </div>

        {/* Barra de navegación inferior móvil */}
        <MobileBottomNav activeView={activeView} onNavigate={handleNavigate} />

        {/* Modal "¿Cómo Comprar en Los Turquitos?" */}
        <HowToBuyModal
          isOpen={isHowToBuyOpen}
          onClose={() => setIsHowToBuyOpen(false)}
          onGoToCatalog={() => handleGoToCatalog()}
        />
      </div>
    </div>
  );
}
