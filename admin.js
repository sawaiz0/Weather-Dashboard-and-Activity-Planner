// ── Selecting Elements ──
const weatherTableBody = document.getElementById('weatherTableBody');
const loadingMsg = document.getElementById('loadingMsg');
const errorMsg = document.getElementById('errorMsg');
const totalCities = document.getElementById('totalCities');
const avgTemp = document.getElementById('avgTemp');
const commonCondition = document.getElementById('commonCondition');
const editFormSection = document.getElementById('editFormSection');
const editWeatherForm = document.getElementById('editWeatherForm');
const cancelEdit = document.getElementById('cancelEdit');

// ── Base URL ──
const BASE_URL = 'http://localhost:3000';

// ── Fetch and Display All Weather ──
async function fetchAllWeather() {
  showLoading(true);

  try {
    const response = await fetch(`${BASE_URL}/weather`);

    if (!response.ok) {
      throw new Error('Server error');
    }

    const weatherData = await response.json();
    displayStats(weatherData);
    displayTable(weatherData);
    showLoading(false);

  } catch (error) {
    showLoading(false);
    showError(true);
  }
}

// ── Display Statistics ──
function displayStats(weatherData) {
  // Total cities
  totalCities.textContent = weatherData.length;

  // Average temperature
  const avg = weatherData.reduce((sum, entry) => sum + entry.temperature, 0) / weatherData.length;
  avgTemp.textContent = avg.toFixed(1) + '°C';

  // Most common condition
  const conditionCount = {};
  weatherData.forEach(entry => {
    conditionCount[entry.condition] = (conditionCount[entry.condition] || 0) + 1;
  });
  const mostCommon = Object.keys(conditionCount).reduce((a, b) =>
    conditionCount[a] > conditionCount[b] ? a : b
  );
  commonCondition.textContent = mostCommon;
}

// ── Display Table ──
function displayTable(weatherData) {
  if (weatherData.length === 0) {
    weatherTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No data found.</td></tr>';
    return;
  }

  weatherTableBody.innerHTML = weatherData.map(entry => `
    <tr>
      <td>${entry.city}</td>
      <td>${entry.temperature}</td>
      <td>${entry.condition}</td>
      <td>${entry.humidity}</td>
      <td>${entry.wind}</td>
      <td>${entry.date}</td>
      <td>
        <button class="btn-edit" onclick="loadEditForm(${entry.id})">Edit</button>
        <button class="btn-delete" onclick="deleteWeather(${entry.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

// ── Show or Hide Loading ──
function showLoading(isLoading) {
  if (isLoading) {
    loadingMsg.classList.remove('hidden');
    errorMsg.classList.add('hidden');
  } else {
    loadingMsg.classList.add('hidden');
  }
}

// ── Show or Hide Error ──
function showError(isError) {
  if (isError) {
    errorMsg.classList.remove('hidden');
  } else {
    errorMsg.classList.add('hidden');
  }
}

// ── Cancel Edit ──
cancelEdit.addEventListener('click', () => {
  editFormSection.style.display = 'none';
  editWeatherForm.reset();
});

// ── Run on Page Load ──
fetchAllWeather();