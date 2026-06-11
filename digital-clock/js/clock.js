// ==========================================
// DIGITAL CLOCK - JAVASCRIPT
// ==========================================

const DEFAULT_TIMEZONES = [
  'America/New_York',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Dubai',
  'Australia/Sydney'
];

let timezones = [...DEFAULT_TIMEZONES];
let is24HourFormat = true;
let isDarkMode = false;

// All available timezones grouped by region
const TIMEZONE_GROUPS = {
  'North America': [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Anchorage',
    'Pacific/Honolulu',
    'America/Toronto',
    'America/Mexico_City'
  ],
  'South America': [
    'America/Sao_Paulo',
    'America/Buenos_Aires',
    'America/Bogota',
    'America/Lima'
  ],
  'Europe': [
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Madrid',
    'Europe/Rome',
    'Europe/Amsterdam',
    'Europe/Brussels',
    'Europe/Vienna',
    'Europe/Prague',
    'Europe/Moscow',
    'Europe/Istanbul'
  ],
  'Africa': [
    'Africa/Cairo',
    'Africa/Lagos',
    'Africa/Johannesburg',
    'Africa/Nairobi',
    'Africa/Casablanca'
  ],
  'Middle East': [
    'Asia/Dubai',
    'Asia/Bangkok',
    'Asia/Jakarta',
    'Asia/Manila'
  ],
  'Asia': [
    'Asia/Kolkata',
    'Asia/Bangkok',
    'Asia/Hong_Kong',
    'Asia/Shanghai',
    'Asia/Tokyo',
    'Asia/Seoul',
    'Asia/Singapore',
    'Asia/Jakarta',
    'Asia/Manila',
    'Asia/Bangkok'
  ],
  'Oceania': [
    'Australia/Sydney',
    'Australia/Melbourne',
    'Australia/Brisbane',
    'Australia/Perth',
    'Pacific/Auckland',
    'Pacific/Fiji'
  ],
  'UTC': [
    'UTC',
    'Etc/UTC',
    'Etc/GMT'
  ]
};

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  updateClock();
  setInterval(updateClock, 1000);
  setupEventListeners();
  loadTheme();
});

function initializeApp() {
  renderTimezones();
  updateCurrentTime();
  populateTimezoneList();
}

// ==========================================
// EVENT LISTENERS
// ==========================================

function setupEventListeners() {
  // Toggle format button
  document.getElementById('toggleFormatBtn').addEventListener('click', toggleFormat);

  // Toggle theme button
  document.getElementById('toggleThemeBtn').addEventListener('click', toggleTheme);

  // Add timezone button
  document.getElementById('addTimezoneBtn').addEventListener('click', openModal);

  // Modal controls
  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  document.getElementById('cancelModalBtn').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', closeModal);

  // Search functionality
  document.getElementById('timezoneSearch').addEventListener('input', searchTimezones);

  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyboardShortcuts);
}

function handleKeyboardShortcuts(e) {
  const key = e.key.toLowerCase();
  
  if (key === 't') {
    toggleFormat();
  } else if (key === 'd') {
    toggleTheme();
  } else if (key === 'a') {
    openModal();
  } else if (key === 'escape') {
    closeModal();
  }
}

// ==========================================
// CLOCK UPDATE
// ==========================================

function updateClock() {
  updateCurrentTime();
  updateTimezones();
}

function updateCurrentTime() {
  const now = new Date();
  const day = now.toLocaleDateString('en-US', { weekday: 'long' });
  const date = now.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Update current time display
  const timeString = formatTime(now, is24HourFormat);
  document.getElementById('currentTimeDisplay').textContent = timeString;
  document.getElementById('currentDateDisplay').textContent = date;
  document.getElementById('dayDisplay').textContent = day;

  // Update period for 12-hour format
  const period = now.getHours() >= 12 ? 'PM' : 'AM';
  document.getElementById('timePeriod').textContent = is24HourFormat ? '' : period;
}

function updateTimezones() {
  const container = document.getElementById('timezonesContainer');
  container.innerHTML = '';

  timezones.forEach((tz, index) => {
    const card = createTimezoneCard(tz, index);
    container.appendChild(card);
  });

  // Show/hide empty state
  const emptyState = document.getElementById('emptyState');
  if (timezones.length === 0) {
    emptyState.style.display = 'block';
    container.style.display = 'none';
  } else {
    emptyState.style.display = 'none';
    container.style.display = 'grid';
  }
}

function createTimezoneCard(tz, index) {
  const card = document.createElement('div');
  card.className = 'timezone-card';
  card.style.animationDelay = `${index * 0.05}s`;

  const now = new Date();
  const tzTime = new Date(now.toLocaleString('en-US', { timeZone: tz }));
  const timeString = formatTime(tzTime, is24HourFormat);
  const dateString = tzTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const offset = getTimezoneOffset(tz);
  const tzName = tz.replace(/_/g, ' ').split('/').pop();
  const region = tz.split('/')[0];

  card.innerHTML = `
    <div class="card-header">
      <div class="timezone-name">${tzName}</div>
      <button class="card-close" data-index="${index}" title="Remove this timezone">×</button>
    </div>
    <div class="timezone-time">${timeString}</div>
    <div class="timezone-date">${dateString}</div>
    <div class="timezone-offset">${offset}</div>
  `;

  card.querySelector('.card-close').addEventListener('click', () => removeTimezone(index));
  return card;
}

// ==========================================
// FORMAT UTILITIES
// ==========================================

function formatTime(date, is24Hour) {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  if (!is24Hour) {
    hours = hours % 12 || 12;
  }

  hours = String(hours).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function getTimezoneOffset(tz) {
  const now = new Date();
  const tzTime = new Date(now.toLocaleString('en-US', { timeZone: tz }));
  const utcTime = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
  
  const diffMs = tzTime - utcTime;
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const sign = diffHours >= 0 ? '+' : '';
  
  return `UTC ${sign}${diffHours}`;
}

// ==========================================
// TOGGLE FUNCTIONS
// ==========================================

function toggleFormat() {
  is24HourFormat = !is24HourFormat;
  const btn = document.getElementById('toggleFormatBtn');
  btn.textContent = is24HourFormat ? '24 Hour' : '12 Hour';
  updateClock();
}

function toggleTheme() {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark-mode', isDarkMode);
  const btn = document.getElementById('toggleThemeBtn');
  btn.textContent = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
  saveTheme();
}

function loadTheme() {
  const saved = localStorage.getItem('darkMode');
  if (saved !== null) {
    isDarkMode = JSON.parse(saved);
    document.body.classList.toggle('dark-mode', isDarkMode);
    const btn = document.getElementById('toggleThemeBtn');
    btn.textContent = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
  }
}

function saveTheme() {
  localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
}

// ==========================================
// TIMEZONE MANAGEMENT
// ==========================================

function renderTimezones() {
  updateTimezones();
}

function removeTimezone(index) {
  timezones.splice(index, 1);
  renderTimezones();
}

function addTimezone(tz) {
  if (!timezones.includes(tz)) {
    timezones.push(tz);
    renderTimezones();
  }
  closeModal();
}

// ==========================================
// MODAL FUNCTIONS
// ==========================================

function openModal() {
  document.getElementById('addTimezoneModal').classList.add('active');
  document.getElementById('modalOverlay').classList.add('active');
  document.getElementById('timezoneSearch').focus();
  document.getElementById('timezoneSearch').value = '';
  populateTimezoneList();
}

function closeModal() {
  document.getElementById('addTimezoneModal').classList.remove('active');
  document.getElementById('modalOverlay').classList.remove('active');
}

// ==========================================
// TIMEZONE LIST
// ==========================================

function populateTimezoneList() {
  const list = document.getElementById('timezoneList');
  list.innerHTML = '';

  Object.entries(TIMEZONE_GROUPS).forEach(([region, tzs]) => {
    const regionGroup = document.createElement('div');
    regionGroup.style.marginBottom = '20px';

    const regionTitle = document.createElement('div');
    regionTitle.style.cssText = 'font-weight: 600; margin-bottom: 10px; color: var(--primary-color);';
    regionTitle.textContent = region;
    regionGroup.appendChild(regionTitle);

    tzs.forEach(tz => {
      const item = document.createElement('div');
      item.className = 'timezone-item';
      if (timezones.includes(tz)) {
        item.classList.add('selected');
      }

      const offset = getTimezoneOffset(tz);
      const name = tz.replace(/_/g, ' ');
      item.textContent = `${name} (${offset})`;
      item.addEventListener('click', () => addTimezone(tz));
      regionGroup.appendChild(item);
    });

    list.appendChild(regionGroup);
  });
}

function searchTimezones(e) {
  const searchTerm = e.target.value.toLowerCase();
  const items = document.querySelectorAll('.timezone-item');
  const groups = document.querySelectorAll('[style*="margin-bottom: 20px"]');

  let visibleCount = 0;
  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    const isMatch = text.includes(searchTerm);
    item.style.display = isMatch ? 'block' : 'none';
    if (isMatch) visibleCount++;
  });

  // Show/hide region groups
  groups.forEach(group => {
    const items = group.querySelectorAll('.timezone-item');
    const hasVisible = Array.from(items).some(item => item.style.display !== 'none');
    group.style.display = hasVisible ? 'block' : 'none';
  });
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function exportTimezones() {
  return JSON.stringify(timezones);
}

function importTimezones(data) {
  try {
    const imported = JSON.parse(data);
    if (Array.isArray(imported)) {
      timezones = imported;
      renderTimezones();
      return true;
    }
  } catch (e) {
    console.error('Invalid timezone data');
  }
  return false;
}

// Console info
console.log('%cDigital Clock Ready! 🕐', 'color: #667eea; font-size: 16px; font-weight: bold;');
console.log('%cKeyboard shortcuts:', 'color: #666; font-weight: bold;');
console.log('T = Toggle 12/24 hour format');
console.log('D = Toggle dark/light mode');
console.log('A = Add timezone');
console.log('Esc = Close modal');
