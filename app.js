const tripConfig = {
  title: 'NYC Trip 2026',
  startDate: '2026-10-30',
  endDate: '2026-11-06',
  hotelName: 'The Gregorian New York City',
  city: 'New York',
  latitude: 40.7128,
  longitude: -74.0060,
  timezone: 'America/New_York'
};

const defaultPlaces = [
  { id: 'downtown', name: 'Downtown / Financial District', category: 'Manhattan', visited: false, custom: false },
  { id: 'newjersey', name: 'New Jersey', category: 'New Jersey', visited: false, custom: false },
  { id: 'centralpark', name: 'Central Park', category: 'Parque', visited: false, custom: false },
  { id: 'timessquare', name: 'Times Square', category: 'Manhattan', visited: false, custom: false },
  { id: 'rockefeller', name: 'Rockefeller Center', category: 'Manhattan', visited: false, custom: false },
  { id: 'edge', name: 'Edge', category: 'Mirador', visited: false, custom: false },
  { id: 'brooklyn', name: 'Brooklyn', category: 'Brooklyn', visited: false, custom: false }
];

const storageKeys = {
  places: 'nycPlaces',
  expenses: 'nycExpenses',
  notes: 'nycNotes',
  hotelInfo: 'nycHotelInfo',
  flightInfo: 'nycFlightInfo'
};

const weatherIcons = {
  0: '☀️',
  1: '🌤️',
  2: '⛅',
  3: '🌥️',
  45: '🌫️',
  48: '🌫️',
  51: '🌦️',
  53: '🌧️',
  55: '🌧️',
  56: '🌧️',
  57: '🌧️',
  61: '🌧️',
  63: '🌧️',
  65: '🌧️',
  66: '🌧️',
  67: '🌧️',
  71: '❄️',
  73: '❄️',
  75: '❄️',
  77: '❄️',
  80: '🌧️',
  81: '🌧️',
  82: '⛈️',
  85: '🌨️',
  86: '🌨️',
  95: '⛈️',
  96: '⛈️',
  99: '⛈️'
};

const state = {
  places: [],
  expenses: [],
  notes: '',
  hotelInfo: { reference: '', notes: '', amount: '', currency: 'USD' },
  flightInfo: { reference: '', notes: '', amount: '', currency: 'USD' }
};

const elements = {
  countdownStatus: document.getElementById('countdownStatus'),
  countDays: document.getElementById('countDays'),
  countHours: document.getElementById('countHours'),
  countMinutes: document.getElementById('countMinutes'),
  statRemaining: document.getElementById('statRemaining'),
  statTotalDays: document.getElementById('statTotalDays'),
  statTotalSpent: document.getElementById('statTotalSpent'),
  statPending: document.getElementById('statPending'),
  statVisited: document.getElementById('statVisited'),
  placeName: document.getElementById('placeName'),
  placeCategory: document.getElementById('placeCategory'),
  addPlaceBtn: document.getElementById('addPlaceBtn'),
  placesList: document.getElementById('placesList'),
  placeProgressText: document.getElementById('placeProgressText'),
  placeProgressFill: document.getElementById('placeProgressFill'),
  expenseDate: document.getElementById('expenseDate'),
  expenseConcept: document.getElementById('expenseConcept'),
  expenseCategory: document.getElementById('expenseCategory'),
  expenseAmount: document.getElementById('expenseAmount'),
  expenseCurrency: document.getElementById('expenseCurrency'),
  expensePayment: document.getElementById('expensePayment'),
  expenseReference: document.getElementById('expenseReference'),
  addExpenseBtn: document.getElementById('addExpenseBtn'),
  totalUsd: document.getElementById('totalUsd'),
  totalArs: document.getElementById('totalArs'),
  expenseCategorySummary: document.getElementById('expenseCategorySummary'),
  expenseList: document.getElementById('expenseList'),
  weatherStatus: document.getElementById('weatherStatus'),
  weatherList: document.getElementById('weatherList'),
  tripNotes: document.getElementById('tripNotes'),
  notesSaved: document.getElementById('notesSaved'),
  hotelSummary: document.getElementById('hotelSummary'),
  hotelDetails: document.getElementById('hotelDetails'),
  hotelReference: document.getElementById('hotelReference'),
  hotelNotes: document.getElementById('hotelNotes'),
  hotelAmount: document.getElementById('hotelAmount'),
  hotelCurrency: document.getElementById('hotelCurrency'),
  toggleHotelInfo: document.getElementById('toggleHotelInfo'),
  saveHotelInfo: document.getElementById('saveHotelInfo'),
  flightSummary: document.getElementById('flightSummary'),
  flightDetails: document.getElementById('flightDetails'),
  flightReference: document.getElementById('flightReference'),
  flightNotes: document.getElementById('flightNotes'),
  flightAmount: document.getElementById('flightAmount'),
  flightCurrency: document.getElementById('flightCurrency'),
  toggleFlightInfo: document.getElementById('toggleFlightInfo'),
  saveFlightInfo: document.getElementById('saveFlightInfo'),
  navButtons: document.querySelectorAll('.nav-btn')
};

function loadStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn('Error leyendo localStorage', key, error);
    return fallback;
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Error guardando localStorage', key, error);
  }
}

function getTripDates() {
  const start = new Date(`${tripConfig.startDate}T00:00:00`);
  const end = new Date(`${tripConfig.endDate}T23:59:59`);
  return { start, end };
}

function updateCountdown() {
  const now = new Date();
  const { start, end } = getTripDates();

  if (now > end) {
    elements.countdownStatus.textContent = 'Viaje finalizado';
    elements.countDays.textContent = '0';
    elements.countHours.textContent = '00';
    elements.countMinutes.textContent = '00';
    return;
  }

  if (now >= start && now <= end) {
    elements.countdownStatus.textContent = 'Ya estás en NYC';
    const diff = end - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    elements.countDays.textContent = String(days).padStart(2, '0');
    elements.countHours.textContent = String(hours).padStart(2, '0');
    elements.countMinutes.textContent = String(minutes).padStart(2, '0');
    return;
  }

  const diff = start - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  elements.countdownStatus.textContent = 'Faltan para el viaje';
  elements.countDays.textContent = String(days).padStart(2, '0');
  elements.countHours.textContent = String(hours).padStart(2, '0');
  elements.countMinutes.textContent = String(minutes).padStart(2, '0');
}

function updateSummary() {
  const visited = state.places.filter((place) => place.visited).length;
  const totalPlaces = state.places.length;
  const pending = totalPlaces - visited;
  const totalDays = Math.ceil((getTripDates().end - getTripDates().start) / (1000 * 60 * 60 * 24)) + 1;
  const totalUsd = state.expenses
    .filter((expense) => expense.currency === 'USD')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalArs = state.expenses
    .filter((expense) => expense.currency === 'ARS')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  elements.statRemaining.textContent = pending;
  elements.statVisited.textContent = visited;
  elements.statTotalDays.textContent = totalDays;
  elements.statTotalSpent.textContent = `$${(totalUsd + totalArs).toFixed(2)}`;
}

function renderPlaces() {
  elements.placesList.innerHTML = '';

  state.places.forEach((place) => {
    const item = document.createElement('div');
    item.className = 'place-item';

    const label = document.createElement('label');
    label.className = 'place-label';
    label.innerHTML = `
      <strong>${place.name}</strong>
      <small>${place.category}</small>
    `;

    const actions = document.createElement('div');
    actions.className = 'place-actions';

    const checkbox = document.createElement('button');
    checkbox.type = 'button';
    checkbox.textContent = place.visited ? '✅ Visitado' : '⬜ Marcar';
    checkbox.addEventListener('click', () => togglePlaceVisited(place.id));
    actions.appendChild(checkbox);

    if (place.custom) {
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.textContent = 'Eliminar';
      removeBtn.addEventListener('click', () => deletePlace(place.id));
      actions.appendChild(removeBtn);
    }

    item.append(label, actions);
    elements.placesList.appendChild(item);
  });

  const visited = state.places.filter((place) => place.visited).length;
  const total = state.places.length;
  elements.placeProgressText.textContent = `${visited} de ${total} lugares visitados`;
  const percent = total ? Math.round((visited / total) * 100) : 0;
  elements.placeProgressFill.style.width = `${percent}%`;
}

function addPlace() {
  const name = elements.placeName.value.trim();
  const category = elements.placeCategory.value;

  if (!name) {
    elements.placeName.focus();
    return;
  }

  const id = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
  state.places.push({ id, name, category, visited: false, custom: true });
  saveStorage(storageKeys.places, state.places);
  elements.placeName.value = '';
  elements.placeCategory.value = 'Otro';
  renderPlaces();
  updateSummary();
}

function togglePlaceVisited(id) {
  state.places = state.places.map((place) =>
    place.id === id ? { ...place, visited: !place.visited } : place
  );
  saveStorage(storageKeys.places, state.places);
  renderPlaces();
  updateSummary();
}

function deletePlace(id) {
  state.places = state.places.filter((place) => place.id !== id);
  saveStorage(storageKeys.places, state.places);
  renderPlaces();
  updateSummary();
}

function renderExpenses() {
  elements.expenseList.innerHTML = '';

  state.expenses.slice().reverse().forEach((expense) => {
    const item = document.createElement('div');
    item.className = 'expense-item';

    const label = document.createElement('div');
    label.className = 'expense-label';
    label.innerHTML = `
      <strong>${expense.concept}</strong>
      <small>${expense.date} • ${expense.category} • ${expense.payment}</small>
      ${expense.reference ? `<small>Ref: ${expense.reference}</small>` : ''}
    `;

    const amount = document.createElement('div');
    amount.innerHTML = `<strong>${expense.currency} $${Number(expense.amount).toFixed(2)}</strong>`;

    const actions = document.createElement('div');
    actions.className = 'expense-actions';
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = 'Eliminar';
    removeBtn.addEventListener('click', () => deleteExpense(expense.id));
    actions.appendChild(removeBtn);

    item.append(label, amount, actions);
    elements.expenseList.appendChild(item);
  });

  const totals = state.expenses.reduce(
    (acc, expense) => {
      const value = Number(expense.amount) || 0;
      if (expense.currency === 'USD') acc.usd += value;
      if (expense.currency === 'ARS') acc.ars += value;
      acc.byCategory[expense.category] = (acc.byCategory[expense.category] || 0) + value;
      return acc;
    },
    { usd: 0, ars: 0, byCategory: {} }
  );

  elements.totalUsd.textContent = `$${totals.usd.toFixed(2)}`;
  elements.totalArs.textContent = `$${totals.ars.toFixed(2)}`;

  elements.expenseCategorySummary.innerHTML = '';
  Object.entries(totals.byCategory).forEach(([category, amount]) => {
    const card = document.createElement('div');
    card.className = 'summary-item';
    card.innerHTML = `
      <strong>${category}</strong>
      <small>$${amount.toFixed(2)}</small>
    `;
    elements.expenseCategorySummary.appendChild(card);
  });
}

function addExpense() {
  const date = elements.expenseDate.value;
  const concept = elements.expenseConcept.value.trim();
  const category = elements.expenseCategory.value;
  const amount = Number(elements.expenseAmount.value);
  const currency = elements.expenseCurrency.value;
  const payment = elements.expensePayment.value;
  const reference = elements.expenseReference.value.trim();

  if (!date || !concept || !amount || amount <= 0) {
    alert('Completa fecha, concepto y monto válido.');
    return;
  }

  const id = `expense-${Date.now()}`;
  state.expenses.push({ id, date, concept, category, amount, currency, payment, reference });
  saveStorage(storageKeys.expenses, state.expenses);
  elements.expenseDate.value = '';
  elements.expenseConcept.value = '';
  elements.expenseAmount.value = '';
  elements.expenseReference.value = '';
  renderExpenses();
  updateSummary();
}

function deleteExpense(id) {
  state.expenses = state.expenses.filter((expense) => expense.id !== id);
  saveStorage(storageKeys.expenses, state.expenses);
  renderExpenses();
  updateSummary();
}

async function loadWeather() {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${tripConfig.latitude}&longitude=${tripConfig.longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,weathercode&timezone=${encodeURIComponent(tripConfig.timezone)}&forecast_days=16`;

  elements.weatherStatus.textContent = 'Cargando pronóstico...';
  elements.weatherList.innerHTML = '';

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error al obtener datos de clima');
    }
    const data = await response.json();
    const availableDates = data.daily?.time || [];
    const start = tripConfig.startDate;
    const end = tripConfig.endDate;

    if (!availableDates.length) {
      elements.weatherStatus.textContent = 'No se encontraron datos de clima.';
      return;
    }

    const hasStart = availableDates.includes(start);
    const hasEnd = availableDates.includes(end);

    if (!hasStart || !hasEnd) {
      elements.weatherStatus.textContent = 'El clima exacto todavía no está disponible. Se actualizará automáticamente cuando falten pocos días para el viaje.';
      return;
    }

    elements.weatherStatus.textContent = 'Pronóstico disponible para las fechas del viaje.';

    data.daily.time.forEach((day, index) => {
      const min = data.daily.temperature_2m_min[index];
      const max = data.daily.temperature_2m_max[index];
      const rainProbability = data.daily.precipitation_probability_max[index];
      const precipitation = data.daily.precipitation_sum[index];
      const code = data.daily.weathercode[index];
      const icon = weatherIcons[code] || '🌤️';

      const item = document.createElement('div');
      item.className = 'weather-item';
      item.innerHTML = `
        <strong>${day}</strong>
        <span>${icon} ${codeDescription(code)}</span>
        <small>Min: ${min}°C • Max: ${max}°C</small>
        <small>Lluvia: ${rainProbability}% • ${precipitation} mm</small>
      `;
      elements.weatherList.appendChild(item);
    });
  } catch (error) {
    console.error(error);
    elements.weatherStatus.textContent = 'No se pudo cargar el clima. Revisa tu conexión e inténtalo de nuevo.';
  }
}

function codeDescription(code) {
  if (code === 0) return 'Despejado';
  if ([1, 2, 3].includes(code)) return 'Parcialmente nublado';
  if ([45, 48].includes(code)) return 'Niebla';
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Lluvias ligeras a moderadas';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Nieve o aguanieve';
  if ([95, 96, 99].includes(code)) return 'Tormentas';
  return 'Clima variable';
}

function loadNotes() {
  elements.tripNotes.value = state.notes;
  elements.notesSaved.textContent = 'Notas guardadas automáticamente';
}

function renderVoucherSummary(type) {
  const info = type === 'hotel' ? state.hotelInfo : state.flightInfo;
  const summaryElement = type === 'hotel' ? elements.hotelSummary : elements.flightSummary;
  const text = [];
  if (info.reference) text.push(`Ref: ${info.reference}`);
  if (info.notes) text.push(info.notes);
  if (info.amount) text.push(`Monto: ${info.currency || 'USD'} ${Number(info.amount).toFixed(2)}`);
  summaryElement.textContent = text.length ? text.join(' • ') : 'No hay información guardada.';
}

function openDetails(type) {
  const info = type === 'hotel' ? state.hotelInfo : state.flightInfo;
  const details = type === 'hotel' ? elements.hotelDetails : elements.flightDetails;
  const btn = type === 'hotel' ? elements.toggleHotelInfo : elements.toggleFlightInfo;

  if (!details.hidden) {
    details.hidden = true;
    btn.textContent = 'Editar';
    return;
  }

  if (type === 'hotel') {
    elements.hotelReference.value = info.reference || '';
    elements.hotelNotes.value = info.notes || '';
    elements.hotelAmount.value = info.amount || '';
    elements.hotelCurrency.value = info.currency || 'USD';
  } else {
    elements.flightReference.value = info.reference || '';
    elements.flightNotes.value = info.notes || '';
    elements.flightAmount.value = info.amount || '';
    elements.flightCurrency.value = info.currency || 'USD';
  }

  details.hidden = false;
  btn.textContent = 'Cerrar';
}

function saveHotelInfo() {
  state.hotelInfo = {
    reference: elements.hotelReference.value.trim(),
    notes: elements.hotelNotes.value.trim(),
    amount: elements.hotelAmount.value.trim(),
    currency: elements.hotelCurrency.value
  };
  saveStorage(storageKeys.hotelInfo, state.hotelInfo);
  renderVoucherSummary('hotel');
  elements.hotelDetails.hidden = true;
  elements.toggleHotelInfo.textContent = 'Editar';
}

function saveFlightInfo() {
  state.flightInfo = {
    reference: elements.flightReference.value.trim(),
    notes: elements.flightNotes.value.trim(),
    amount: elements.flightAmount.value.trim(),
    currency: elements.flightCurrency.value
  };
  saveStorage(storageKeys.flightInfo, state.flightInfo);
  renderVoucherSummary('flight');
  elements.flightDetails.hidden = true;
  elements.toggleFlightInfo.textContent = 'Editar';
}

function loadVoucherInfo() {
  renderVoucherSummary('hotel');
  renderVoucherSummary('flight');
}

function saveNotes() {
  state.notes = elements.tripNotes.value;
  saveStorage(storageKeys.notes, state.notes);
  elements.notesSaved.textContent = 'Notas guardadas';
  setTimeout(() => {
    elements.notesSaved.textContent = 'Notas guardadas automáticamente';
  }, 1200);
}

let notesTimeout;
function handleNotesInput() {
  elements.notesSaved.textContent = 'Guardando...';
  clearTimeout(notesTimeout);
  notesTimeout = setTimeout(saveNotes, 700);
}

function setActiveScreen(targetId) {
  document.querySelectorAll('.screen').forEach((section) => {
    section.classList.toggle('active-screen', section.id === targetId);
  });
  elements.navButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.target === targetId);
  });
}

function initNavigation() {
  elements.navButtons.forEach((button) => {
    button.addEventListener('click', () => setActiveScreen(button.dataset.target));
  });
}

function init() {
  state.places = loadStorage(storageKeys.places, defaultPlaces);
  state.expenses = loadStorage(storageKeys.expenses, []);
  state.notes = loadStorage(storageKeys.notes, '');
  state.hotelInfo = loadStorage(storageKeys.hotelInfo, state.hotelInfo);
  state.flightInfo = loadStorage(storageKeys.flightInfo, state.flightInfo);

  updateCountdown();
  setInterval(updateCountdown, 60000);

  renderPlaces();
  renderExpenses();
  updateSummary();
  loadNotes();
  loadWeather();
  initNavigation();

  elements.addPlaceBtn.addEventListener('click', addPlace);
  elements.addExpenseBtn.addEventListener('click', addExpense);
  elements.toggleHotelInfo.addEventListener('click', () => openDetails('hotel'));
  elements.saveHotelInfo.addEventListener('click', saveHotelInfo);
  elements.toggleFlightInfo.addEventListener('click', () => openDetails('flight'));
  elements.saveFlightInfo.addEventListener('click', saveFlightInfo);
  elements.tripNotes.addEventListener('input', handleNotesInput);
  elements.tripNotes.addEventListener('blur', saveNotes);

  loadVoucherInfo();
  const today = new Date().toISOString().slice(0, 10);
  elements.expenseDate.value = today;
}

init();
