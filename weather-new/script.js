/* script.js */
const API_KEY = '702bee3fa2f5691893b35d9f02bbda01'; // Replace with a valid OpenWeather API key

const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];



setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';

    timeEl.innerHTML = 
        (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + 
        ':' + 
        (minutes < 10 ? '0' + minutes : minutes) + 
        ' ' + `<span id="am-pm">${ampm}</span>`;

    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month];
}, 1000);

document.addEventListener("DOMContentLoaded", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showWeather, showError);
    } else {
        document.getElementById("error-message").textContent = "Geolocation is not supported by this browser.";
    }

    document.getElementById("search-button").addEventListener("click", searchWeather);
});

function showWeather(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    fetchWeatherDataByCoords(lat, lon);
}

function showError(error) {
    document.getElementById("error-message").textContent = "Location access denied. Enable location permissions.";
}

async function fetchWeatherDataByCoords(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
        const data = await response.json();
        updateWeatherUI(data, lat, lon);
    } catch (error) {
        document.getElementById("error-message").textContent = "Failed to fetch weather data.";
    }
}

async function searchWeather() {
    const city = document.getElementById("city-input").value;
    if (!city) {
        document.getElementById("error-message").textContent = "Please enter a city name.";
        return;
    }
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
        const data = await response.json();
        if (data.cod !== 200) {
            document.getElementById("error-message").textContent = "City not found. Please try again.";
            return;
        }
        updateWeatherUI(data, data.coord.lat, data.coord.lon);
    } catch (error) {
        document.getElementById("error-message").textContent = "Failed to fetch weather data.";
    }
}

function updateWeatherUI(data, lat, lon) {
    document.getElementById("location").textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById("temperature").textContent = data.main.temp;
    document.getElementById("humidity").textContent = data.main.humidity;
    document.getElementById("pressure").textContent = data.main.pressure;
    document.getElementById("longitude").textContent = lon;
    document.getElementById("latitude").textContent = lat;
    document.getElementById("timestamp").textContent = new Date().toLocaleString();
}
