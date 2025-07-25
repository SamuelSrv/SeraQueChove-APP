async function getLonAndLat(cityName, apiKey) {
    const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${apiKey}`;

    const response = await fetch(geocodeURL);
    if (!response.ok) {

        throw new Error(`Bad response from geocoding API: ${response.status}`);
    }

    const data = await response.json();
    if (data.length === 0) {
        return null; 
    }
    
    return data[0];
}

async function getWeatherData(lon, lat, apiKey) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;
    const response = await fetch(weatherURL);
    
    if (!response.ok) {
        throw new Error(`Bad response from weather API: ${response.status}`);
    }
    
    return await response.json();
}



async function fetchWeather() {
    const searchInput = document.getElementById('search').value.trim();
    const weatherDataSection = document.getElementById("weather-data");
    const apiKey = "999cd8207c8a6c43ac10551444adea2d";

    weatherDataSection.style.display = "block";

    if (searchInput === "") {
        weatherDataSection.innerHTML = `
        <div>
          <h2>Campo Vazio!</h2>
          <p>Por favor, digite o nome de uma cidade válida.</p>
        </div>`;
        return;
    }

    
    try {
       
        weatherDataSection.innerHTML = `<p>Buscando...</p>`;
        
        const geocodeData = await getLonAndLat(searchInput, apiKey);


        if (!geocodeData) {
            weatherDataSection.innerHTML = `
            <div>
              <h2>Cidade não encontrada: "${searchInput}"</h2>
              <p>Por favor, tente com um nome de cidade válido.</p>
            </div>`;
            return;
        }

        const weatherData = await getWeatherData(geocodeData.lon, geocodeData.lat, apiKey);


        weatherDataSection.style.display = "flex";
        weatherDataSection.innerHTML = `
          <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png" alt="${weatherData.weather[0].description}" width="100" />
          <div>
            <h2>${weatherData.name}</h2>
            <p><strong>Temperatura:</strong> ${Math.round(weatherData.main.temp)}°C</p>
            <p><strong>Clima:</strong> ${weatherData.weather[0].description}</p>
          </div>`;

    } catch (error) {
        console.error("Failed to fetch weather data:", error);
        weatherDataSection.innerHTML = `<p>Ocorreu um erro ao buscar os dados. Tente novamente mais tarde.</p>`;
    } finally {

        document.getElementById("search").value = "";
    }
}