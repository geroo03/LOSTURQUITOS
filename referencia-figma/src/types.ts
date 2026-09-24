/**
 * ============================================================================
 * ARCHIVO: src/types.ts
 * PROYECTO: Los Turquitos - Especiera Mayorista
 * ----------------------------------------------------------------------------
 * NOTA PARA CLAUDE / DESARROLLADOR:
 * Este archivo centraliza todas las definiciones de tipos de datos de la plataforma:
 * - Productos con especificaciones de lote, origen, molienda y grado ASTA.
 * - Formatos de despacho mayorista (1kg, bolsón 5kg, bolsa cerrada 25kg) con descuentos.
 * - Estado del carrito de compras y datos para el remito comercial de Karim.
 * - Modos de visualización responsiva (Celular, Tablet, PC, Auto).
 * ============================================================================
 */

/**
 * Categorías principales de productos en Los Turquitos
 */
export type ProductCategory =
  | 'todos'
  | 'destacados'
  | 'alicante'
  | 'frutos-secos'
  | 'especias'
  | 'conservas'
  | 'semillas-harinas';

/**
 * Formato comercial de venta al por mayor
 */
export interface ProductFormat {
  id: string;
  name: string;
  weightKg: number;
  discountPct: number; // Porcentaje de descuento por volumen (ej: 0%, 10%, 20%)
  pricePerKg: number;  // Precio unitario por kilo con descuento aplicado
  description: string; // Ej: "Bolsa Kraft sellada", "Bolsón fraccionado", "Saco cosido origen"
}

/**
 * Trazabilidad técnica y fitosanitaria del lote
 */
export interface ProductTraceability {
  origin: string;              // Ej: "Cachi, Valles Calchaquíes (Salta)"
  culinaryUse: string;         // Ej: "Empanadas salteñas, adobos, guisados"
  shelfLife: string;           // Ej: "18 meses en envase hermético"
  targetChannel: string;       // Ej: "Dietéticas, carnicerías, rotiserías"
  harvestYear?: string;        // Ej: "Cosecha Seleccionada 2024"
  astaGrade?: string;          // Ej: "Grado 140 ASTA"
  lotNumber: string;           // Ej: "SAL-2024-B12"
  senasaRne?: string;          // Registro Nacional de Establecimiento
  senasaRnpa?: string;         // Registro Nacional de Producto Alimenticio
  purityPct?: string;          // Ej: "100% Puro sin aditivos"
}

/**
 * Entidad de Producto Mayorista
 */
export interface Product {
  id: string;
  sku: string;
  title: string;
  shortSubtitle: string;
  category: ProductCategory;
  categoryLabel: string;
  basePriceKg: number;         // Precio base por 1 kg sin IVA
  suggestedMarginPct: number;  // Margen de reventa sugerido (ej: 45%)
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  stockAvailableKg: number;
  images: string[];            // Lista de URLs de alta resolución
  formats: ProductFormat[];    // Formatos de despacho (1kg, 5kg, 25kg)
  traceability: ProductTraceability;
  isBestSeller?: boolean;
  isSpecialOffer?: boolean;
  unitMeasurement: '1 KG' | '5 KG' | '25 KG' | '500G';
}

/**
 * Ítem dentro del Carrito / Remito
 */
export interface CartItem {
  product: Product;
  selectedFormat: ProductFormat;
  quantity: number;            // Cantidad de bultos
  subtotal: number;            // quantity * format.weightKg * format.pricePerKg
}

/**
 * Formulario para el Remito Mayorista enviado a Karim
 */
export interface RemitoFormData {
  fullNameOrBusiness: string;  // Nombre y Apellido / Razón Social (ej: "Almacén Don Tomás")
  whatsappPhone: string;       // Teléfono de WhatsApp (ej: "11 6290 4412")
  locationOrExpress: string;   // Localidad / Expreso habitual (ej: "San Martín, Buenos Aires")
  deliveryMethod: 'deposito' | 'envio'; // 'deposito' = Retiro Parque Patricios; 'envio' = Expreso Soldati/Pompeya
  specialNotes: string;        // Aclaraciones (ej: "Fraccionar en bolsas de 500g")
}

/**
 * Vistas de navegación dentro de la app
 */
export type AppView = 'inicio' | 'catalogo' | 'producto' | 'carrito' | 'como-comprar';

/**
 * Modos de simulación de dispositivo para desarrollo y evaluación
 * - 'auto': Fluido responsivo real según el tamaño de pantalla del navegador
 * - 'mobile': Marco de Celular (390px)
 * - 'tablet': Marco de Tablet (820px)
 * - 'desktop': Marco de PC (1280px+)
 */
export type DeviceViewMode = 'auto' | 'mobile' | 'tablet' | 'desktop';
