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



// ── Form Validation ──
function validateForm() {
  let isValid = true;

  // City
  const city = document.getElementById('city');
  const cityError = document.getElementById('cityError');
  if (city.value.trim() === '') {
    cityError.textContent = 'City name is required.';
    city.classList.add('invalid');
    isValid = false;
  } else {
    cityError.textContent = '';
    city.classList.remove('invalid');
  }

  // Temperature
  const temperature = document.getElementById('temperature');
  const temperatureError = document.getElementById('temperatureError');
  if (temperature.value.trim() === '') {
    temperatureError.textContent = 'Temperature is required.';
    temperature.classList.add('invalid');
    isValid = false;
  } else if (temperature.value < -60 || temperature.value > 60) {
    temperatureError.textContent = 'Enter a realistic temperature (-60 to 60).';
    temperature.classList.add('invalid');
    isValid = false;
  } else {
    temperatureError.textContent = '';
    temperature.classList.remove('invalid');
  }

  // Condition
  const condition = document.getElementById('condition');
  const conditionError = document.getElementById('conditionError');
  if (condition.value === '') {
    conditionError.textContent = 'Please select a condition.';
    condition.classList.add('invalid');
    isValid = false;
  } else {
    conditionError.textContent = '';
    condition.classList.remove('invalid');
  }

  // Humidity
  const humidity = document.getElementById('humidity');
  const humidityError = document.getElementById('humidityError');
  if (humidity.value.trim() === '') {
    humidityError.textContent = 'Humidity is required.';
    humidity.classList.add('invalid');
    isValid = false;
  } else if (humidity.value < 0 || humidity.value > 100) {
    humidityError.textContent = 'Humidity must be between 0 and 100.';
    humidity.classList.add('invalid');
    isValid = false;
  } else {
    humidityError.textContent = '';
    humidity.classList.remove('invalid');
  }

  // Wind
  const wind = document.getElementById('wind');
  const windError = document.getElementById('windError');
  if (wind.value.trim() === '') {
    windError.textContent = 'Wind speed is required.';
    wind.classList.add('invalid');
    isValid = false;
  } else if (wind.value < 0) {
    windError.textContent = 'Wind speed cannot be negative.';
    wind.classList.add('invalid');
    isValid = false;
  } else {
    windError.textContent = '';
    wind.classList.remove('invalid');
  }

  // Date
  const date = document.getElementById('date');
  const dateError = document.getElementById('dateError');
  if (date.value === '') {
    dateError.textContent = 'Date is required.';
    date.classList.add('invalid');
    isValid = false;
  } else {
    dateError.textContent = '';
    date.classList.remove('invalid');
  }

  return isValid;
}

// ── POST Request — Add New City ──
async function addWeather(newEntry) {
  const response = await fetch(`${BASE_URL}/weather`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newEntry)
  });

  if (!response.ok) {
    throw new Error('Failed to add city.');
  }

  return await response.json();
}

// ── Form Submit Handler ──
const addWeatherForm = document.getElementById('addWeatherForm');

addWeatherForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const isValid = validateForm();
  if (!isValid) return;

  const newEntry = {
    city: document.getElementById('city').value.trim(),
    temperature: Number(document.getElementById('temperature').value),
    condition: document.getElementById('condition').value,
    humidity: Number(document.getElementById('humidity').value),
    wind: Number(document.getElementById('wind').value),
    date: document.getElementById('date').value
  };

  try {
    await addWeather(newEntry);
    addWeatherForm.reset();
    fetchWeather();
  } catch (error) {
    alert('Something went wrong. Is JSON Server running?');
  }
});