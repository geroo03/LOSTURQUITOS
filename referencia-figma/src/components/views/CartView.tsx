/**
 * ============================================================================
 * COMPONENTE: src/components/views/CartView.tsx
 * PROYECTO: Los Turquitos - Especiera Mayorista
 * ----------------------------------------------------------------------------
 * NOTA PARA CLAUDE / DESARROLLADOR:
 * Vista de Resumen de Pedido y Remito Mayorista:
 *
 * RESPONSABILIDADES:
 * 1. Desglose pormenorizado de los bultos encargados con steppers para sumar/restar
 *    o eliminar renglones de mercadería.
 * 2. Cálculo financiero:
 *    - Subtotal bruto.
 *    - Descuento por bulto cerrado (-$500 por cada bulto adicional tras superar umbral).
 *    - Total neto estimado (*Sujeto a pesada final en báscula).
 * 3. Indicador de superación de mínimo mayorista ($15.000 y flete bonificado).
 * 4. Formulario de Datos para el Remito de Karim:
 *    - Nombre / Razón Social.
 *    - Teléfono WhatsApp.
 *    - Localidad y Expreso habitual en Villa Soldati o Pompeya.
 *    - Alternador de modalidad: Retiro en depósito vs Envío a coordinar.
 *    - Notas especiales (fraccionamiento, horarios de recepción).
 * 5. Generador Dinámico de Mensaje para WhatsApp:
 *    Arma el texto exacto con emojis, lista de productos, kilos, subtotal y
 *    datos del cliente para enviar directamente a Karim en un clic sin tipear nada.
 * ============================================================================
 */

import React, { useState } from 'react';
import { CartItem, RemitoFormData } from '../../types.ts';
import { KARIM_CONTACT, INITIAL_REMITO_FORM } from '../../data/mockData.ts';
import { InteractiveIndicator } from '../InteractiveIndicator.tsx';

interface CartViewProps {
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  onContinueShopping: () => void;
  guideMode: boolean;
}

export const CartView: React.FC<CartViewProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onContinueShopping,
  guideMode,
}) => {
  // Formulario del cliente para el remito comercial
  const [formData, setFormData] = useState<RemitoFormData>(INITIAL_REMITO_FORM);

  // Cálculos reactivos de totales
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalWeightKg = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.selectedFormat.weightKg,
    0
  );

  const subtotalRaw = cartItems.reduce((acc, item) => acc + item.subtotal, 0);

  // Bonificación por bultos cerrados
  const volumeDiscount = totalItemsCount >= 2 ? 500 * Math.floor(totalItemsCount / 2) : 0;
  const totalEstimated = Math.max(0, subtotalRaw - volumeDiscount);

  const isMinSuperado = totalEstimated >= KARIM_CONTACT.minOrderWholesale;

  // Generador de mensaje estructurado para WhatsApp
  const generateWhatsAppMessage = () => {
    let msg = `*PEDIDO MAYORISTA - LOS TURQUITOS*\n`;
    msg += `------------------------------------\n`;
    msg += `👤 *Cliente:* ${formData.fullNameOrBusiness}\n`;
    msg += `📱 *WhatsApp:* +54 9 ${formData.whatsappPhone}\n`;
    msg += `📍 *Destino/Expreso:* ${formData.locationOrExpress}\n`;
    msg += `🚚 *Modalidad:* ${
      formData.deliveryMethod === 'deposito'
        ? 'Retiro por Depósito Parque Patricios'
        : 'Envío a Expreso / Coordinar'
    }\n`;
    if (formData.specialNotes.trim()) {
      msg += `📝 *Aclaraciones:* ${formData.specialNotes}\n`;
    }
    msg += `------------------------------------\n`;
    msg += `*DETALLE DE MERCADERÍA:*\n`;

    cartItems.forEach((item, idx) => {
      const lineKg = item.quantity * item.selectedFormat.weightKg;
      msg += `${idx + 1}. ${item.product.title}\n`;
      msg += `   • ${item.quantity} bulto(s) x ${item.selectedFormat.name} (${lineKg} KG)\n`;
      msg += `   • Subtotal: $${item.subtotal.toLocaleString('es-AR')}\n`;
    });

    msg += `------------------------------------\n`;
    msg += `⚖️ *Peso total aprox:* ${totalWeightKg} KG\n`;
    msg += `💵 *Subtotal bruto:* $${subtotalRaw.toLocaleString('es-AR')}\n`;
    if (volumeDiscount > 0) {
      msg += `🏷️ *Descuento bulto cerrado:* -$${volumeDiscount.toLocaleString('es-AR')}\n`;
    }
    msg += `💰 *TOTAL ESTIMADO:* $${totalEstimated.toLocaleString('es-AR')} (+ IVA si aplica)\n\n`;
    msg += `Hola Karim, te paso este listado para verificar stock y coordinar la entrega. ¡Muchas gracias!`;

    return encodeURIComponent(msg);
  };

  const whatsappOrderUrl = `https://wa.me/${KARIM_CONTACT.phoneInternational}?text=${generateWhatsAppMessage()}`;

  return (
    <div className="flex flex-col gap-5 sm:gap-6 pb-20 max-w-3xl mx-auto w-full">
      {/* ====================================================================
          1. ENCABEZADO DE REMITO & BOTÓN VACIAR
          ==================================================================== */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-[#01372e] text-[24px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            shopping_bag
          </span>
          <h1 className="font-serif text-xl sm:text-2xl text-[#01372e] font-bold">
            Tu Pedido Mayorista
          </h1>
        </div>

        {cartItems.length > 0 && (
          <InteractiveIndicator
            label="Vaciar Carrito"
            devices={['celular', 'tablet', 'pc']}
            actionDesc="Limpia todos los productos del pedido actual con confirmación previa"
            isActive={guideMode}
          >
            <button
              type="button"
              onClick={() => {
                if (window.confirm('¿Deseas vaciar todos los ítems de tu pedido mayorista?')) {
                  onClearCart();
                }
              }}
              className="text-[#842401] hover:text-[#5d1700] text-xs sm:text-sm font-semibold flex items-center gap-1 transition-colors py-1 px-2 rounded-lg hover:bg-[#faedcd]"
            >
              <span className="material-symbols-outlined text-[18px]">remove_shopping_cart</span>
              <span>Vaciar carrito</span>
            </button>
          </InteractiveIndicator>
        )}
      </div>

      {/* ====================================================================
          2. BANNER DE BENEFICIO MAYORISTA
          ==================================================================== */}
      {isMinSuperado ? (
        <div className="bg-[#c8e6dd] text-[#04201a] rounded-2xl p-4 flex items-center gap-3.5 shadow-sm border border-[#a0d0c3]">
          <div className="w-10 h-10 rounded-xl bg-[#01372e] text-[#ffffff] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">verified</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-[#01372e] leading-snug">
              ¡Superaste el mínimo mayorista!
            </p>
            <p className="text-xs text-[#314c45] mt-0.5">
              Envío bonificado a coordinar con expreso o entrega directa en depósito central de Parque Patricios.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-[#faedcd] text-[#211b08] rounded-2xl p-4 flex items-center gap-3.5 border border-[#efe1c2]">
          <span className="material-symbols-outlined text-[#842401] text-[24px]">info</span>
          <div className="flex-1 text-xs">
            <span className="font-bold text-[#01372e]">Mínimo mayorista: ${KARIM_CONTACT.minOrderWholesale.toLocaleString('es-AR')}</span>
            <p className="text-[#404846] mt-0.5">
              Sumá ${(KARIM_CONTACT.minOrderWholesale - totalEstimated).toLocaleString('es-AR')} más para completar el pedido.
            </p>
          </div>
        </div>
      )}

      {/* ====================================================================
          3. LISTA DE ÍTEMS DEL PEDIDO
          ==================================================================== */}
      {cartItems.length === 0 ? (
        <div className="bg-[#ffffff] rounded-2xl p-10 text-center border border-[#efe1c2] flex flex-col items-center justify-center gap-3">
          <span className="material-symbols-outlined text-[48px] text-[#707976]">shopping_basket</span>
          <h3 className="font-serif text-lg font-bold text-[#01372e]">
            Tu pedido está actualmente vacío
          </h3>
          <p className="text-xs text-[#404846] max-w-sm">
            Explorá el catálogo de condimentos, frutos secos y semillas para sumar bultos o kilos al remito.
          </p>
          <button
            type="button"
            onClick={onContinueShopping}
            className="mt-2 px-5 py-2.5 bg-[#01372e] hover:bg-[#1f4e44] text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
          >
            Ir al Catálogo Mayorista
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {cartItems.map((item, index) => (
            <div
              key={`${item.product.id}-${item.selectedFormat.id}`}
              className="bg-[#ffffff] rounded-2xl p-3.5 sm:p-4 border border-[#efe1c2] shadow-sm flex items-center gap-3 sm:gap-4 hover:bg-[#fffdfa] transition-all"
            >
              {/* Miniatura */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#faedcd] shrink-0">
                <img
                  src={item.product.images[0]}
                  alt={item.product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Información y Stepper */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-xs sm:text-base font-bold text-[#01372e] truncate">
                      {item.product.title}
                    </h3>
                    <span className="font-mono text-[10px] sm:text-xs text-[#01372e] bg-[#f4e7c8] px-2 py-0.5 rounded font-bold uppercase">
                      {item.quantity} x {item.selectedFormat.name} (
                      {item.quantity * item.selectedFormat.weightKg} KG)
                    </span>
                  </div>

                  <InteractiveIndicator
                    label="Eliminar Línea"
                    devices={['celular', 'tablet', 'pc']}
                    actionDesc="Quita este producto del remito comercial"
                    isActive={guideMode}
                  >
                    <button
                      type="button"
                      onClick={() => onRemoveItem(index)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#707976] hover:text-[#ba1a1a] hover:bg-[#ffdad6] active:scale-90 transition-all"
                      aria-label={`Eliminar ${item.product.title}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </InteractiveIndicator>
                </div>

                {/* Fila de controles: Stepper y Subtotal */}
                <div className="flex items-center justify-between mt-2 pt-1">
                  <div className="flex items-center bg-[#f4e7c8] rounded-xl p-0.5">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-[#01372e] font-bold text-sm shadow-xs active:scale-90 select-none hover:bg-[#fff8f0]"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-mono text-xs sm:text-sm font-bold text-[#01372e]">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-[#01372e] font-bold text-sm shadow-xs active:scale-90 select-none hover:bg-[#fff8f0]"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-mono text-sm sm:text-base font-bold text-[#01372e]">
                    ${item.subtotal.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ====================================================================
          4. RESUMEN DE TOTALES Y BONIFICACIONES
          ==================================================================== */}
      {cartItems.length > 0 && (
        <div className="bg-[#fff3d7] rounded-2xl p-4 sm:p-5 border border-[#efe1c2] shadow-sm space-y-2.5">
          <div className="flex justify-between items-center text-xs sm:text-sm text-[#404846]">
            <span>Subtotal ({totalItemsCount} bultos · {totalWeightKg} KG):</span>
            <span className="font-mono font-semibold text-[#211b08]">
              ${subtotalRaw.toLocaleString('es-AR')}
            </span>
          </div>

          {volumeDiscount > 0 && (
            <div className="flex justify-between items-center text-xs sm:text-sm text-[#842401] font-medium">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">local_offer</span>
                <span>Descuento por bulto cerrado:</span>
              </span>
              <span className="font-mono font-bold">-${volumeDiscount.toLocaleString('es-AR')}</span>
            </div>
          )}

          <div className="h-px bg-[#c0c8c4]/40 my-1"></div>

          <div className="flex justify-between items-baseline pt-1">
            <div>
              <span className="font-serif text-base sm:text-lg font-bold text-[#01372e] block">
                Total Estimado
              </span>
              <span className="text-[11px] text-[#404846] italic">
                Sujeto a pesada final en báscula (+ IVA si aplica)
              </span>
            </div>
            <span className="font-mono text-2xl sm:text-3xl font-bold text-[#01372e]">
              ${totalEstimated.toLocaleString('es-AR')}
            </span>
          </div>
        </div>
      )}

      {/* ====================================================================
          5. FORMULARIO DE DATOS PARA EL REMITO DE KARIM
          ==================================================================== */}
      {cartItems.length > 0 && (
        <div className="bg-[#ffffff] rounded-2xl p-5 sm:p-6 border border-[#efe1c2] shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#c8e6dd] flex items-center justify-center text-[#01372e]">
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#01372e]">
                Datos para el Remito Comercial
              </h3>
              <p className="text-xs text-[#404846]">
                Sin pago online. Karim confirma stock de inmediato y coordina flete oficial.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nombre o Razón Social */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-[#211b08] block">
                Nombre y Apellido / Razón Social:
              </label>
              <input
                type="text"
                value={formData.fullNameOrBusiness}
                onChange={(e) =>
                  setFormData({ ...formData, fullNameOrBusiness: e.target.value })
                }
                placeholder="Ej: Don Tomás Almacén / María Ruiz"
                className="w-full bg-[#fff8f0] border border-[#c0c8c4] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-[#211b08] focus:ring-2 focus:ring-[#01372e] focus:outline-none"
              />
            </div>

            {/* Teléfono WhatsApp */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#211b08] block">
                Teléfono de WhatsApp:
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 font-mono text-xs text-[#404846] font-bold">
                  +54 9
                </span>
                <input
                  type="tel"
                  value={formData.whatsappPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsappPhone: e.target.value })
                  }
                  placeholder="11 6290 4412"
                  className="w-full bg-[#fff8f0] border border-[#c0c8c4] pl-16 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-mono text-[#211b08] focus:ring-2 focus:ring-[#01372e] focus:outline-none"
                />
              </div>
            </div>

            {/* Localidad o Expreso */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#211b08] block">
                Localidad / Expreso habitual:
              </label>
              <input
                type="text"
                value={formData.locationOrExpress}
                onChange={(e) =>
                  setFormData({ ...formData, locationOrExpress: e.target.value })
                }
                placeholder="Ej: San Martín, Ramos Mejía, CABA"
                className="w-full bg-[#fff8f0] border border-[#c0c8c4] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-[#211b08] focus:ring-2 focus:ring-[#01372e] focus:outline-none"
              />
            </div>

            {/* Modalidad de Entrega */}
            <div className="space-y-1.5 sm:col-span-2">
              <span className="text-xs font-bold text-[#211b08] block">
                Modalidad de entrega:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, deliveryMethod: 'deposito' })}
                  className={`p-3 rounded-xl flex flex-col items-center justify-center transition-all border ${
                    formData.deliveryMethod === 'deposito'
                      ? 'bg-[#01372e] text-white border-[#01372e] shadow-sm font-bold'
                      : 'bg-[#fff3d7] text-[#211b08] hover:bg-[#faedcd] border-[#efe1c2]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] mb-1">storefront</span>
                  <span className="text-xs">Retiro en depósito</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, deliveryMethod: 'envio' })}
                  className={`p-3 rounded-xl flex flex-col items-center justify-center transition-all border ${
                    formData.deliveryMethod === 'envio'
                      ? 'bg-[#01372e] text-white border-[#01372e] shadow-sm font-bold'
                      : 'bg-[#fff3d7] text-[#211b08] hover:bg-[#faedcd] border-[#efe1c2]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] mb-1">local_shipping</span>
                  <span className="text-xs">Envío a coordinar</span>
                </button>
              </div>
            </div>

            {/* Notas especiales */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-[#211b08] block">
                Notas o aclaraciones para Karim:
              </label>
              <textarea
                value={formData.specialNotes}
                onChange={(e) =>
                  setFormData({ ...formData, specialNotes: e.target.value })
                }
                rows={2}
                placeholder="Ej: Fraccionar el Pimentón en bolsas de 500g si es posible, llamar antes..."
                className="w-full bg-[#fff8f0] border border-[#c0c8c4] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-[#211b08] focus:ring-2 focus:ring-[#01372e] focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          6. ACCIONES Y DISPARO A WHATSAPP
          ==================================================================== */}
      {cartItems.length > 0 && (
        <div className="space-y-3 pt-2">
          <InteractiveIndicator
            label="Enviar Pedido a WhatsApp"
            devices={['celular', 'tablet', 'pc']}
            actionDesc="Abre WhatsApp con el mensaje estructurado para Karim, incluyendo todos los ítems, kilos, total y datos fiscales"
            isActive={guideMode}
          >
            <a
              href={whatsappOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#1ebe5d] hover:bg-[#19a550] active:scale-[0.98] text-white py-3.5 px-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-[0_4px_16px_rgba(30,190,93,0.35)] transition-all text-center"
            >
              <span className="material-symbols-outlined text-[22px]">chat</span>
              <span>
                Enviar pedido a Karim ({totalItemsCount} ítems · $
                {totalEstimated.toLocaleString('es-AR')})
              </span>
            </a>
          </InteractiveIndicator>

          <p className="text-[11px] sm:text-xs text-center text-[#404846] px-4 leading-relaxed">
            Al hacer clic, se abre tu WhatsApp con el mensaje armado para que Karim te confirme stock
            y coordine el pesaje y despacho.
          </p>

          <button
            type="button"
            onClick={onContinueShopping}
            className="w-full bg-transparent hover:bg-[#faedcd] text-[#01372e] py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Seguir sumando productos</span>
          </button>
        </div>
      )}
    </div>
  );
};
