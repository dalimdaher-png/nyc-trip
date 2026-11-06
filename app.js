'use strict';

/* =========================================================
   NYC Trip 2026
   App estática (GitHub Pages). Los datos del viaje están
   en este archivo.
   ========================================================= */

/* ---------- Almacenamiento: solo guarda el último pronóstico ---------- */

const STORAGE = {
  weather: 'nycWeatherCache'
};

/* ---------- Datos del viaje ----------
   Todas las fechas llevan la zona horaria del lugar, así
   las cuentas regresivas funcionan desde cualquier país. */

const TRIP = {
  start: '2026-11-06T19:29:00-05:00',
  end: '2026-11-14T21:50:00-03:00',
  totalDays: 9,
  agencyRef: '25439634673'
};

const LINKS = {
  american: 'https://www.aa.com/',
  aeromexico: 'https://aeromexico.com/'
};

const FLIGHTS = {
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
      ['Equipaje', 'Una maleta en bodega, además del equipaje de mano y el artículo personal'],
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
  { at: '2026-11-05T19:29:00-05:00', place: 'Nueva York', title: 'Se habilita el check‑in de American', detail: 'En la app de American, 24 h antes del vuelo. Reserva DTKXEH.', link: LINKS.american, linkLabel: 'Ir a American' },
  { at: '2026-11-06T19:29:00-05:00', place: 'Nueva York', title: 'Vuelo a Acapulco', detail: 'AA 1892 sale de JFK Terminal 8 a las 19:29. Pasás la noche en Dallas.' },
  { at: '2026-11-07T11:23:00-06:00', place: 'Dallas', title: 'Conexión en Dallas', detail: 'AA 3740 sale a las 11:23 hacia Acapulco.' },
  { at: '2026-11-07T14:28:00-06:00', place: 'Acapulco', title: 'Llegada a Acapulco', detail: 'Aterrizás a las 14:28. Te quedás en lo de un amigo.' },
  { at: '2026-11-13T19:06:00-06:00', place: 'Acapulco', title: 'Vuelo a Buenos Aires', detail: 'AM 307 sale a las 19:06. Pasás la noche en Ciudad de México.' },
  { at: '2026-11-14T09:35:00-06:00', place: 'Ciudad de México', title: 'Conexión en Ciudad de México', detail: 'AM 30 sale a las 09:35 hacia Ezeiza.' },
  { at: '2026-11-14T21:50:00-03:00', place: 'Buenos Aires', title: 'Llegada a Buenos Aires', detail: 'Aterrizás en Ezeiza a las 21:50.' }
];

/* Pronóstico: muestra solo los días que vas a estar en cada ciudad. */
const WEATHER_PLACES = {
  aca: { name: 'Acapulco', lat: 16.8531, lon: -99.8237, tz: 'America/Mexico_City', from: '2026-11-07', to: '2026-11-13' }
};

const QUICK_LINKS = [
  { icon: 'plane', title: 'American Airlines', sub: 'Reserva DTKXEH', href: LINKS.american },
  { icon: 'plane', title: 'Aeroméxico', sub: 'Reserva KYYVFK', href: LINKS.aeromexico }
];

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

function codeChip(label, code) {
  return `<button type="button" class="code-chip" data-copy="${esc(code)}" aria-label="Copiar ${esc(label.toLowerCase())} ${esc(code)}"><small>${esc(label)}</small><strong>${esc(code)}</strong>${icon('copy')}</button>`;
}

function externalAttrs() {
  return 'target="_blank" rel="noopener noreferrer"';
}

/* ---------- Estado ---------- */

const state = {
  weather: null,
  weatherError: false
};

const ui = {
  weatherPlace: 'aca'
};

function loadState() {
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
    const days = calendarDaysBetween(todayKey(), '2026-11-06');
    if (days <= 0) return { text: 'Hoy viajás a Acapulco', stage: 'aca' };
    if (days === 1) return { text: 'Mañana viajás a Acapulco', stage: 'aca' };
    return { text: `Faltan ${days} días`, stage: 'aca' };
  }
  if (now < t('2026-11-07T14:28:00-06:00')) return { text: 'Rumbo a Acapulco', stage: 'aca' };
  if (now < t('2026-11-13T19:06:00-06:00')) {
    const day = Math.min(7, Math.floor((now - t('2026-11-07T00:00:00-06:00')) / 86400000) + 1);
    return { text: `Día ${day} de 7 en Acapulco`, stage: 'aca' };
  }
  if (now < t(TRIP.end)) return { text: 'Volviendo a Buenos Aires', stage: 'aca' };
  return { text: 'Viaje terminado', stage: 'aca' };
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

function renderStats(now) {
  let tripStat;
  if (now < Date.parse(TRIP.start)) {
    tripStat = { value: Math.max(0, calendarDaysBetween(todayKey(), '2026-11-06')), label: 'Días para salir' };
  } else if (now <= Date.parse(TRIP.end)) {
    const day = Math.min(TRIP.totalDays, calendarDaysBetween('2026-11-06', todayKey()) + 1);
    tripStat = { value: `${day} de ${TRIP.totalDays}`, label: 'Día del viaje' };
  } else {
    tripStat = { value: TRIP.totalDays, label: 'Días de viaje' };
  }

  $('stats').innerHTML = `
    <div class="stat"><span class="stat-value">${tripStat.value}</span><span class="stat-label">${tripStat.label}</span></div>`;
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

function renderTrip(now) {
  const stations = [
    { stage: 'aca', at: FLIGHTS.aca.segments[0].dep, title: 'Vuelo a Acapulco', body: () => ticket(FLIGHTS.aca) },
    { stage: 'aca', at: '2026-11-07T14:28:00-06:00', title: 'Llegás a Acapulco', body: () => '<p class="station-text">Te quedás en lo de un amigo.</p>' },
    { stage: 'aca', at: FLIGHTS.vuelta.segments[0].dep, title: 'Vuelo de vuelta a Buenos Aires', body: () => ticket(FLIGHTS.vuelta) },
    { stage: 'aca', at: TRIP.end, title: 'Llegás a Ezeiza', terminal: true, body: () => '<p class="station-text">Fin del viaje.</p>' }
  ];

  const nextIndex = stations.findIndex((s) => Date.parse(s.at) > now);

  const stages = [
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
      <p class="hint">Los vuelos se compraron en eDreams. Todos los horarios están en la hora local de cada aeropuerto.</p>
      ${codeChip('eDreams', TRIP.agencyRef)}
    </div>`;
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
}

/* ---------- Eventos ---------- */

function bindEvents() {
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => setScreen(tab.dataset.target));
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
}

function init() {
  loadState();
  fillStaticIcons();
  bindEvents();
  renderAll();
  loadWeather();
  setInterval(renderTimeBased, 30000);
  registerServiceWorker();
}

init();
