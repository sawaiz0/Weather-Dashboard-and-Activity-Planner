// ── Selecting Elements from the HTML ──
const weatherList = document.getElementById('weatherList');
const loadingMsg = document.getElementById('loadingMsg');
const errorMsg = document.getElementById('errorMsg');
const searchInput = document.getElementById('searchInput');
const filterCondition = document.getElementById('filterCondition');

// ── Base URL for JSON Server ──
const BASE_URL = 'http://localhost:3000';

// ── Fetch and Display Weather ──
async function fetchWeather() {
  showLoading(true);

  try {
    const response = await fetch(`${BASE_URL}/weather`);

    if (!response.ok) {
      throw new Error('Server error');
    }

    const weatherData = await response.json();
    const activitiesData = await fetchActivities();

    displayWeather(weatherData, activitiesData);
    showLoading(false);

  } catch (error) {
    showLoading(false);
    showError(true);
  }
}

// ── Fetch Activities from JSON Server ──
async function fetchActivities() {
  const response = await fetch(`${BASE_URL}/activities`);
  const data = await response.json();
  return data;
}

// ── Display Weather Cards ──
function displayWeather(weatherData, activitiesData) {
  // Get search and filter values
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCondition = filterCondition.value;

  // Filter the data
  let filtered = weatherData.filter(entry => {
    const matchesSearch = entry.city.toLowerCase().includes(searchTerm);
    const matchesCondition = selectedCondition === '' || entry.condition === selectedCondition;
    return matchesSearch && matchesCondition;
  });

  // If nothing matches
  if (filtered.length === 0) {
    weatherList.innerHTML = '<p style="text-align:center; color:#666;">No cities found.</p>';
    return;
  }

  // Build the cards
  weatherList.innerHTML = filtered.map(entry => {
    const activity = activitiesData.find(a => a.condition === entry.condition);
    const suggestions = activity ? activity.suggestions : [];

    return `
      <div class="weather-card">
        <h3>${entry.city}</h3>
        <p class="temp">${entry.temperature}°C</p>
        <p>🌤 ${entry.condition}</p>
        <p>💧 Humidity: ${entry.humidity}%</p>
        <p>💨 Wind: ${entry.wind} km/h</p>
        <p>📅 ${entry.date}</p>
        <div class="activities">
          <p>Suggested Activities:</p>
          <ul>
            ${suggestions.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }).join('');
}

// ── Show or Hide Loading Message ──
function showLoading(isLoading) {
  if (isLoading) {
    loadingMsg.classList.remove('hidden');
    errorMsg.classList.add('hidden');
    weatherList.innerHTML = '';
  } else {
    loadingMsg.classList.add('hidden');
  }
}

// ── Show or Hide Error Message ──
function showError(isError) {
  if (isError) {
    errorMsg.classList.remove('hidden');
  } else {
    errorMsg.classList.add('hidden');
  }
}

// ── Search and Filter Event Listeners ──
searchInput.addEventListener('input', async () => {
  const weatherData = await fetch(`${BASE_URL}/weather`).then(r => r.json());
  const activitiesData = await fetchActivities();
  displayWeather(weatherData, activitiesData);
});

filterCondition.addEventListener('change', async () => {
  const weatherData = await fetch(`${BASE_URL}/weather`).then(r => r.json());
  const activitiesData = await fetchActivities();
  displayWeather(weatherData, activitiesData);
});

// ── Run on Page Load ──
fetchWeather();