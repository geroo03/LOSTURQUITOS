import { Category, Product } from '../types';
import { LOCAL_LOGO, WHATSAPP_DISPLAY } from './config';

const TEAL: [number, number, number] = [31, 78, 68];
const RED: [number, number, number] = [186, 26, 26];
const GREY: [number, number, number] = [112, 121, 118];
const INK: [number, number, number] = [33, 27, 8];
const CREAM: [number, number, number] = [244, 231, 200];

const peso = (n: number) => '$' + n.toLocaleString('es-AR');

async function logoDataUrl(): Promise<string | null> {
  try {
    const blob = await (await fetch(LOCAL_LOGO)).blob();
    return await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onloadend = () => resolve(r.result as string);
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/** Genera y descarga la lista de precios (PDF) con el catálogo actual. jsPDF se carga recién al pedir el PDF. */
export async function downloadPriceList(products: Product[], categories: Category[]) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210;
  const M = 14;
  const BOTTOM = 280;
  const COL_UNIT = 128;
  const COL_PRICE = W - M;
  let page = 1;
  let y = 0;

  const footer = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...GREY);
    doc.text(`Precios sujetos a modificación · Pedidos por WhatsApp ${WHATSAPP_DISPLAY}`, M, 289);
    doc.text(`Página ${page}`, W - M, 289, { align: 'right' });
  };
  const newPage = () => {
    footer();
    doc.addPage();
    page += 1;
    y = 18;
  };

  // Encabezado
  const logo = await logoDataUrl();
  let titleX = M;
  if (logo) {
    doc.addImage(logo, 'JPEG', M, 10, 20, 20);
    titleX = M + 25;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...TEAL);
  doc.text('Los Turquitos', titleX, 20);
  doc.setFontSize(11);
  doc.setTextColor(...INK);
  doc.text('Lista de precios mayorista', titleX, 27);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...GREY);
  doc.text(`Actualizada al ${new Date().toLocaleDateString('es-AR')}`, W - M, 20, { align: 'right' });
  y = 38;

  for (const cat of categories) {
    const inCat = products.filter((p) => p.categoryId === cat.id);
    if (!inCat.length) continue;

    if (y > BOTTOM - 30) newPage();
    doc.setFillColor(...TEAL);
    doc.roundedRect(M, y, W - 2 * M, 7, 1.2, 1.2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(255, 255, 255);
    doc.text(cat.label.toUpperCase(), M + 3, y + 5);
    doc.setFontSize(8);
    doc.text('PRESENTACIÓN', COL_UNIT, y + 5);
    doc.text('PRECIO', COL_PRICE - 2, y + 5, { align: 'right' });
    y += 11;

    inCat.forEach((p, pi) => {
      const nameLines = doc.splitTextToSize(p.title, COL_UNIT - M - 6) as string[];
      const rowsHeight = Math.max(nameLines.length * 4.4, p.variants.length * 5.2) + 2;
      if (y + rowsHeight > BOTTOM) newPage();

      if (pi % 2 === 0) {
        doc.setFillColor(...CREAM);
        doc.setGState?.(new (doc as any).GState({ opacity: 0.45 }));
        doc.rect(M, y - 3.8, W - 2 * M, rowsHeight, 'F');
        doc.setGState?.(new (doc as any).GState({ opacity: 1 }));
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(...(p.soldOut ? GREY : INK));
      doc.text(nameLines, M + 2, y);

      let vy = y;
      p.variants.forEach((v) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(...INK);
        doc.text(v.unit, COL_UNIT, vy);
        if (v.soldOut) {
          doc.setTextColor(...GREY);
          doc.text('Sin stock', COL_PRICE - 2, vy, { align: 'right' });
        } else if (v.listPrice) {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...RED);
          const nowTxt = peso(v.price);
          doc.text(nowTxt, COL_PRICE - 2, vy, { align: 'right' });
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(...GREY);
          const oldTxt = peso(v.listPrice);
          const x2 = COL_PRICE - 2 - doc.getTextWidth(nowTxt) - 3;
          doc.text(oldTxt, x2, vy, { align: 'right' });
          doc.setDrawColor(...GREY);
          doc.setLineWidth(0.2);
          doc.line(x2 - doc.getTextWidth(oldTxt), vy - 1, x2, vy - 1);
          doc.setFontSize(7);
          doc.setTextColor(...RED);
          doc.text('OFERTA', COL_UNIT + 16, vy);
        } else {
          doc.setFont('helvetica', 'bold');
          doc.text(peso(v.price), COL_PRICE - 2, vy, { align: 'right' });
        }
        vy += 5.2;
      });
      y += rowsHeight;
    });
    y += 5;
  }

  footer();
  doc.save('lista-de-precios-los-turquitos.pdf');
}
