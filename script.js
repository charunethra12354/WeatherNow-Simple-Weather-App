const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("city");

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keypress", function(event) {
if (event.key === "Enter") {
getWeather();
}
});

async function getWeather() {
const city = cityInput.value.trim();

if (city === "") {
    document.getElementById("message").textContent =
        "Please enter a city name.";
    return;
}

const message = document.getElementById("message");
message.textContent = "Loading weather...";

try {
    // Find the city's location
    const geoURL =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const geoResponse = await fetch(geoURL);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
        message.textContent = "City not found. Please try again.";
        return;
    }

    const location = geoData.results[0];
    const latitude = location.latitude;
    const longitude = location.longitude;

    // Get current weather information
    const weatherURL =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;

    const weatherResponse = await fetch(weatherURL);
    const weatherData = await weatherResponse.json();

    if (!weatherResponse.ok || !weatherData.current) {
        throw new Error("Weather data unavailable");
    }

    const current = weatherData.current;

    // Convert weather codes into descriptions
    const weatherConditions = {
        0: "Clear Sky ☀️",
        1: "Mainly Clear 🌤️",
        2: "Partly Cloudy ⛅",
        3: "Overcast ☁️",
        45: "Foggy 🌫️",
        48: "Foggy 🌫️",
        51: "Light Drizzle 🌦️",
        53: "Drizzle 🌦️",
        55: "Heavy Drizzle 🌧️",
        61: "Light Rain 🌧️",
        63: "Moderate Rain 🌧️",
        65: "Heavy Rain 🌧️",
        71: "Light Snow 🌨️",
        73: "Snowfall 🌨️",
        75: "Heavy Snow ❄️",
        80: "Rain Showers 🌦️",
        81: "Rain Showers 🌧️",
        82: "Heavy Rain Showers ⛈️",
        95: "Thunderstorm ⛈️",
        96: "Thunderstorm with Hail ⛈️",
        99: "Thunderstorm with Hail ⛈️"
    };

    const condition =
        weatherConditions[current.weather_code] || "Unknown Conditions";

    // Display weather information
    document.getElementById("cityName").textContent =
        `${location.name}, ${location.country}`;

    document.getElementById("temperature").textContent =
        `Temperature: ${current.temperature_2m}°C`;

    document.getElementById("condition").textContent =
        `Condition: ${condition}`;

    document.getElementById("humidity").textContent =
        `Humidity: ${current.relative_humidity_2m}%`;

    document.getElementById("wind").textContent =
        `Wind Speed: ${current.wind_speed_10m} km/h`;

    message.textContent = "Weather updated successfully!";

} catch (error) {
    message.textContent =
        "Unable to load weather. Please check your internet connection and try again.";
}

}
