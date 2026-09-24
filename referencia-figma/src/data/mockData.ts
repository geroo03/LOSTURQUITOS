/**
 * ============================================================================
 * ARCHIVO: src/data/mockData.ts
 * PROYECTO: Los Turquitos - Especiera Mayorista
 * ----------------------------------------------------------------------------
 * NOTA PARA CLAUDE / DESARROLLADOR:
 * Este archivo provee los datos maestros de catálogo, precios mayoristas en ARS,
 * imágenes reales provistas por el usuario y especificaciones de trazabilidad.
 *
 * ESTRUCTURA DE COMPONENTES QUE CONSUMEN ESTA FUENTE:
 * - HomeView: Lotes destacados y categorías bento.
 * - CatalogView: Grilla de 64 artículos con filtros y ordenamiento.
 * - ProductDetailView: Ficha técnica, selector de formatos (1/5/25kg) y cross-sell.
 * - CartView: Ítems pre-cargados para demostración interactiva inmediata.
 * ============================================================================
 */

import { Product, RemitoFormData } from '../types.ts';

/**
 * Avatar de perfil corporativo "Los Turquitos"
 */
export const BRAND_AVATAR_URL =
  'https://lh3.googleusercontent.com/aida/AEtjO1V5vKNIdLnHILy2xUpAcnZr4FLvSoYWzY82veJstSc6mYUm7J0TuORjxHmIyzlLhK8Dmh_CnZ0OTWnbX7liDY5Y8uLSC-h_WAr9hWcwLJoTEF68jAOMvVQpHi8efev7wmkv4YNnEjHjjv1Axe_73kwdlBbG8J3WRYNnuEg87WV7L1lH0ShDHcO0DvudZAdogdk3UHb-7cqZy_60H2G1L-CEn96l39lbB2RQpXehLyaWaIxTGWkm1hwX7X3VjRclGjAsMg6P_IOF';

/**
 * Datos del canal directo de atención con Karim
 */
export const KARIM_CONTACT = {
  name: 'Karim',
  role: 'Atención Comercial Mayorista',
  phoneDisplay: '+54 9 11 4055-8822',
  phoneInternational: '5491140558822',
  depositoAddress: 'Parque Patricios, CABA',
  expresoHubs: 'Villa Soldati & Pompeya',
  dispatchHours: 'Lunes a Viernes 07:00 a 16:00 hs | Sábados 07:00 a 12:30 hs',
  minOrderWholesale: 15000,
  minFreeDeliveryWholesale: 30000,
};

/**
 * Catálogo maestro de productos mayoristas
 */
export const PRODUCTS_CATALOG: Product[] = [
  {
    id: 'pimenton-dulce-alicante',
    sku: 'PIM-140-ALC',
    title: 'Pimentón Dulce Alicante Extra',
    shortSubtitle: 'Molienda criolla en frío · Grado 140 ASTA',
    category: 'alicante',
    categoryLabel: 'Condimentos Alicante',
    basePriceKg: 4900,
    suggestedMarginPct: 45,
    stockStatus: 'in_stock',
    stockAvailableKg: 1450,
    isBestSeller: true,
    unitMeasurement: '1 KG',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC0wXULi-DcKgqpbddtmBTqo5yKONpyJ5sa4dTZ0-SoqlwTNMszA14T7F0cZpgX0akEkvCN4hjzECwCTQE0oO8o7GXJC-dYxrS9kB9WyRX_p_inCwiRs2181M85ppgAe2O51mpkyplpCTVu9phCxeejLxyvKnBHSqRAJfk8csU7b_0aP5rgkX020k16OLLaVYZ1ktQOWio1ygrGZNV81CWDcOf6VNrLdW7lhssvwUNVVjPQ3WyHI78q',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCImT5plUWpNMUTs7JIgoWIU3tSuzV_rJuWRrK8kbhaFbdy0RIXdSq-zq_xQgIFLVAIxPt-D9yy2OuQvxW0xLnYa3cp2L8e1OqEJjeyv8UqhKBIvXeZYjWOQpU88kbj8osrTa_sQn3-WAcenWgkFJEmr8my8-kPm_2eTjdZejVQFNGttJ5vsrPvGNg8a9J-bDIxG-O7sE8AQeIWkR_uDHccKSp_20bncrJ6qeWs4F3b4lz99DwUdbzi',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAfG2jfd-kaOzvRMt1BNmJWCFIT7-POn8FF2-PxshJK10eEPQlGKE-1W3iY_n3Yuf11yD3WN0_10bx_gwEqN6lUVx1a8DASG7ANFIMTfZYf3A-Y9ahn3hwBrDp8VQFdny9vWMumfWucaPHbU0Hckrf4m5W5YFzWeapT7bPpVkZ9EyfyW8C_CL8LEvgEK1X2NjWReKElXjiLlOlEbilxjs1MGrD0iuq_B8CbOIAStsYPJLiK8xbo-MAf',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBAhIgv4qmpJ7lHU6BRXCxbpbxF3Q1UmqNSq9qPzR_smO0JDlTcUlwgWnZi0MyeiJDBu2BLl41K9YiYXHkjjWhSai-fy8pktypGMeFSyHRM8BjZo2qNLQKmna3mwcYcJaXpj3KXMGzekgkDD2AdFwmvpwxrN-5o1JmhmsJ44BRzDZhkPHtjFVcsgCKVO9MKNibgk7XM7CZY-h7jZpsoVI3pPYyvCGEy8ROOE1t52BMv3CMHdKt-2hh6',
    ],
    formats: [
      {
        id: 'fmt-1kg',
        name: 'Bolsa Kraft 1 KG',
        weightKg: 1,
        discountPct: 0,
        pricePerKg: 4900,
        description: 'Sellado tricapa hermético para fraccionado',
      },
      {
        id: 'fmt-5kg',
        name: 'Bolsón Mayorista 5 KG',
        weightKg: 5,
        discountPct: 10,
        pricePerKg: 4410,
        description: 'Pack de 5kg fraccionado con -10% de ahorro',
      },
      {
        id: 'fmt-25kg',
        name: 'Bolsa Origen 25 KG',
        weightKg: 25,
        discountPct: 20,
        pricePerKg: 3920,
        description: 'Saco cerrado cosido de fábrica con -20% de ahorro',
      },
    ],
    traceability: {
      origin: 'Cachi, Valles Calchaquíes (Salta)',
      culinaryUse: 'Empanadas salteñas, adobo de bondiolas, tucos y guisados',
      shelfLife: '18 meses de vida útil en envase cerrado hermético',
      targetChannel: 'Dietéticas, carnicerías, rotiserías y fraccionadores',
      harvestYear: 'Cosecha Seleccionada 2024',
      astaGrade: 'Grado 140 ASTA',
      lotNumber: 'SAL-2024-B12',
      senasaRne: '02-034811',
      senasaRnpa: '02-581903',
      purityPct: '100% Puro sin aditivos ni féculas',
    },
  },

  {
    id: 'comino-en-grano-puro',
    sku: 'COM-240-SJ',
    title: 'Comino en Grano Puro',
    shortSubtitle: 'Origen San Juan · 99.8% Pureza botánica',
    category: 'especias',
    categoryLabel: 'Especias Puras',
    basePriceKg: 16500,
    suggestedMarginPct: 40,
    stockStatus: 'in_stock',
    stockAvailableKg: 820,
    unitMeasurement: '1 KG',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAj-tdP1NFarW6wH-yHKEt4BkN9bXLxvd0YS5nCi_g_9ZQML7sqKZFBGBQFnhPjKhhLAaurOI3krC94-lgj0nx0AXxScCirGgnTSbIduBC4PAYAfDs3YkO9JvzHQME0jF90_TncjegTFGZZntH_StVabhYHG_WlGuBu3bsDQRzqsrEQJGJLAS1pYC38BSUhh6-YQck-JOhfIc5q8lr-6GJOPDEnAofbGrCvpFcQCDxAzrNmnp4W47LN',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD-gRzxjlowYEIaNh-eNDwpMV7fBdL7Dlm5aYISEoT4rsvdKrQ-_cag7kzOzHzaWM9vacov_xnCIiquCkWmRUkO1PihoZ0nzX8sR92_zy0o_y4hauL6FfWr6YG2_oytF7--mr2rzZA4yd79zM6NZN0lgdMr8wGhtV0CktLyFrz5sE5oBG9wrFkk3mAHjfAYJ9BmRSQlg7HHZK7QfKfl-NCxslFPE6Ek_G260j-pVDX3K90-0DNnRRfX',
    ],
    formats: [
      {
        id: 'fmt-1kg',
        name: 'Bolsa 1 KG',
        weightKg: 1,
        discountPct: 0,
        pricePerKg: 16500,
        description: 'Fraccionado limpio sin tallos',
      },
      {
        id: 'fmt-5kg',
        name: 'Bolsón 5 KG',
        weightKg: 5,
        discountPct: 8,
        pricePerKg: 15180,
        description: 'Bolsón para rotiserías y pymes cárnicas',
      },
      {
        id: 'fmt-25kg',
        name: 'Saco 25 KG',
        weightKg: 25,
        discountPct: 15,
        pricePerKg: 14025,
        description: 'Saco de arpillera cerrado de origen',
      },
    ],
    traceability: {
      origin: 'Jáchal / Calingasta, San Juan',
      culinaryUse: 'Relleno de empanadas tradicionales, locro y adobos',
      shelfLife: '24 meses protegido de la luz directa',
      targetChannel: 'Pymes alimenticias, fábricas de pastas y dietéticas',
      lotNumber: 'CM-240-SJ',
      purityPct: '99.8% Semilla entera seleccionada',
    },
  },

  {
    id: 'pimienta-negra-en-grano',
    sku: 'PIM-550-BR',
    title: 'Pimienta Negra en Grano',
    shortSubtitle: 'Calidad Brasil 550 g/l · Grano parejo',
    category: 'especias',
    categoryLabel: 'Especias Puras',
    basePriceKg: 27400,
    suggestedMarginPct: 50,
    stockStatus: 'in_stock',
    stockAvailableKg: 640,
    unitMeasurement: '1 KG',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCKa5XRvJJBj4qt0j5BTXKFzehUgK5YpZMcgm_gB0vnZoGqrgQJMXeoPvo4IS3tNhHPFlBkQwCZDpxsky2LO78VVNDIX4uWLtfBUfOJ3i8IylJK5MjN72C3TdjkFnV544Akui3p3UGOprRVd7UYRCigVKcQpA5Rqcb_hyLY_4qQy98eMl7q47VCUJwdT-0OvVKijugNwVD7RURehcXIFNnodLgU9YvOpk9J7FHq8eemOW3QU6OV93SH',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAXS7TjCfzJ4zmKysVvBo2tFDi1sXarPathGFxHhBMfgTT3gPuhOPIo2ctE6Eo2k6ex18Ib2k8oIZwwK5EXB7BKa5CIEja6V-tzrnjS7eKrYbPoCmDJuAzY_m0DThZR_z8Fmi_Ju-_uq1WLGRGgS-fVPBRr18NPC28QvIRwi9WDmZK0vw-dVqs-HlvKHANWvKGyURhLKEXXeM6dqtDr1UheCJ4vuu-SmTxPdtYwk07felfN19HbGzkX',
    ],
    formats: [
      {
        id: 'fmt-1kg',
        name: 'Bolsa 1 KG',
        weightKg: 1,
        discountPct: 0,
        pricePerKg: 27400,
        description: 'Bolsa termosellada de 1 kilo',
      },
      {
        id: 'fmt-5kg',
        name: 'Bolsón 5 KG',
        weightKg: 5,
        discountPct: 10,
        pricePerKg: 24660,
        description: 'Pack mayorista de 5 kilos',
      },
      {
        id: 'fmt-25kg',
        name: 'Saco 25 KG',
        weightKg: 25,
        discountPct: 18,
        pricePerKg: 22468,
        description: 'Bolsa de polipropileno trilaminada de importación',
      },
    ],
    traceability: {
      origin: 'Pará / Espírito Santo, Brasil',
      culinaryUse: 'Molienda en fresco, chacinados premium y salsas',
      shelfLife: '36 meses en grano entero',
      targetChannel: 'Fraccionadores, distribuidores y gastronomía',
      lotNumber: 'PN-881-BR',
      purityPct: 'Piperina alta >5.5%',
    },
  },

  {
    id: 'mix-premium-frutos-secos',
    sku: 'MIX-504-PRM',
    title: 'Mix Premium Frutos Secos',
    shortSubtitle: 'Sin maní · Almendras, nueces, castañas y pasas',
    category: 'frutos-secos',
    categoryLabel: 'Frutos Secos',
    basePriceKg: 18900,
    suggestedMarginPct: 42,
    stockStatus: 'in_stock',
    stockAvailableKg: 950,
    isSpecialOffer: true,
    unitMeasurement: '1 KG',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAAS9bsgecXnZ55YHLPqwLMI6KGiMAf6i_QdHbEcvRmuMPq9LlJJsxzniLpiz4MYVdvgAO3xme86TFi92Ysyrh3ZZwYfV01lUy3U67CU4PEgueE0qEtD3PH3NL0llcyNky5y0UTWk2A9Tg8JX2p04e5NW4WRobBp9NrK3SaGhV_vZdPCihniZIKGuiAB9zMB1DVJGRzLTQnRQjt9b_552l7NfSxKubbVFR0X0dhXhxU6HsIcX7USb8w',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBibENiapp06u759mDitmEyZwIWOghq9rVMeGYyACaTghVSPk0bEQsA1NYSd6eJvfkbtcg5ULDulLrdzhlpRyyY019L8xzThuqH7DnWtgFYoO9HdF0WpFFvBrXsWiE2Sv34yeAw4amvGOMlt-gVvpWrGKZwKDy7b2rKzeUuuJvY0oWdzheG3gUCDVzv66QBpVw_NVTC6N6vRdLZhfCa0tA1lJDyeWypWrLhhVYTzU8xqbg-rgV_rQcR',
    ],
    formats: [
      {
        id: 'fmt-1kg',
        name: 'Bolsa 1 KG',
        weightKg: 1,
        discountPct: 0,
        pricePerKg: 18900,
        description: 'Fraccionado en bolsa de alta densidad',
      },
      {
        id: 'fmt-5kg',
        name: 'Caja 5 KG',
        weightKg: 5,
        discountPct: 7,
        pricePerKg: 17577,
        description: 'Caja protegida contra rotura de mariposas',
      },
      {
        id: 'fmt-10kg',
        name: 'Caja 10 KG',
        weightKg: 10,
        discountPct: 12,
        pricePerKg: 16632,
        description: 'Presentación para dietéticas de alto movimiento',
      },
    ],
    traceability: {
      origin: 'Mendoza / Catamarca / Importado',
      culinaryUse: 'Consumo directo saludable, repostería y granolas',
      shelfLife: '12 meses en lugar fresco (<20°C)',
      targetChannel: 'Dietéticas, bares saludables y quioscos gourmet',
      lotNumber: 'MX-504-PRM',
      purityPct: 'Cero aditivos, sin maní como relleno',
    },
  },

  {
    id: 'mani-sin-sal-tostado',
    sku: 'MAN-112-CBA',
    title: 'Maní sin Sal Tostado (Runner)',
    shortSubtitle: 'Calibre 38/42 de Córdoba · Tostado seco sin aceite',
    category: 'frutos-secos',
    categoryLabel: 'Frutos Secos',
    basePriceKg: 3200,
    suggestedMarginPct: 55,
    stockStatus: 'in_stock',
    stockAvailableKg: 3200,
    unitMeasurement: '1 KG',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC3gTKbd0s7f85Hb_CtLLqFTW5SMfpF4qlviYvUy0sgkjoP7rmvMw4XC7kL04goE1tKYBmwJUgvJuefB0Rcso4v4FMw9BFUSoJUpNGi4o0gtSI1WjZUh3S1yM1BtuPnIDMx5uk8NTLgCymTBY8WuPVOLLFzelmhgxvHTHm5Od8lg2Bkm_x7UjNrAQUb_ieI4mQ6Ih2Libf6RC0f2SbaQvO2In30deitAgIayqnLnRySYAYmBeyNdIug',
    ],
    formats: [
      {
        id: 'fmt-1kg',
        name: 'Bolsa 1 KG',
        weightKg: 1,
        discountPct: 0,
        pricePerKg: 3200,
        description: 'Bolsa de 1 kg fraccionada',
      },
      {
        id: 'fmt-5kg',
        name: 'Bolsón 5 KG',
        weightKg: 5,
        discountPct: 8,
        pricePerKg: 2944,
        description: 'Bolsón para cervecerías y kioscos',
      },
      {
        id: 'fmt-25kg',
        name: 'Saco 25 KG',
        weightKg: 25,
        discountPct: 15,
        pricePerKg: 2720,
        description: 'Saco arpillera de exportación Córdoba',
      },
    ],
    traceability: {
      origin: 'General Cabrera / Río Cuarto, Córdoba',
      culinaryUse: 'Copetín, mantequilla de maní natural y panificación',
      shelfLife: '9 meses conservado en frío',
      targetChannel: 'Cervecerías, dietéticas, fiambrerías y mayoristas',
      lotNumber: 'MN-112-CBA',
      purityPct: 'Tostado uniforme al horno sin sal',
    },
  },

  {
    id: 'harina-de-almendras-pura',
    sku: 'HAR-703-ALM',
    title: 'Harina de Almendras 100% Pura',
    shortSubtitle: 'Molienda extra fina desgrasada · Apta Keto & Celiacos',
    category: 'semillas-harinas',
    categoryLabel: 'Semillas y Harinas',
    basePriceKg: 14500,
    suggestedMarginPct: 48,
    stockStatus: 'in_stock',
    stockAvailableKg: 500,
    unitMeasurement: '1 KG',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBFNvqKQbCgqmfADzIRhatUuCD4PCsmEsqOvr0zBc8Div0gPVHY73luvfzehpoIxp_MBpB4EHhoM0OXAW7PbfkNkgyZIM3Rg4BiuW96LcoMFA0VuGrR9wwB9qZSzme-ho8miWo2SE4Y8tLDfuCa2y7YG2zRaWvi8CdZq4W5EmM4vFf6AOX1nxlM2xB4CwYRhpIu7gjCcSWtfKMC2iKxV1HK9CmGgiqQPSkEFMRge20toviSXnOfJsQO',
    ],
    formats: [
      {
        id: 'fmt-1kg',
        name: 'Bolsa 1 KG',
        weightKg: 1,
        discountPct: 0,
        pricePerKg: 14500,
        description: 'Sellado al vacío para máxima frescura de aroma',
      },
      {
        id: 'fmt-5kg',
        name: 'Caja 5 KG',
        weightKg: 5,
        discountPct: 10,
        pricePerKg: 13050,
        description: 'Pack de 5 bolsas termoselladas',
      },
      {
        id: 'fmt-20kg',
        name: 'Saco 20 KG',
        weightKg: 20,
        discountPct: 18,
        pricePerKg: 11890,
        description: 'Bolsa con film interior barrera de oxígeno',
      },
    ],
    traceability: {
      origin: 'Mendoza (Almendras Nonpareil seleccionadas)',
      culinaryUse: 'Macarons, panificados sin gluten y pastelería fina',
      shelfLife: '8 meses en lugar fresco y seco',
      targetChannel: 'Pastelerías, dietéticas y fábricas sin TACC',
      lotNumber: 'HA-703-ALM',
      purityPct: '100% Almendra pelada y molida',
    },
  },

  {
    id: 'aceitunas-verdes-carozo-n1',
    sku: 'ACE-332-ARAU',
    title: 'Aceitunas Verdes c/ Carozo N°1',
    shortSubtitle: 'Cosecha mendocina · Calibre grande en salmuera pura',
    category: 'conservas',
    categoryLabel: 'Aceitunas y Conservas',
    basePriceKg: 3800,
    suggestedMarginPct: 40,
    stockStatus: 'in_stock',
    stockAvailableKg: 1200,
    unitMeasurement: '500G',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBGJhhDs4qlA32SeagwmeqVKMGlW061kZQ_R7NSi3PT0gHSq7Mpk_mvJ2EMtE6QPe5LuCZWL3NWOHQiQR3FtVQSqcF5u_Sx_bmi2equUGKFPrn7AOpJLEPAkfe4fBEBCZGBF_Mzn8Abf5ZLsPn3AYtD62OTr4YoaaT3GWvetnF9cqwcFtbg3StKLVTHRp7SazzN6JG8pRIU1QYCSplrT2eQgGP-IJRybMlLjnb9gPgrOgBm_D4pwMov',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAIZJEHtl-F9I1dpbcynkLvcyFZl7ZtO9WAjgtnaZeZG9GhPh1kvE_P1RKiXOEMeqY_n_jPSC8dCka5dCyxYy6_pX-grQH7VOZWiRlJ79hi_1ztBwDIGDnN_6KQhsOTu6ou4B8JgR3TWAIs4DiRXuo7KGtulOfQ3duHMzkkSkmkbCencmKoPQ6LqwD6K53kFBw2FCsPGIY-UlpqulTXWVox8ivj96q9JQ3gEyTYfBiDgLirV9XYrb4w',
    ],
    formats: [
      {
        id: 'fmt-500g',
        name: 'Pouch 500 G',
        weightKg: 0.5,
        discountPct: 0,
        pricePerKg: 3800,
        description: 'Fraccionado para reventa rápida',
      },
      {
        id: 'fmt-5kg',
        name: 'Balde 5 KG (Drenado)',
        weightKg: 5,
        discountPct: 12,
        pricePerKg: 3344,
        description: 'Balde plástico hermético con manija',
      },
      {
        id: 'fmt-10kg',
        name: 'Balde 10 KG',
        weightKg: 10,
        discountPct: 18,
        pricePerKg: 3116,
        description: 'Presentación gastronómica para pizzerías',
      },
    ],
    traceability: {
      origin: 'San Rafael / Lavalle, Mendoza',
      culinaryUse: 'Pizzerías, rotiserías, picadas y venta al peso',
      shelfLife: '12 meses en salmuera',
      targetChannel: 'Pizzerías, fiambrerías y rotiserías',
      lotNumber: 'AC-332-ARAU',
      purityPct: 'Variedad Arauco carnosa',
    },
  },

  {
    id: 'nuez-chandler-mariposa-blanca',
    sku: 'NUE-205-UCO',
    title: 'Nuez Chandler Mariposa Blanca',
    shortSubtitle: 'Cosecha nueva Valle de Uco · Extra Blanca Mendoza',
    category: 'frutos-secos',
    categoryLabel: 'Frutos Secos',
    basePriceKg: 21000,
    suggestedMarginPct: 38,
    stockStatus: 'out_of_stock',
    stockAvailableKg: 0,
    unitMeasurement: '1 KG',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAAWwwFcXB5m_LTCm0i53BWgqxf5BrfhzLucbgbkpb5ngbutSzK2dhCMwRtAJAV_FwN0yuCJgD2-axEfHnkKjpvf_JFAtvtqEXAitXjc81BJM2fQ28lvL71O5sAp_ETmlqhnbTtxze5pU_SXIJxevg-KpOsYMcno_hat6EoHZ2mGGn_2kHUNPWGrMcP4eCdREyttK9uCzdXgNBF_WnxpquwgFkLb0EOUyN-rXIo-E7mHuxzs1RAU2-W',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAfd6BGC-ZyYXTHj_bfJyQQfk0d0kgSOPduhoy-nrOlQdPml77anc2Ia4BcdTOHsebMaYMSXq4awrKIjfUJCeBhBnFfzLHSnT6XLiI1c3S5M9MbWFTpprvF2t3wOU3DwikA2-shOaTFe6T_wzEPnXTbaa_EtoeKBFjlpiQhTH7dbzD7FICBit6c7xAM9GHnuHW7vdGimFXBLon55_9_J39-bSyR7fadQuGj-U46KsVFITSQsYC4P41m',
    ],
    formats: [
      {
        id: 'fmt-1kg',
        name: 'Bolsa 1 KG',
        weightKg: 1,
        discountPct: 0,
        pricePerKg: 21000,
        description: 'Bolsa de 1 kg seleccionada',
      },
      {
        id: 'fmt-5kg',
        name: 'Caja 5 KG',
        weightKg: 5,
        discountPct: 8,
        pricePerKg: 19320,
        description: 'Caja con separadores antigolpe',
      },
      {
        id: 'fmt-10kg',
        name: 'Caja 10 KG',
        weightKg: 10,
        discountPct: 15,
        pricePerKg: 17850,
        description: 'Caja cerrada de exportación',
      },
    ],
    traceability: {
      origin: 'Tupungato, Valle de Uco (Mendoza)',
      culinaryUse: 'Gourmet, dietéticas y bombonerías',
      shelfLife: '10 meses en cámara seca',
      targetChannel: 'Comercios de delicatessen y dietéticas',
      lotNumber: 'NZ-909-UCO',
      purityPct: 'Mariposa 80/20 extra blanca sin cáscara',
    },
  },

  {
    id: 'aji-molido-especial-cachi',
    sku: 'AJI-415-CACHI',
    title: 'Ají Molido Especial Cachi',
    shortSubtitle: 'Picor medio · Color vivo y aroma tostado natural',
    category: 'especias',
    categoryLabel: 'Especias Puras',
    basePriceKg: 5150,
    suggestedMarginPct: 45,
    stockStatus: 'in_stock',
    stockAvailableKg: 1100,
    unitMeasurement: '1 KG',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDMRpXK46tDzwRrx4du_dnedh4sjzUivJ8EqnVTkbka5G5SaIjH3DUGi4asZuFYD5sl0HrkQknTWKgNYaRs8Hq4lXswlomq6rVVmPe066Y2VKNbIBUmMg4sHQXbMzltSlsw4KpHSRPIoxrBK33Zs_Q_4GW0_U7KB5oXB5_rpqwYJkisJ5GKQddZ6zOL2wQMAiSrxoWn9_NUbeMoLEjc6qPOA7xzVUXjV5B7RZSl6cNt1U4Eq9anuu6s',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA7jaROJll-6FMMMFYNCvLlHx4LF8AtPaowV2mvjURSQ1wehHyr91JFYdqPzoe13SZYEVxKVF3zgb2bND1likezQoQE6kq3HNRLjrvmTbUm7-ChFLpucdK3QCmPuzXJxIKG4hlrEwGqZcLggK7WevS17f4CHzY-Ab10gcWo1F7FRJTiFSGeMmEH73pskIoaHiBm-K3actejYiTAjs6ct9hJtnOChKq7FH-eu9Ie47QIPxJ-wKBhlnEZ',
    ],
    formats: [
      {
        id: 'fmt-1kg',
        name: 'Bolsa 1 KG',
        weightKg: 1,
        discountPct: 0,
        pricePerKg: 5150,
        description: 'Fraccionado puro sin semillas de relleno',
      },
      {
        id: 'fmt-5kg',
        name: 'Bolsón 5 KG',
        weightKg: 5,
        discountPct: 10,
        pricePerKg: 4635,
        description: 'Bolsón para parrillas y chimichurri',
      },
      {
        id: 'fmt-25kg',
        name: 'Bolsa 25 KG',
        weightKg: 25,
        discountPct: 20,
        pricePerKg: 4120,
        description: 'Saco industrial de molienda fresca',
      },
    ],
    traceability: {
      origin: 'Valles Calchaquíes, Salta',
      culinaryUse: 'Chimichurri argentino, choripán y adobo criollo',
      shelfLife: '18 meses',
      targetChannel: 'Parrillas, chacinadores y carnicerías',
      lotNumber: 'AJ-415-SLT',
      purityPct: 'Secado tradicional al sol sin humo artificial',
    },
  },

  {
    id: 'oregano-despalillado-especial',
    sku: 'ORE-015-MZA',
    title: 'Orégano Despalillado Especial',
    shortSubtitle: '98% libre de palillos · Aroma penetrante de montaña',
    category: 'especias',
    categoryLabel: 'Especias Puras',
    basePriceKg: 3850,
    suggestedMarginPct: 50,
    stockStatus: 'in_stock',
    stockAvailableKg: 1800,
    unitMeasurement: '1 KG',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCVOhLxaMBJYe1ssgAhvgn1B4B_haId9ROuoH5OwBATXrIi9G9YuTphGKo37LqBmNAU5GY4Ywq_4kxgiI-XK1FSW9vSGpy6dTckxW_402H093jbI4gcP3jjBH3iiR_ghY0BEUesmpS0dB9hnQJS2xIZAwXhu4Y5BUXbGW3puJ3V6usT8V7hjVqDbhY1xi8Ri1uR5qC7lqMl6tdauinuvYk64gwVNpErNLhqFjj0W8LWOK4TVxayCtQh',
    ],
    formats: [
      {
        id: 'fmt-1kg',
        name: 'Bolsa 1 KG',
        weightKg: 1,
        discountPct: 0,
        pricePerKg: 3850,
        description: 'Bolsa 1 kg termosellada',
      },
      {
        id: 'fmt-10kg',
        name: 'Bolsón 10 KG',
        weightKg: 10,
        discountPct: 12,
        pricePerKg: 3388,
        description: 'Bolsón de arpillera plástica para pizzerías',
      },
    ],
    traceability: {
      origin: 'San Carlos, Mendoza',
      culinaryUse: 'Pizzerías, salsas de tomate, empanadas y pastas',
      shelfLife: '24 meses protegido de la humedad',
      targetChannel: 'Pizzerías y casas de empanadas',
      lotNumber: 'OR-015-MZA',
      purityPct: 'Despalillado mecánico 98%',
    },
  },
];

/**
 * Datos iniciales para el formulario de Remito de compra
 */
export const INITIAL_REMITO_FORM: RemitoFormData = {
  fullNameOrBusiness: 'Almacén Don Tomás',
  whatsappPhone: '11 6290 4412',
  locationOrExpress: 'San Martín, Buenos Aires (o Expreso Cruz del Sur)',
  deliveryMethod: 'envio',
  specialNotes: 'Fraccionar el Pimentón en bolsas de 500g si es posible, gracias!',
};
