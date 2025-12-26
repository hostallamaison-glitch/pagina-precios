/* Editable JSON al inicio:
   Cambia precios en CLP, disponibilidad ('high' | 'low' | 'soldout'),
   número WhatsApp (formato internacional sin '+', ej. '569XXXXXXXX'),
   y exchangeRate (1 CLP -> USD) según prefieras.
*/
const DATA = {
  // Tipo de moneda por defecto al cargar: 'CLP' o 'USD'
  currency: 'CLP',

  // Tipo de cambio (1 CLP = exchangeRate USD). Edita según tu preferencia.
  exchangeRate: 0.0012, // ejemplo: 1 CLP = 0.0012 USD (=> 1 USD ≈ 833 CLP)

  // Lista de habitaciones
  rooms: [
    {
      id: 'simple',
      name: 'Habitación Simple',
      priceCLP: 23000,
      short: '1 huésped · Cama individual',
      availability: 'high', // 'high' | 'low' | 'soldout'
      whatsapp: '56912345678',
      message: 'Hola, quiero reservar una Habitación Simple. Fecha y detalles: ',
      // imagen opcional (URL). Puedes dejar vacío para un placeholder neutro.
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=23a5b2b6d0f7c8a7f2a1c2c037f5a6a8'
    },
    {
      id: 'doble',
      name: 'Habitación Doble',
      priceCLP: 42000,
      short: '2 huéspedes · Cama matrimonial',
      availability: 'low',
      whatsapp: '56912345678',
      message: 'Hola, quiero reservar una Habitación Doble. Fecha y detalles: ',
      image: 'https://images.unsplash.com/photo-1501117716987-c8e29f57a2b3?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=0f0a0b813d2b3f2f2b5d6f2a8b3e4c7d'
    },
    {
      id: 'suite',
      name: 'Suite',
      priceCLP: 86000,
      short: '2 huéspedes · Vista · Mayor espacio',
      availability: 'soldout',
      whatsapp: '56912345678',
      message: 'Hola, quisiera información sobre la Suite. Fecha y detalles: ',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=89b7bdb6aa0e5f4a0c1e0e6c5d4b3f2a'
    }
  ]
};

/* ------------------------
   Utility / Formateo
   ------------------------ */
const currencyFormats = {
  CLP: (value) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value),
  USD: (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value)
};

function formatPriceCLPTo(currency, priceCLP) {
  if (currency === 'CLP') return currencyFormats.CLP(priceCLP);
  // Convert CLP -> USD using exchangeRate
  const usd = priceCLP * DATA.exchangeRate;
  return currencyFormats.USD(usd);
}

/* ------------------------
   DOM Rendering
   ------------------------ */
const ratesGrid = document.getElementById('rates-grid');
const currencySelect = document.getElementById('currency');

currencySelect.value = DATA.currency || 'CLP';

function availabilityLabel(status) {
  switch (status) {
    case 'high': return { text: 'Alta', className: 'high' };
    case 'low': return { text: 'Baja', className: 'low' };
    case 'soldout': return { text: 'Agotado', className: 'soldout' };
    default: return { text: 'Desconocida', className: 'low' };
  }
}

function makeWhatsAppLink(number, text) {
  // number debe estar en formato internacional sin '+' (ej: '56912345678')
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${number}?text=${encoded}`;
}

function renderRooms() {
  // Limpia
  ratesGrid.innerHTML = '';

  DATA.rooms.forEach(room => {
    const priceText = formatPriceCLPTo(currencySelect.value, room.priceCLP);

    const av = availabilityLabel(room.availability);
    const isSoldOut = room.availability === 'soldout';

    // Card container
    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('role', 'listitem');
    card.setAttribute('aria-labelledby', `title-${room.id}`);

    // Media (imagen de fondo)
    const media = document.createElement('div');
    media.className = 'card-media';
    media.style.backgroundImage = `linear-gradient(180deg, rgba(44,62,80,0.06), rgba(44,62,80,0.02)), url('${room.image || ''}')`;

    // Body
    const body = document.createElement('div');
    body.className = 'card-body';

    // Title + meta
    const titleRow = document.createElement('div');
    titleRow.className = 'room-title';

    const title = document.createElement('h3');
    title.id = `title-${room.id}`;
    title.textContent = room.name;

    const meta = document.createElement('div');
    meta.className = 'room-meta';
    meta.textContent = room.short;

    titleRow.appendChild(title);
    titleRow.appendChild(meta);

    // Price
    const price = document.createElement('div');
    price.className = 'price';
    price.dataset.roomId = room.id;
    price.textContent = priceText;

    // Availability
    const avail = document.createElement('div');
    avail.className = 'availability';
    const badge = document.createElement('span');
    badge.className = `badge ${av.className}`;
    badge.setAttribute('aria-hidden', 'true');

    const avLabel = document.createElement('div');
    avLabel.className = 'av-label';
    avLabel.textContent = av.text;

    avail.appendChild(badge);
    avail.appendChild(avLabel);

    // Footer: CTA and info
    const footer = document.createElement('div');
    footer.className = 'card-footer';

    const metaRight = document.createElement('div');
    metaRight.className = 'meta-right';
    metaRight.textContent = 'Pago al reservar · 24h cancelación';

    const btn = document.createElement('a');
    btn.className = 'btn';
    btn.href = makeWhatsAppLink(room.whatsapp, `${room.message} [Escribe aquí tu fecha y nombre]`);
    btn.setAttribute('target', '_blank');
    btn.setAttribute('rel', 'noopener noreferrer');
    btn.textContent = 'Reservar por WhatsApp';
    btn.setAttribute('aria-label', `Reservar ${room.name} por WhatsApp`);

    if (isSoldOut) {
      btn.setAttribute('aria-disabled', 'true');
      btn.style.pointerEvents = 'none';
      btn.style.opacity = '0.6';
      // opcionalmente cambiar texto
      btn.textContent = 'Agotado';
    }

    footer.appendChild(metaRight);
    footer.appendChild(btn);

    // Ensamblar
    body.appendChild(titleRow);
    body.appendChild(price);
    body.appendChild(avail);

    card.appendChild(media);
    card.appendChild(body);
    card.appendChild(footer);

    ratesGrid.appendChild(card);
  });
}

/* ------------------------
   Actualizaciones / Eventos
   ------------------------ */
function updatePricesOnCurrencyChange() {
  // Actualiza todos los elementos .price
  const priceEls = document.querySelectorAll('.price');
  priceEls.forEach(el => {
    const roomId = el.dataset.roomId;
    const room = DATA.rooms.find(r => r.id === roomId);
    if (!room) return;
    el.textContent = formatPriceCLPTo(currencySelect.value, room.priceCLP);
  });
}

// Escucha selector de moneda
currencySelect.addEventListener('change', () => {
  updatePricesOnCurrencyChange();
});

/* Inicialización */
document.addEventListener('DOMContentLoaded', () => {
  renderRooms();
  // Asegura que al inicio los precios coincidan con DATA.currency
  currencySelect.value = DATA.currency || 'CLP';
  updatePricesOnCurrencyChange();
});

/* ------------------------
   Notas rápidas para mantenimiento:
   - Edita DATA.rooms para cambiar precios y disponibilidad.
   - Cambia DATA.exchangeRate al valor real que desees usar para convertir CLP -> USD.
   - Si quieres mostrar precios base en USD, podrías añadir priceUSD y adaptar el formateo.
   - Los números WhatsApp deben estar en formato internacional sin '+'. Ej: '56912345678'.
*/