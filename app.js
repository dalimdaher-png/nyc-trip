'use strict';

/* =========================================================
   NYC Trip 2026
   App estática (GitHub Pages). Los datos del viaje están
   en este archivo; lo que cargás vos (lugares, gastos, notas)
   se guarda en el navegador del celular (localStorage).
   ========================================================= */

/* ---------- Claves de almacenamiento (no cambiarlas: ahí están tus datos) ---------- */

const STORAGE = {
  places: 'nycPlaces',
  expenses: 'nycExpenses',
  notes: 'nycNotes',
  hotelInfo: 'nycHotelInfo',
  flightInfo: 'nycFlightInfo',
  expensePrefs: 'nycExpensePrefs',
  weather: 'nycWeatherCache'
};

/* ---------- Datos del viaje ----------
   Todas las fechas llevan la zona horaria del lugar, así
   las cuentas regresivas funcionan desde cualquier país. */

const TRIP = {
  start: '2026-10-29T16:50:00-03:00',
  end: '2026-11-14T21:50:00-03:00',
  totalDays: 17,
  agencyRef: '25439634673'
};

const HOTEL_ADDRESS = 'Tribeca Hotel FiDi, 102 Greenwich St, New York, NY 10006';

const LINKS = {
  hotelMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(HOTEL_ADDRESS)}`,
  toHotel: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(HOTEL_ADDRESS)}&travelmode=transit`,
  jfkToHotel: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent('JFK Airport, Queens, NY')}&destination=${encodeURIComponent(HOTEL_ADDRESS)}&travelmode=transit`,
  hotelToJfk: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(HOTEL_ADDRESS)}&destination=${encodeURIComponent('JFK Terminal 8, Queens, NY')}&travelmode=transit`,
  omny: 'https://omny.info/',
  avianca: 'https://www.avianca.com/',
  american: 'https://www.aa.com/',
  aeromexico: 'https://aeromexico.com/',
  booking: 'https://www.booking.com/'
};

const HOTEL = {
  name: 'Tribeca Hotel FiDi',
  address: '102 Greenwich Street, New York, NY 10006',
  phone: '+1 212-233-6701',
  checkInDay: 'Vie 30 oct',
  checkInHours: 'desde las 15:00',
  checkOutDay: 'Vie 6 nov',
  checkOutHours: 'de 8:00 a 11:00',
  room: 'Suite con cama grande, 1 adulto, 7 noches',
  meals: 'No incluidas',
  guestName: 'Marcelo Daher Dalila Nahir',
  payment: 'USD 2.308,49, ya pagado (29/9)',
  freeCancelUntil: '2026-10-28T23:59:00-04:00',
  cancelFee: 'USD 429,78',
  confirmation: '6691299516',
  pin: '3903'
};

const FLIGHTS = {
  ida: {
    airline: 'Avianca',
    fare: 'Tarifa Light',
    ref: 'AO8XTJ',
    segments: [
      {
        num: 'AV 8396',
        op: 'Operado por Avianca Ecuador S.A., Airbus A320neo',
        from: { code: 'EZE', city: 'Buenos Aires' },
        to: { code: 'BOG', city: 'Bogotá' },
        dep: '2026-10-29T16:50:00-03:00',
        arr: '2026-10-29T21:30:00-05:00'
      },
      {
        num: 'AV 20',
        op: 'Operado por Avianca, Airbus A320neo',
        from: { code: 'BOG', city: 'Bogotá' },
        to: { code: 'JFK', city: 'Nueva York' },
        dep: '2026-10-29T23:05:00-05:00',
        arr: '2026-10-30T06:00:00-04:00'
      }
    ],
    facts: [
      ['Equipaje', 'Artículo personal, equipaje de mano de 10 kg y una maleta de 23 kg en bodega'],
      ['Asiento', 'Sin elegir'],
      ['Check‑in online', 'Se habilita 48 h antes, en avianca.com o la app']
    ]
  },
  aca: {
    airline: 'American Airlines',
    fare: 'Basic Economy',
    ref: 'DTKXEH',
    segments: [
      {
        num: 'AA 1892',
        op: 'Sale de la Terminal 8 de JFK',
        from: { code: 'JFK', city: 'Nueva York' },
        to: { code: 'DFW', city: 'Dallas' },
        dep: '2026-11-06T19:29:00-05:00',
        arr: '2026-11-06T22:46:00-06:00'
      },
      {
        num: 'AA 3740',
        op: 'Operado por American Eagle',
        from: { code: 'DFW', city: 'Dallas' },
        to: { code: 'ACA', city: 'Acapulco' },
        dep: '2026-11-07T11:23:00-06:00',
        arr: '2026-11-07T14:28:00-06:00'
      }
    ],
    facts: [
      ['Equipaje', 'Solo equipaje de mano y artículo personal. Sin maleta en bodega'],
      ['Asiento', 'Se asigna en el check‑in, o pagando para elegirlo'],
      ['Check‑in online', '24 h antes, en la app de American'],
      ['Condiciones', 'Embarcás en el último grupo. No admite cambios ni reembolsos']
    ]
  },
  vuelta: {
    airline: 'Aeroméxico',
    fare: '',
    ref: 'KYYVFK',
    segments: [
      {
        num: 'AM 307',
        op: '',
        from: { code: 'ACA', city: 'Acapulco' },
        to: { code: 'MEX', city: 'Ciudad de México' },
        dep: '2026-11-13T19:06:00-06:00',
        arr: '2026-11-13T20:35:00-06:00'
      },
      {
        num: 'AM 30',
        op: '',
        from: { code: 'MEX', city: 'Ciudad de México' },
        to: { code: 'EZE', city: 'Buenos Aires' },
        dep: '2026-11-14T09:35:00-06:00',
        arr: '2026-11-14T21:50:00-03:00'
      }
    ],
    facts: [
      ['Equipaje', 'Una maleta de 23 kg en bodega en cada tramo'],
      ['Asiento', 'Sin asignar']
    ]
  }
};

/* Hitos que alimentan la tarjeta "Próximo" de la pantalla Hoy. */
const MILESTONES = [
  { at: '2026-10-27T16:50:00-03:00', place: 'Buenos Aires', title: 'Se habilita el check‑in de Avianca', detail: 'Hacelo en avianca.com o en la app con la reserva AO8XTJ.', link: LINKS.avianca, linkLabel: 'Ir a Avianca' },
  { at: '2026-10-29T16:50:00-03:00', place: 'Buenos Aires', title: 'Vuelo a Nueva York', detail: 'AV 8396 sale de Ezeiza a las 16:50, con escala en Bogotá.' },
  { at: '2026-10-29T23:05:00-05:00', place: 'Bogotá', title: 'Conexión en Bogotá', detail: 'AV 20 sale a las 23:05 hacia JFK.' },
  { at: '2026-10-30T06:00:00-04:00', place: 'Nueva York', title: 'Llegada a Nueva York', detail: 'Aterrizás en JFK a las 06:00. Al hotel en subte, pagando con OMNY.', link: LINKS.jfkToHotel, linkLabel: 'Ver ruta al hotel' },
  { at: '2026-10-30T15:00:00-04:00', place: 'Nueva York', title: 'Check‑in en el hotel', detail: 'Tribeca Hotel FiDi, desde las 15:00. Llevá documento y tarjeta de crédito.' },
  { at: '2026-11-05T19:29:00-05:00', place: 'Nueva York', title: 'Se habilita el check‑in de American', detail: 'En la app de American, 24 h antes del vuelo. Reserva DTKXEH.', link: LINKS.american, linkLabel: 'Ir a American' },
  { at: '2026-11-06T11:00:00-05:00', place: 'Nueva York', title: 'Check‑out del hotel', detail: 'Tenés hasta las 11:00. El vuelo sale a las 19:29 de JFK Terminal 8.' },
  { at: '2026-11-06T19:29:00-05:00', place: 'Nueva York', title: 'Vuelo a Acapulco', detail: 'AA 1892 sale de JFK Terminal 8 a las 19:29. Pasás la noche en Dallas.', link: LINKS.hotelToJfk, linkLabel: 'Ruta del hotel a JFK' },
  { at: '2026-11-07T11:23:00-06:00', place: 'Dallas', title: 'Conexión en Dallas', detail: 'AA 3740 sale a las 11:23 hacia Acapulco.' },
  { at: '2026-11-07T14:28:00-06:00', place: 'Acapulco', title: 'Llegada a Acapulco', detail: 'Aterrizás a las 14:28. Te quedás en lo de un amigo.' },
  { at: '2026-11-13T19:06:00-06:00', place: 'Acapulco', title: 'Vuelo a Buenos Aires', detail: 'AM 307 sale a las 19:06. Pasás la noche en Ciudad de México.' },
  { at: '2026-11-14T09:35:00-06:00', place: 'Ciudad de México', title: 'Conexión en Ciudad de México', detail: 'AM 30 sale a las 09:35 hacia Ezeiza.' },
  { at: '2026-11-14T21:50:00-03:00', place: 'Buenos Aires', title: 'Llegada a Buenos Aires', detail: 'Aterrizás en Ezeiza a las 21:50.' }
];

/* Pronóstico: cada ciudad muestra solo los días que vas a estar ahí. */
const WEATHER_PLACES = {
  nyc: { name: 'Nueva York', lat: 40.7086, lon: -74.0123, tz: 'America/New_York', from: '2026-10-30', to: '2026-11-06' },
  aca: { name: 'Acapulco', lat: 16.8531, lon: -99.8237, tz: 'America/Mexico_City', from: '2026-11-07', to: '2026-11-13' }
};

const QUICK_LINKS = [
  { icon: 'route', title: 'Cómo llegar al hotel', sub: 'Google Maps en transporte público', href: LINKS.toHotel },
  { icon: 'bed-double', title: 'Tribeca Hotel FiDi', sub: '102 Greenwich Street', href: LINKS.hotelMap },
  { icon: 'train-front', title: 'OMNY y subte', sub: 'Pagás con tarjeta contactless o el celular', href: LINKS.omny },
  { icon: 'plane', title: 'Avianca', sub: 'Reserva AO8XTJ', href: LINKS.avianca },
  { icon: 'plane', title: 'American Airlines', sub: 'Reserva DTKXEH', href: LINKS.american },
  { icon: 'plane', title: 'Aeroméxico', sub: 'Reserva KYYVFK', href: LINKS.aeromexico },
  { icon: 'bed-double', title: 'Booking.com', sub: 'Reserva 6691299516', href: LINKS.booking }
];

const DEFAULT_PLACES = [
  { id: 'downtown', name: 'Downtown / Financial District', category: 'Manhattan', visited: false, custom: false },
  { id: 'newjersey', name: 'New Jersey', category: 'New Jersey', visited: false, custom: false },
  { id: 'centralpark', name: 'Central Park', category: 'Parque', visited: false, custom: false },
  { id: 'timessquare', name: 'Times Square', category: 'Manhattan', visited: false, custom: false },
  { id: 'rockefeller', name: 'Rockefeller Center', category: 'Manhattan', visited: false, custom: false },
  { id: 'edge', name: 'Edge', category: 'Mirador', visited: false, custom: false },
  { id: 'brooklyn', name: 'Brooklyn', category: 'Brooklyn', visited: false, custom: false }
];

const CURRENCIES = ['USD', 'ARS', 'MXN'];

const CATEGORIES = [
  { name: 'Comida', icon: 'utensils' },
  { name: 'Transporte', icon: 'train-front' },
  { name: 'Compras', icon: 'shopping-bag' },
  { name: 'Entradas / atracciones', icon: 'ticket' },
  { name: 'Hotel', icon: 'bed-double' },
  { name: 'Vuelos', icon: 'plane' },
  { name: 'Otros', icon: 'ellipsis' }
];

const PAYMENTS = ['Efectivo', 'Tarjeta', 'Débito', 'Otro'];

/* ---------- Utilidades ---------- */

const $ = (id) => document.getElementById(id);

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    toast('No se pudo guardar en este navegador');
    return false;
  }
}

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const pad = (n) => String(n).padStart(2, '0');
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const DAYS_SHORT = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const MONTHS_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/* Lee una fecha "2026-10-29T16:50:00-03:00" y conserva la hora local del lugar. */
function stamp(iso) {
  const [datePart, timePart] = iso.split('T');
  const [y, m, d] = datePart.split('-').map(Number);
  return { ms: Date.parse(iso), y, m, d, hm: timePart.slice(0, 5), key: datePart };
}

function dayParts(key) {
  const [y, m, d] = key.split('-').map(Number);
  return { y, m, d };
}

function weekday({ y, m, d }) {
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

function shortDate(p) {
  return `${cap(DAYS_SHORT[weekday(p)])} ${p.d} ${MONTHS_SHORT[p.m - 1]}`;
}

function longDate(p) {
  return `${DAYS[weekday(p)]} ${p.d} de ${MONTHS[p.m - 1]}`;
}

function todayKey(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function calendarDaysBetween(fromKey, toKey) {
  const a = dayParts(fromKey);
  const b = dayParts(toKey);
  return Math.round((Date.UTC(b.y, b.m - 1, b.d) - Date.UTC(a.y, a.m - 1, a.d)) / 86400000);
}

function duration(ms) {
  const total = Math.round(ms / 60000);
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
}

function money(amount, currency) {
  const n = Math.round((Number(amount) || 0) * 100) / 100;
  const opts = Number.isInteger(n)
    ? { maximumFractionDigits: 0 }
    : { minimumFractionDigits: 2, maximumFractionDigits: 2 };
  return `${currency} ${new Intl.NumberFormat('es-AR', opts).format(n)}`;
}

/* Acepta "12,50", "1.500", "1.500,75" y "12.5". */
function parseAmount(raw) {
  let v = String(raw || '').trim().replace(/\s/g, '');
  if (!v) return NaN;
  if (v.includes(',')) v = v.replace(/\./g, '').replace(',', '.');
  else if (/^\d{1,3}(\.\d{3})+$/.test(v)) v = v.replace(/\./g, '');
  return Number(v);
}

function codeChip(label, code) {
  return `<button type="button" class="code-chip" data-copy="${esc(code)}" aria-label="Copiar ${esc(label.toLowerCase())} ${esc(code)}"><small>${esc(label)}</small><strong>${esc(code)}</strong>${icon('copy')}</button>`;
}

function externalAttrs() {
  return 'target="_blank" rel="noopener noreferrer"';
}

/* ---------- Estado ---------- */

const state = {
  places: [],
  expenses: [],
  notes: '',
  hotelInfo: null,
  flightInfo: null,
  weather: null,
  weatherError: false
};

const ui = {
  weatherPlace: Date.now() >= Date.parse('2026-11-06T19:29:00-05:00') ? 'aca' : 'nyc',
  placeFilter: 'all',
  catCurrency: null
};

function loadState() {
  const places = load(STORAGE.places, null);
  state.places = Array.isArray(places) ? places : DEFAULT_PLACES.map((p) => ({ ...p }));

  const expenses = load(STORAGE.expenses, []);
  state.expenses = (Array.isArray(expenses) ? expenses : []).map((e) => ({
    ...e,
    amount: Number(e.amount) || 0,
    currency: CURRENCIES.includes(e.currency) ? e.currency : 'USD'
  }));

  const notes = load(STORAGE.notes, '');
  state.notes = typeof notes === 'string' ? notes : '';
  state.hotelInfo = load(STORAGE.hotelInfo, null);
  state.flightInfo = load(STORAGE.flightInfo, null);
  state.weather = load(STORAGE.weather, null);
}

/* ---------- Avisos breves ---------- */

let toastTimer;
function toast(message) {
  const el = $('toast');
  el.textContent = message;
  el.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2200);
}

/* ---------- Hoja inferior ---------- */

let sheetCloseTimer;
let sheetReturnFocus = null;

function openSheet(html) {
  clearTimeout(sheetCloseTimer);
  const sheet = $('sheet');
  const backdrop = $('sheetBackdrop');
  if (sheet.hidden) sheetReturnFocus = document.activeElement;
  $('sheetBody').innerHTML = html;
  sheet.hidden = false;
  backdrop.hidden = false;
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    sheet.classList.add('is-open');
    backdrop.classList.add('is-open');
  });
  const first = sheet.querySelector('[data-autofocus]') || sheet.querySelector('button, input, select, textarea');
  if (first) setTimeout(() => first.focus({ preventScroll: true }), 80);
}

function closeSheet() {
  const sheet = $('sheet');
  const backdrop = $('sheetBackdrop');
  if (sheet.hidden) return;
  sheet.classList.remove('is-open');
  backdrop.classList.remove('is-open');
  document.body.style.overflow = '';
  sheetCloseTimer = setTimeout(() => {
    sheet.hidden = true;
    backdrop.hidden = true;
    $('sheetBody').innerHTML = '';
  }, 260);
  if (sheetReturnFocus && document.contains(sheetReturnFocus)) sheetReturnFocus.focus({ preventScroll: true });
  sheetReturnFocus = null;
}

let confirmAction = null;
function confirmSheet({ title, text, confirmLabel, onConfirm }) {
  confirmAction = onConfirm;
  openSheet(`
    <h2 id="sheetTitle">${esc(title)}</h2>
    <p class="sheet-text">${esc(text)}</p>
    <div class="sheet-actions">
      <button type="button" class="btn btn-primary btn-block" data-action="confirm" data-autofocus>${esc(confirmLabel)}</button>
      <button type="button" class="btn btn-ghost btn-block" data-action="close-sheet">Cancelar</button>
    </div>`);
}

/* ---------- Navegación ---------- */

function setScreen(id) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('is-active', s.id === id));
  document.querySelectorAll('.tab').forEach((t) => {
    const active = t.dataset.target === id;
    t.classList.toggle('is-active', active);
    if (active) t.setAttribute('aria-current', 'page');
    else t.removeAttribute('aria-current');
  });
  window.scrollTo(0, 0);
}

/* ---------- HOY ---------- */

function phase(now) {
  const t = Date.parse;
  if (now < t(TRIP.start)) {
    const days = calendarDaysBetween(todayKey(), '2026-10-29');
    if (days <= 0) return { text: 'Hoy viajás', stage: 'nyc' };
    if (days === 1) return { text: 'Mañana viajás', stage: 'nyc' };
    return { text: `Faltan ${days} días`, stage: 'nyc' };
  }
  if (now < t('2026-10-30T06:00:00-04:00')) return { text: 'Volando a Nueva York', stage: 'nyc' };
  if (now < t('2026-11-06T19:29:00-05:00')) {
    const day = Math.min(8, Math.floor((now - t('2026-10-30T00:00:00-04:00')) / 86400000) + 1);
    return { text: `Día ${day} de 8 en Nueva York`, stage: 'nyc' };
  }
  if (now < t('2026-11-07T14:28:00-06:00')) return { text: 'Rumbo a Acapulco', stage: 'aca' };
  if (now < t('2026-11-13T19:06:00-06:00')) {
    const day = Math.min(7, Math.floor((now - t('2026-11-07T00:00:00-06:00')) / 86400000) + 1);
    return { text: `Día ${day} de 7 en Acapulco`, stage: 'aca' };
  }
  if (now < t(TRIP.end)) return { text: 'Volviendo a Buenos Aires', stage: 'aca' };
  return { text: 'Viaje terminado', stage: 'nyc' };
}

function renderHero(now) {
  $('todayLabel').textContent = cap(longDate(dayParts(todayKey())));
  const p = phase(now);
  const el = $('heroStatus');
  el.textContent = p.text;
  el.dataset.stage = p.stage;
}

function renderBoard(now) {
  const board = $('nextBoard');
  const index = MILESTONES.findIndex((m) => Date.parse(m.at) > now);

  if (index === -1) {
    board.innerHTML = `
      <div class="board-top"><span>Viaje terminado</span></div>
      <p class="board-title">De vuelta en casa</p>
      <p class="board-detail">Llegaste a Ezeiza el sábado 14 de noviembre.</p>`;
    return;
  }

  const next = MILESTONES[index];
  const after = MILESTONES[index + 1];
  const s = stamp(next.at);
  const diff = Math.max(0, s.ms - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const a = after ? stamp(after.at) : null;

  board.innerHTML = `
    <div class="board-top"><span>Próximo</span><span>Hora de ${esc(next.place)}</span></div>
    <div>
      <p class="board-title">${esc(next.title)}</p>
      <p class="board-when">${cap(longDate(s))}, ${s.hm}</p>
    </div>
    <div class="countdown" role="timer" aria-label="Faltan ${days} días, ${hours} horas y ${minutes} minutos">
      <div><strong>${days}</strong><span>${days === 1 ? 'día' : 'días'}</span></div>
      <div><strong>${pad(hours)}</strong><span>${hours === 1 ? 'hora' : 'horas'}</span></div>
      <div><strong>${pad(minutes)}</strong><span>min</span></div>
    </div>
    <p class="board-detail">${esc(next.detail)}</p>
    ${next.link ? `<a class="btn btn-secondary btn-small" href="${next.link}" ${externalAttrs()}>${icon('external-link')}${esc(next.linkLabel)}</a>` : ''}
    ${a ? `<p class="board-after">Después: <strong>${esc(after.title)}</strong>, ${shortDate(a).toLowerCase()} a las ${a.hm}</p>` : ''}`;
}

function totalsByCurrency() {
  const totals = {};
  state.expenses.forEach((e) => {
    totals[e.currency] = (totals[e.currency] || 0) + e.amount;
  });
  return CURRENCIES.filter((c) => totals[c]).map((c) => ({ currency: c, amount: totals[c] }));
}

function renderStats(now) {
  let tripStat;
  if (now < Date.parse(TRIP.start)) {
    tripStat = { value: Math.max(0, calendarDaysBetween(todayKey(), '2026-10-29')), label: 'Días para salir' };
  } else if (now <= Date.parse(TRIP.end)) {
    const day = Math.min(TRIP.totalDays, calendarDaysBetween('2026-10-29', todayKey()) + 1);
    tripStat = { value: `${day} de ${TRIP.totalDays}`, label: 'Día del viaje' };
  } else {
    tripStat = { value: TRIP.totalDays, label: 'Días de viaje' };
  }

  const visited = state.places.filter((p) => p.visited).length;
  const totals = totalsByCurrency();
  const main = totals.find((t) => t.currency === 'USD') || totals[0];
  const others = totals.filter((t) => t !== main).map((t) => money(t.amount, t.currency));

  $('stats').innerHTML = `
    <div class="stat"><span class="stat-value">${tripStat.value}</span><span class="stat-label">${tripStat.label}</span></div>
    <div class="stat"><span class="stat-value">${visited} de ${state.places.length}</span><span class="stat-label">Lugares visitados</span></div>
    <div class="stat"><span class="stat-value">${main ? money(main.amount, main.currency) : 'USD 0'}</span><span class="stat-label">Gastado</span>${others.length ? `<span class="stat-extra">+ ${others.join(' + ')}</span>` : ''}</div>`;
}

/* Clima */

function weatherKind(code) {
  if (code === 0) return { kind: 'sun', icon: 'sun', text: 'Despejado' };
  if (code === 1 || code === 2) return { kind: 'sun', icon: 'cloud-sun', text: 'Parcialmente nublado' };
  if (code === 3) return { kind: 'cloud', icon: 'cloud', text: 'Nublado' };
  if (code === 45 || code === 48) return { kind: 'fog', icon: 'cloud-fog', text: 'Niebla' };
  if (code >= 51 && code <= 57) return { kind: 'rain', icon: 'cloud-drizzle', text: 'Llovizna' };
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return { kind: 'rain', icon: 'cloud-rain', text: 'Lluvia' };
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return { kind: 'cloud', icon: 'cloud-snow', text: 'Nieve' };
  if (code >= 95) return { kind: 'storm', icon: 'cloud-lightning', text: 'Tormenta' };
  return { kind: 'cloud', icon: 'cloud', text: 'Variable' };
}

async function loadWeather() {
  try {
    const entries = await Promise.all(Object.entries(WEATHER_PLACES).map(async ([key, p]) => {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lon}`
        + '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max'
        + `&timezone=${encodeURIComponent(p.tz)}&forecast_days=16`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      return [key, json.daily];
    }));
    state.weather = { fetchedAt: Date.now(), daily: Object.fromEntries(entries) };
    state.weatherError = false;
    save(STORAGE.weather, state.weather);
  } catch (error) {
    state.weatherError = true;
  }
  renderWeather();
}

function renderWeather() {
  document.querySelectorAll('#weatherTabs button').forEach((b) => {
    b.setAttribute('aria-selected', String(b.dataset.place === ui.weatherPlace));
  });

  const place = WEATHER_PLACES[ui.weatherPlace];
  const daily = state.weather && state.weather.daily ? state.weather.daily[ui.weatherPlace] : null;
  const today = todayKey();
  const firstDay = place.from > today ? place.from : today;
  const tripDays = calendarDaysBetween(place.from, place.to) + 1;
  const days = [];

  if (daily && Array.isArray(daily.time)) {
    const codes = daily.weather_code || daily.weathercode || [];
    daily.time.forEach((day, i) => {
      if (day < firstDay || day > place.to) return;
      days.push({
        key: day,
        code: codes[i],
        max: Math.round(daily.temperature_2m_max[i]),
        min: Math.round(daily.temperature_2m_min[i]),
        rain: daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : null
      });
    });
  }

  $('weatherDays').innerHTML = days.map((d) => {
    const p = dayParts(d.key);
    const w = weatherKind(d.code);
    return `
      <div class="wday" data-kind="${w.kind}" role="group" aria-label="${cap(longDate(p))}: ${w.text}, máxima ${d.max}°, mínima ${d.min}°">
        <span class="wday-name">${cap(DAYS_SHORT[weekday(p)])}</span>
        <span class="wday-date">${p.d} ${MONTHS_SHORT[p.m - 1]}</span>
        ${icon(w.icon)}
        <span class="wday-temp">${d.max}° <span>/ ${d.min}°</span></span>
        ${d.rain != null ? `<span class="wday-rain">Lluvia ${d.rain}%</span>` : ''}
      </div>`;
  }).join('');

  const status = $('weatherStatus');
  const updated = state.weather ? new Date(state.weather.fetchedAt) : null;
  const updatedText = updated ? `${updated.getDate()}/${updated.getMonth() + 1} a las ${pad(updated.getHours())}:${pad(updated.getMinutes())}` : '';

  if (!state.weather && state.weatherError) {
    status.textContent = 'No se pudo cargar el pronóstico. Revisá la conexión y volvé a abrir la app.';
  } else if (!state.weather) {
    status.textContent = 'Cargando pronóstico…';
  } else if (today > place.to) {
    status.textContent = `Ya pasaron los días en ${place.name}.`;
  } else if (!days.length) {
    const from = dayParts(place.from);
    const available = new Date(Date.UTC(from.y, from.m - 1, from.d - 15));
    status.textContent = `El pronóstico de ${place.name} aparece desde el ${available.getUTCDate()} de ${MONTHS[available.getUTCMonth()]}, 16 días antes.`;
  } else {
    const remaining = calendarDaysBetween(firstDay, place.to) + 1 - days.length;
    const prefix = state.weatherError ? `Sin conexión: pronóstico del ${updatedText}.` : `Actualizado el ${updatedText}.`;
    status.textContent = remaining > 0 && days.length < tripDays
      ? `${prefix} Los días que faltan aparecen a medida que se acerque la fecha.`
      : prefix;
  }
}

function renderQuickLinks() {
  $('quickLinks').innerHTML = QUICK_LINKS.map((l) => `
    <li>
      <a class="row" href="${l.href}" ${externalAttrs()}>
        <span class="row-icon">${icon(l.icon)}</span>
        <span class="row-main"><span class="row-title">${esc(l.title)}</span><span class="row-sub">${esc(l.sub)}</span></span>
        <span class="row-end">${icon('external-link')}</span>
      </a>
    </li>`).join('');
}

/* ---------- VIAJE ---------- */

function ticket(f) {
  const first = stamp(f.segments[0].dep);
  const legs = f.segments.map((s, i) => {
    const dep = stamp(s.dep);
    const arr = stamp(s.arr);
    let layover = '';
    if (i > 0) {
      const prev = stamp(f.segments[i - 1].arr);
      const overnight = prev.key !== dep.key;
      layover = `<div class="layover">${icon('clock')}<span>Escala en ${esc(s.from.city)}: ${duration(dep.ms - prev.ms)}${overnight ? '. Pasás la noche' : ''}</span></div>`;
    }
    return `
      ${layover}
      <div class="leg">
        <div class="leg-end">
          <span class="leg-time">${dep.hm}</span>
          <span class="leg-code">${s.from.code}</span>
          <span class="leg-city">${esc(s.from.city)}</span>
          ${dep.key !== first.key ? `<span class="leg-day">${shortDate(dep)}</span>` : ''}
        </div>
        <div class="leg-mid"><strong>${s.num}</strong>${icon('plane')}<span>${duration(arr.ms - dep.ms)}</span></div>
        <div class="leg-end right">
          <span class="leg-time">${arr.hm}</span>
          <span class="leg-code">${s.to.code}</span>
          <span class="leg-city">${esc(s.to.city)}</span>
          ${arr.key !== dep.key ? `<span class="leg-day">${shortDate(arr)}</span>` : ''}
        </div>
      </div>
      ${s.op ? `<p class="leg-op">${esc(s.op)}</p>` : '<div class="leg-gap"></div>'}`;
  }).join('');

  return `
    <article class="ticket">
      <header class="ticket-head">
        <div>
          <p class="ticket-airline">${esc(f.airline)}</p>
          ${f.fare ? `<p class="ticket-fare">${esc(f.fare)}</p>` : ''}
        </div>
        ${codeChip('Reserva', f.ref)}
      </header>
      ${legs}
      <div class="perf" aria-hidden="true"></div>
      <dl class="facts">
        ${f.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}
      </dl>
    </article>`;
}

function hotelCard(now) {
  const h = HOTEL;
  const freeCancel = now <= Date.parse(h.freeCancelUntil);
  const cancel = freeCancel
    ? `Gratis hasta el miércoles 28/10 a las 23:59, hora de Nueva York. Después cuesta ${h.cancelFee}.`
    : `Ya no es gratis: cancelar cuesta ${h.cancelFee}.`;
  return `
    <article class="card stay">
      <div class="ticket-head" style="padding:0">
        <p class="stay-name">${esc(h.name)}</p>
      </div>
      <div class="stay-links">
        <a href="${LINKS.hotelMap}" ${externalAttrs()}>${icon('map-pin')}<span>${esc(h.address)}</span></a>
        <a href="tel:${h.phone.replace(/[^+\d]/g, '')}">${icon('phone')}<span>${esc(h.phone)}</span></a>
      </div>
      <div class="stay-dates">
        <div><span>Check‑in</span><strong>${h.checkInDay}</strong><em>${h.checkInHours}</em></div>
        <div><span>Check‑out</span><strong>${h.checkOutDay}</strong><em>${h.checkOutHours}</em></div>
      </div>
      <dl class="facts">
        <div><dt>Habitación</dt><dd>${esc(h.room)}</dd></div>
        <div><dt>Comidas</dt><dd>${esc(h.meals)}</dd></div>
        <div><dt>A nombre de</dt><dd>${esc(h.guestName)}</dd></div>
        <div><dt>Pago</dt><dd>${esc(h.payment)}</dd></div>
        <div><dt>Cancelación</dt><dd>${esc(cancel)}</dd></div>
      </dl>
      <div class="chip-row">${codeChip('Booking', h.confirmation)}${codeChip('PIN', h.pin)}</div>
      <p class="note">${icon('info')}<span>En el check‑in piden documento y tarjeta de crédito.</span></p>
    </article>`;
}

function renderTrip(now) {
  const stations = [
    { stage: 'nyc', at: FLIGHTS.ida.segments[0].dep, title: 'Salís de Ezeiza', body: () => ticket(FLIGHTS.ida) },
    {
      stage: 'nyc', at: '2026-10-30T06:00:00-04:00', title: 'Llegás a JFK',
      body: () => `
        <div class="card">
          <p>Al hotel en subte, pagando con OMNY: acercás la tarjeta contactless o el celular al molinete.</p>
          <p class="note">${icon('info')}<span>El check‑in es a las 15:00. Pedí en recepción que te guarden las valijas mientras tanto.</span></p>
          <div class="button-row">
            <a class="btn btn-secondary btn-small" href="${LINKS.jfkToHotel}" ${externalAttrs()}>${icon('route')}Ruta desde JFK</a>
            <a class="btn btn-secondary btn-small" href="${LINKS.omny}" ${externalAttrs()}>${icon('train-front')}Cómo usar OMNY</a>
          </div>
        </div>`
    },
    { stage: 'nyc', at: '2026-10-30T15:00:00-04:00', title: 'Check‑in en el hotel', body: () => hotelCard(now) },
    {
      stage: 'nyc', at: '2026-11-06T11:00:00-05:00', title: 'Check‑out del hotel',
      body: () => `
        <div class="card">
          <p>Tenés hasta las 11:00. El vuelo a Acapulco sale a las 19:29 de la Terminal 8 de JFK.</p>
          <div class="button-row">
            <a class="btn btn-secondary btn-small" href="${LINKS.hotelToJfk}" ${externalAttrs()}>${icon('route')}Ruta del hotel a JFK</a>
          </div>
        </div>`
    },
    { stage: 'aca', at: FLIGHTS.aca.segments[0].dep, title: 'Vuelo a Acapulco', body: () => ticket(FLIGHTS.aca) },
    { stage: 'aca', at: '2026-11-07T14:28:00-06:00', title: 'Llegás a Acapulco', body: () => '<p class="station-text">Te quedás en lo de un amigo.</p>' },
    { stage: 'aca', at: FLIGHTS.vuelta.segments[0].dep, title: 'Vuelo de vuelta a Buenos Aires', body: () => ticket(FLIGHTS.vuelta) },
    { stage: 'aca', at: TRIP.end, title: 'Llegás a Ezeiza', terminal: true, body: () => '<p class="station-text">Fin del viaje.</p>' }
  ];

  const nextIndex = stations.findIndex((s) => Date.parse(s.at) > now);

  const stages = [
    { key: 'nyc', bullet: 'N', title: 'Nueva York', sub: 'Del 29 de octubre al 6 de noviembre' },
    { key: 'aca', bullet: 'A', title: 'Acapulco', sub: 'Del 6 al 14 de noviembre, con la vuelta a casa' }
  ];

  const html = stages.map((stage) => {
    const items = stations
      .map((s, i) => ({ ...s, index: i }))
      .filter((s) => s.stage === stage.key)
      .map((s) => {
        const st = stamp(s.at);
        const classes = ['station'];
        if (Date.parse(s.at) <= now) classes.push('is-past');
        if (s.index === nextIndex) classes.push('is-next');
        if (s.terminal) classes.push('is-terminal');
        return `
          <li class="${classes.join(' ')}">
            <span class="station-dot" aria-hidden="true"></span>
            <div class="station-body">
              <p class="station-when"><span>${shortDate(st)}</span><strong>${st.hm}</strong>${s.index === nextIndex ? '<span class="tag-next">Próximo</span>' : ''}</p>
              <h3 class="station-title">${esc(s.title)}</h3>
              ${s.body()}
            </div>
          </li>`;
      }).join('');

    return `
      <section class="stage stage-${stage.key}" aria-labelledby="stage-${stage.key}">
        <header class="stage-head">
          <span class="bullet" aria-hidden="true">${stage.bullet}</span>
          <div><h2 id="stage-${stage.key}">${stage.title}</h2><p>${stage.sub}</p></div>
        </header>
        <ol class="stations">${items}</ol>
      </section>`;
  }).join('');

  $('tripLine').innerHTML = `${html}
    <div class="trip-footer">
      <p class="hint">Los tres vuelos se compraron en eDreams. Todos los horarios están en la hora local de cada aeropuerto.</p>
      ${codeChip('eDreams', TRIP.agencyRef)}
    </div>`;
}

/* ---------- LUGARES ---------- */

function mapsUrl(place) {
  const area = place.category === 'Acapulco' ? 'Acapulco, Guerrero'
    : place.category === 'New Jersey' ? 'New Jersey'
    : 'New York, NY';
  const query = place.name.toLowerCase().includes(area.split(',')[0].toLowerCase()) ? place.name : `${place.name}, ${area}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function savePlaces() {
  save(STORAGE.places, state.places);
}

function renderPlaces() {
  const total = state.places.length;
  const visited = state.places.filter((p) => p.visited).length;
  $('placesContext').textContent = total ? `${visited} de ${total} visitados` : 'Tu lista de lugares';
  $('placeProgress').style.width = `${total ? Math.round((visited / total) * 100) : 0}%`;

  document.querySelectorAll('#placeFilter button').forEach((b) => {
    b.setAttribute('aria-selected', String(b.dataset.filter === ui.placeFilter));
  });

  const list = state.places.filter((p) => (
    ui.placeFilter === 'all' || (ui.placeFilter === 'visited' ? p.visited : !p.visited)
  ));

  if (!list.length) {
    const msg = !total ? 'Todavía no hay lugares. Agregá el primero arriba.'
      : ui.placeFilter === 'pending' ? 'No te queda ninguno pendiente.'
      : 'Todavía no marcaste ninguno como visitado.';
    $('placesList').innerHTML = `<li class="empty">${msg}</li>`;
    return;
  }

  $('placesList').innerHTML = list.map((p) => `
    <li class="place-row${p.visited ? ' is-visited' : ''}">
      <button type="button" class="check" data-action="toggle-place" data-id="${esc(p.id)}" aria-pressed="${p.visited}" aria-label="${p.visited ? 'Desmarcar' : 'Marcar'} ${esc(p.name)} como visitado"><span>${icon('check')}</span></button>
      <div class="row-main"><span class="row-title">${esc(p.name)}</span><span class="row-sub">${esc(p.category)}</span></div>
      <a class="icon-btn" href="${mapsUrl(p)}" ${externalAttrs()} aria-label="Ver ${esc(p.name)} en Google Maps">${icon('map')}</a>
      <button type="button" class="icon-btn" data-action="delete-place" data-id="${esc(p.id)}" aria-label="Borrar ${esc(p.name)}">${icon('trash-2')}</button>
    </li>`).join('');
}

function addPlace(event) {
  event.preventDefault();
  const input = $('placeName');
  const name = input.value.trim();
  if (!name) {
    input.focus();
    return;
  }
  state.places.push({ id: `place-${Date.now()}`, name, category: $('placeCategory').value, visited: false, custom: true });
  savePlaces();
  input.value = '';
  if (ui.placeFilter === 'visited') ui.placeFilter = 'all';
  renderPlaces();
  renderStats(Date.now());
  toast('Lugar agregado');
}

function togglePlace(id) {
  const place = state.places.find((p) => p.id === id);
  if (!place) return;
  place.visited = !place.visited;
  savePlaces();
  renderPlaces();
  renderStats(Date.now());
}

function deletePlace(id) {
  const place = state.places.find((p) => p.id === id);
  if (!place) return;
  confirmSheet({
    title: `¿Borrar ${place.name}?`,
    text: 'Se quita de tu lista de lugares.',
    confirmLabel: 'Borrar lugar',
    onConfirm: () => {
      state.places = state.places.filter((p) => p.id !== id);
      savePlaces();
      renderPlaces();
      renderStats(Date.now());
      toast('Lugar borrado');
    }
  });
}

/* ---------- GASTOS ---------- */

function categoryIcon(name) {
  const c = CATEGORIES.find((x) => x.name === name);
  return c ? c.icon : 'ellipsis';
}

function saveExpenses() {
  save(STORAGE.expenses, state.expenses);
}

function renderExpenses() {
  const totals = totalsByCurrency();
  const count = state.expenses.length;
  $('expensesContext').textContent = count ? `${count} ${count === 1 ? 'gasto cargado' : 'gastos cargados'}` : 'Todavía no cargaste gastos';

  if (!totals.length) {
    $('expenseTotals').innerHTML = '<div class="total is-main"><span>Total gastado</span><strong>USD 0</strong></div>';
  } else {
    const ordered = [...totals].sort((a, b) => (a.currency === 'USD' ? -1 : b.currency === 'USD' ? 1 : 0));
    $('expenseTotals').innerHTML = ordered.map((t, i) => `
      <div class="total${i === 0 ? ' is-main' : ''}"><span>Total en ${t.currency}</span><strong>${money(t.amount, t.currency)}</strong></div>`).join('');
  }

  // Por categoría, separado por moneda
  const used = totals.map((t) => t.currency);
  $('categoryBlock').hidden = !count;
  if (count) {
    if (!used.includes(ui.catCurrency)) ui.catCurrency = used.includes('USD') ? 'USD' : used[0];
    $('categoryCurrency').innerHTML = used.length > 1
      ? used.map((c) => `<button type="button" role="tab" data-currency="${c}" aria-selected="${c === ui.catCurrency}">${c}</button>`).join('')
      : '';
    $('categoryCurrency').hidden = used.length < 2;

    const byCat = {};
    state.expenses.filter((e) => e.currency === ui.catCurrency).forEach((e) => {
      byCat[e.category] = (byCat[e.category] || 0) + e.amount;
    });
    const rows = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
    const max = rows.length ? rows[0][1] : 1;
    $('categoryBars').innerHTML = rows.map(([cat, amount]) => `
      <div>
        <div class="bar-top"><span>${esc(cat)}</span><strong>${money(amount, ui.catCurrency)}</strong></div>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.max(4, Math.round((amount / max) * 100))}%"></div></div>
      </div>`).join('');
  }

  // Lista agrupada por día
  if (!count) {
    $('expenseList').innerHTML = '<p class="empty">Tocá “Agregar gasto” para cargar el primero.</p>';
    return;
  }

  const groups = {};
  state.expenses.forEach((e) => {
    const key = e.date || 'sin-fecha';
    (groups[key] = groups[key] || []).push(e);
  });

  $('expenseList').innerHTML = Object.keys(groups).sort().reverse().map((key) => {
    const items = groups[key].slice().reverse();
    const sums = {};
    items.forEach((e) => { sums[e.currency] = (sums[e.currency] || 0) + e.amount; });
    const sumText = CURRENCIES.filter((c) => sums[c]).map((c) => money(sums[c], c)).join(' + ');
    const title = /^\d{4}-\d{2}-\d{2}$/.test(key) ? longDate(dayParts(key)) : 'Sin fecha';
    return `
      <section class="day-group">
        <div class="day-head"><h3>${title}</h3><span>${sumText}</span></div>
        <ul class="list">
          ${items.map((e) => {
            const sub = [e.category, e.payment, e.reference ? `Ref. ${e.reference}` : ''].filter(Boolean).join(', ');
            return `
              <li>
                <button type="button" class="row" data-action="edit-expense" data-id="${esc(e.id)}" aria-label="Editar ${esc(e.concept)}, ${money(e.amount, e.currency)}">
                  <span class="row-icon">${icon(categoryIcon(e.category))}</span>
                  <span class="row-main"><span class="row-title">${esc(e.concept)}</span><span class="row-sub">${esc(sub)}</span></span>
                  <span class="amount">${money(e.amount, e.currency).replace(`${e.currency} `, '')}<small>${e.currency}</small></span>
                </button>
              </li>`;
          }).join('')}
        </ul>
      </section>`;
  }).join('');
}

function openExpenseSheet(id) {
  const existing = id ? state.expenses.find((e) => e.id === id) : null;
  const prefs = load(STORAGE.expensePrefs, {}) || {};
  const data = existing || {
    date: todayKey(),
    concept: '',
    category: 'Comida',
    amount: '',
    currency: CURRENCIES.includes(prefs.currency) ? prefs.currency : 'USD',
    payment: PAYMENTS.includes(prefs.payment) ? prefs.payment : 'Tarjeta',
    reference: ''
  };
  const amountValue = existing ? String(existing.amount).replace('.', ',') : '';

  openSheet(`
    <h2 id="sheetTitle">${existing ? 'Editar gasto' : 'Nuevo gasto'}</h2>
    <form class="form" id="expenseForm" novalidate data-id="${existing ? esc(existing.id) : ''}">
      <div class="field">
        <label for="exAmount">Monto</label>
        <div class="amount-input">
          <input id="exAmount" type="text" inputmode="decimal" placeholder="0" value="${esc(amountValue)}" autocomplete="off" data-autofocus />
          <div class="segmented" role="radiogroup" aria-label="Moneda" data-group="currency">
            ${CURRENCIES.map((c) => `<button type="button" role="radio" data-value="${c}" aria-checked="${c === data.currency}">${c}</button>`).join('')}
          </div>
        </div>
        <p class="error" id="exAmountError"></p>
      </div>
      <div class="field">
        <label for="exConcept">Concepto</label>
        <input id="exConcept" type="text" placeholder="Ej: cena en Chinatown" value="${esc(data.concept)}" autocomplete="off" />
        <p class="error" id="exConceptError"></p>
      </div>
      <div class="field">
        <span class="field-label" id="exCategoryLabel">Categoría</span>
        <div class="chips" role="radiogroup" aria-labelledby="exCategoryLabel" data-group="category">
          ${CATEGORIES.map((c) => `<button type="button" class="chip" role="radio" data-value="${esc(c.name)}" aria-checked="${c.name === data.category}">${icon(c.icon)}${esc(c.name)}</button>`).join('')}
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label for="exDate">Fecha</label>
          <input id="exDate" type="date" value="${esc(data.date)}" />
        </div>
        <div class="field">
          <label for="exPayment">Pago</label>
          <select id="exPayment">
            ${PAYMENTS.map((p) => `<option value="${p}"${p === data.payment ? ' selected' : ''}>${p}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="field">
        <label for="exRef">Referencia (opcional)</label>
        <input id="exRef" type="text" placeholder="Código de reserva, voucher…" value="${esc(data.reference || '')}" autocomplete="off" />
      </div>
      <div class="sheet-actions">
        <button type="submit" class="btn btn-primary btn-block">Guardar gasto</button>
        ${existing ? `<button type="button" class="btn btn-danger btn-block" data-action="delete-expense" data-id="${esc(existing.id)}">${icon('trash-2')}Borrar gasto</button>` : ''}
        <button type="button" class="btn btn-ghost btn-block" data-action="close-sheet">Cancelar</button>
      </div>
    </form>`);
}

function groupValue(form, group) {
  const selected = form.querySelector(`[data-group="${group}"] [aria-checked="true"]`);
  return selected ? selected.dataset.value : null;
}

function submitExpense(form) {
  const amount = parseAmount($('exAmount').value);
  const concept = $('exConcept').value.trim();
  let valid = true;

  $('exAmountError').textContent = '';
  $('exConceptError').textContent = '';

  if (!Number.isFinite(amount) || amount <= 0) {
    $('exAmountError').textContent = 'Ingresá un monto mayor a 0.';
    valid = false;
  }
  if (!concept) {
    $('exConceptError').textContent = 'Escribí en qué gastaste.';
    valid = false;
  }
  if (!valid) {
    (Number.isFinite(amount) && amount > 0 ? $('exConcept') : $('exAmount')).focus();
    return;
  }

  const values = {
    amount: Math.round(amount * 100) / 100,
    currency: groupValue(form, 'currency') || 'USD',
    concept,
    category: groupValue(form, 'category') || 'Otros',
    date: $('exDate').value || todayKey(),
    payment: $('exPayment').value,
    reference: $('exRef').value.trim()
  };

  const id = form.dataset.id;
  if (id) {
    const expense = state.expenses.find((e) => e.id === id);
    if (expense) Object.assign(expense, values);
  } else {
    state.expenses.push({ id: `expense-${Date.now()}`, ...values });
  }

  saveExpenses();
  save(STORAGE.expensePrefs, { currency: values.currency, payment: values.payment });
  closeSheet();
  renderExpenses();
  renderStats(Date.now());
  toast(id ? 'Gasto actualizado' : 'Gasto guardado');
}

function deleteExpense(id) {
  const expense = state.expenses.find((e) => e.id === id);
  if (!expense) return;
  confirmSheet({
    title: '¿Borrar este gasto?',
    text: `${expense.concept}, ${money(expense.amount, expense.currency)}.`,
    confirmLabel: 'Borrar gasto',
    onConfirm: () => {
      state.expenses = state.expenses.filter((e) => e.id !== id);
      saveExpenses();
      renderExpenses();
      renderStats(Date.now());
      toast('Gasto borrado');
    }
  });
}

/* ---------- NOTAS ---------- */

let notesTimer;
function handleNotesInput() {
  $('notesStatus').textContent = 'Guardando…';
  clearTimeout(notesTimer);
  notesTimer = setTimeout(saveNotes, 600);
}

function saveNotes() {
  clearTimeout(notesTimer);
  state.notes = $('tripNotes').value;
  if (save(STORAGE.notes, state.notes)) $('notesStatus').textContent = 'Guardado';
}

function renderVouchers() {
  const items = [
    { label: 'Hotel', info: state.hotelInfo },
    { label: 'Vuelo', info: state.flightInfo }
  ].filter((v) => v.info && (v.info.reference || v.info.notes || v.info.amount));

  $('vouchersBlock').hidden = !items.length;
  $('vouchersList').innerHTML = items.map((v) => {
    const parts = [];
    if (v.info.reference) parts.push(`Ref. ${v.info.reference}`);
    if (v.info.notes) parts.push(v.info.notes);
    if (v.info.amount) parts.push(money(v.info.amount, v.info.currency || 'USD'));
    return `<li><div class="row"><span class="row-icon">${icon(v.label === 'Hotel' ? 'bed-double' : 'plane')}</span><span class="row-main"><span class="row-title">${v.label}</span><span class="row-sub">${esc(parts.join('. '))}</span></span></div></li>`;
  }).join('');
}

/* Copia de seguridad */

function exportData() {
  const payload = {
    app: 'nyc-trip',
    version: 1,
    exportedAt: new Date().toISOString(),
    data: {
      places: state.places,
      expenses: state.expenses,
      notes: state.notes,
      hotelInfo: state.hotelInfo,
      flightInfo: state.flightInfo
    }
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `nyc-trip-copia-${todayKey()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
  toast('Copia descargada');
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = () => {
    let payload;
    try {
      payload = JSON.parse(reader.result);
    } catch (error) {
      payload = null;
    }
    const d = payload && payload.app === 'nyc-trip' ? payload.data : null;
    if (!d || !Array.isArray(d.places) || !Array.isArray(d.expenses)) {
      toast('Ese archivo no es una copia de esta app');
      return;
    }
    const when = payload.exportedAt ? new Date(payload.exportedAt) : null;
    const whenText = when && !Number.isNaN(when.getTime()) ? `del ${when.getDate()}/${when.getMonth() + 1}` : 'elegida';
    confirmSheet({
      title: 'Restaurar copia',
      text: `La copia ${whenText} tiene ${d.places.length} lugares y ${d.expenses.length} gastos. Reemplaza lo que tenés ahora en este celular.`,
      confirmLabel: 'Restaurar copia',
      onConfirm: () => {
        save(STORAGE.places, d.places);
        save(STORAGE.expenses, d.expenses);
        save(STORAGE.notes, typeof d.notes === 'string' ? d.notes : '');
        if (d.hotelInfo) save(STORAGE.hotelInfo, d.hotelInfo);
        if (d.flightInfo) save(STORAGE.flightInfo, d.flightInfo);
        loadState();
        $('tripNotes').value = state.notes;
        renderAll();
        toast('Copia restaurada');
      }
    });
  };
  reader.readAsText(file);
}

/* ---------- Render general ---------- */

function renderTimeBased() {
  const now = Date.now();
  renderHero(now);
  renderBoard(now);
  renderStats(now);
  renderTrip(now);
}

function renderAll() {
  renderTimeBased();
  renderWeather();
  renderQuickLinks();
  renderPlaces();
  renderExpenses();
  renderVouchers();
}

/* ---------- Eventos ---------- */

function bindEvents() {
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => setScreen(tab.dataset.target));
  });

  $('weatherTabs').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-place]');
    if (!b) return;
    ui.weatherPlace = b.dataset.place;
    renderWeather();
  });

  $('placeFilter').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-filter]');
    if (!b) return;
    ui.placeFilter = b.dataset.filter;
    renderPlaces();
  });

  $('categoryCurrency').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-currency]');
    if (!b) return;
    ui.catCurrency = b.dataset.currency;
    renderExpenses();
  });

  $('placeForm').addEventListener('submit', addPlace);
  $('addExpenseBtn').addEventListener('click', () => openExpenseSheet(null));
  $('tripNotes').addEventListener('input', handleNotesInput);
  $('tripNotes').addEventListener('blur', saveNotes);
  $('exportBtn').addEventListener('click', exportData);
  $('importBtn').addEventListener('click', () => $('importFile').click());
  $('importFile').addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) importData(file);
    e.target.value = '';
  });

  $('sheetBackdrop').addEventListener('click', closeSheet);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSheet();
  });

  // Acciones con delegación
  document.addEventListener('click', async (e) => {
    const copy = e.target.closest('[data-copy]');
    if (copy) {
      const code = copy.dataset.copy;
      try {
        await navigator.clipboard.writeText(code);
      } catch (error) {
        const ta = document.createElement('textarea');
        ta.value = code;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (err) { /* sin portapapeles */ }
        ta.remove();
      }
      toast(`Copiado: ${code}`);
      return;
    }

    const radio = e.target.closest('[role="radio"]');
    if (radio && radio.closest('[data-group]')) {
      radio.closest('[data-group]').querySelectorAll('[role="radio"]').forEach((r) => {
        r.setAttribute('aria-checked', String(r === radio));
      });
      return;
    }

    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;
    const { action, id } = actionEl.dataset;
    if (action === 'toggle-place') togglePlace(id);
    if (action === 'delete-place') deletePlace(id);
    if (action === 'edit-expense') openExpenseSheet(id);
    if (action === 'delete-expense') deleteExpense(id);
    if (action === 'close-sheet') closeSheet();
    if (action === 'confirm') {
      const fn = confirmAction;
      confirmAction = null;
      closeSheet();
      if (fn) fn();
    }
  });

  document.addEventListener('input', (e) => {
    if (e.target.id === 'exAmount') $('exAmountError').textContent = '';
    if (e.target.id === 'exConcept') $('exConceptError').textContent = '';
  });

  document.addEventListener('submit', (e) => {
    if (e.target.id === 'expenseForm') {
      e.preventDefault();
      submitExpense(e.target);
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    renderTimeBased();
    const age = state.weather ? Date.now() - state.weather.fetchedAt : Infinity;
    if (age > 60 * 60 * 1000) loadWeather();
  });
}

/* ---------- Actualizaciones de la app ---------- */

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', async () => {
    try {
      const hadController = Boolean(navigator.serviceWorker.controller);
      const reg = await navigator.serviceWorker.register('sw.js');
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (hadController) $('updateBar').hidden = false;
      });
      $('updateBtn').addEventListener('click', () => window.location.reload());
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') reg.update().catch(() => {});
      });
    } catch (error) {
      /* sin service worker: la app funciona igual con conexión */
    }
  });
}

/* ---------- Inicio ---------- */

function fillStaticIcons() {
  document.querySelectorAll('[data-icon]').forEach((el) => {
    el.outerHTML = icon(el.dataset.icon);
  });
  $('addPlaceBtn').innerHTML = icon('plus');
  $('addExpenseBtn').innerHTML = `${icon('plus')}Agregar gasto`;
  $('exportBtn').innerHTML = `${icon('download')}Bajar copia`;
  $('importBtn').innerHTML = `${icon('upload')}Restaurar copia`;
}

function init() {
  loadState();
  fillStaticIcons();
  $('tripNotes').value = state.notes;
  bindEvents();
  renderAll();
  loadWeather();
  setInterval(renderTimeBased, 30000);
  registerServiceWorker();
}

init();
