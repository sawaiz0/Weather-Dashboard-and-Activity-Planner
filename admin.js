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
        <button class="btn-edit" onclick="loadEditForm('${entry.id}')">Edit</button>
        <button class="btn-delete" onclick="deleteWeather('${entry.id}')">Delete</button>
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


// ── Load Edit Form ──
async function loadEditForm(id) {
  try {
    const response = await fetch(`${BASE_URL}/weather/${id}`);

    if (!response.ok) {
      throw new Error('Could not fetch entry.');
    }

    const entry = await response.json();

    // Fill the form with existing data
    document.getElementById('editId').value = entry.id;
    document.getElementById('editCity').value = entry.city;
    document.getElementById('editTemperature').value = entry.temperature;
    document.getElementById('editCondition').value = entry.condition;
    document.getElementById('editHumidity').value = entry.humidity;
    document.getElementById('editWind').value = entry.wind;
    document.getElementById('editDate').value = entry.date;

    // Show the edit form
    editFormSection.style.display = 'block';

    // Scroll to the form
    editFormSection.scrollIntoView({ behavior: 'smooth' });

  } catch (error) {
    alert('Could not load entry. Is JSON Server running?');
  }
}

// ── Edit Form Validation ──
function validateEditForm() {
  let isValid = true;

  // City
  const editCity = document.getElementById('editCity');
  const editCityError = document.getElementById('editCityError');
  if (editCity.value.trim() === '') {
    editCityError.textContent = 'City name is required.';
    editCity.classList.add('invalid');
    isValid = false;
  } else {
    editCityError.textContent = '';
    editCity.classList.remove('invalid');
  }

  // Temperature
  const editTemperature = document.getElementById('editTemperature');
  const editTemperatureError = document.getElementById('editTemperatureError');
  if (editTemperature.value.trim() === '') {
    editTemperatureError.textContent = 'Temperature is required.';
    editTemperature.classList.add('invalid');
    isValid = false;
  } else if (editTemperature.value < -60 || editTemperature.value > 60) {
    editTemperatureError.textContent = 'Enter a realistic temperature (-60 to 60).';
    editTemperature.classList.add('invalid');
    isValid = false;
  } else {
    editTemperatureError.textContent = '';
    editTemperature.classList.remove('invalid');
  }

  // Condition
  const editCondition = document.getElementById('editCondition');
  const editConditionError = document.getElementById('editConditionError');
  if (editCondition.value === '') {
    editConditionError.textContent = 'Please select a condition.';
    editCondition.classList.add('invalid');
    isValid = false;
  } else {
    editConditionError.textContent = '';
    editCondition.classList.remove('invalid');
  }

  // Humidity
  const editHumidity = document.getElementById('editHumidity');
  const editHumidityError = document.getElementById('editHumidityError');
  if (editHumidity.value.trim() === '') {
    editHumidityError.textContent = 'Humidity is required.';
    editHumidity.classList.add('invalid');
    isValid = false;
  } else if (editHumidity.value < 0 || editHumidity.value > 100) {
    editHumidityError.textContent = 'Humidity must be between 0 and 100.';
    editHumidity.classList.add('invalid');
    isValid = false;
  } else {
    editHumidityError.textContent = '';
    editHumidity.classList.remove('invalid');
  }

  // Wind
  const editWind = document.getElementById('editWind');
  const editWindError = document.getElementById('editWindError');
  if (editWind.value.trim() === '') {
    editWindError.textContent = 'Wind speed is required.';
    editWind.classList.add('invalid');
    isValid = false;
  } else if (editWind.value < 0) {
    editWindError.textContent = 'Wind speed cannot be negative.';
    editWind.classList.add('invalid');
    isValid = false;
  } else {
    editWindError.textContent = '';
    editWind.classList.remove('invalid');
  }

  // Date
  const editDate = document.getElementById('editDate');
  const editDateError = document.getElementById('editDateError');
  if (editDate.value === '') {
    editDateError.textContent = 'Date is required.';
    editDate.classList.add('invalid');
    isValid = false;
  } else {
    editDateError.textContent = '';
    editDate.classList.remove('invalid');
  }

  return isValid;
}

// ── PUT Request — Save Edited Entry ──
async function updateWeather(id, updatedEntry) {
  const response = await fetch(`${BASE_URL}/weather/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedEntry)
  });

  if (!response.ok) {
    throw new Error('Failed to update entry.');
  }

  return await response.json();
}

// ── Edit Form Submit Handler ──
editWeatherForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const isValid = validateEditForm();
  if (!isValid) return;

  const id = document.getElementById('editId').value;

  const updatedEntry = {
    city: document.getElementById('editCity').value.trim(),
    temperature: Number(document.getElementById('editTemperature').value),
    condition: document.getElementById('editCondition').value,
    humidity: Number(document.getElementById('editHumidity').value),
    wind: Number(document.getElementById('editWind').value),
    date: document.getElementById('editDate').value
  };

  try {
    await updateWeather(id, updatedEntry);
    editFormSection.style.display = 'none';
    editWeatherForm.reset();
    fetchAllWeather();
  } catch (error) {
    alert('Could not save changes. Is JSON Server running?');
  }
});

// ── DELETE Request — Delete Entry ──
async function deleteWeather(id) {
  const confirmed = confirm('Are you sure you want to delete this city?');
  if (!confirmed) return;

  try {
    const response = await fetch(`${BASE_URL}/weather/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete entry.');
    }

    fetchAllWeather();

  } catch (error) {
    alert('Could not delete entry. Is JSON Server running?');
  }
}