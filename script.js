const apiKey = "22c9d110361511d8151ed6dab09fe50d";

// INPUTS

const cityInput =
document.getElementById("cityInput");

const searchBtn =
document.getElementById("searchBtn");

const locationBtn =
document.getElementById("locationBtn");


// WEATHER UI

const cityName =
document.getElementById("cityName");

const dateTime =
document.getElementById("dateTime");

const weatherIcon =
document.getElementById("weatherIcon");

const temperature =
document.getElementById("temperature");

const weatherCondition =
document.getElementById("weatherCondition");

const humidity =
document.getElementById("humidity");

const windSpeed =
document.getElementById("windSpeed");

const feelsLike =
document.getElementById("feelsLike");

const visibility =
document.getElementById("visibility");

const sunrise =
document.getElementById("sunrise");

const sunset =
document.getElementById("sunset");

const weatherAdvice =
document.getElementById("weatherAdvice");

const forecastContainer =
document.getElementById("forecastContainer");

const hourlyContainer =
document.getElementById("hourlyContainer");

const aqiValue =
document.getElementById("aqiValue");

const aqiText =
document.getElementById("aqiText");


// MAP

let map;
let marker;

const themeToggle =
document.getElementById("themeToggle");


// SEARCH BUTTON

searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if(city === ""){

        alert("Please enter city name");
        return;

    }

    getWeatherData(city);

});


// ENTER KEY SEARCH

cityInput.addEventListener("keypress", (e) => {

    if(e.key === "Enter"){

        getWeatherData(cityInput.value);

    }

});


// LOCATION WEATHER

locationBtn.addEventListener("click", () => {

    navigator.geolocation.getCurrentPosition(
        async(position) => {

            const lat = position.coords.latitude;

            const lon = position.coords.longitude;

            const url =
`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            const response = await fetch(url);

            const data = await response.json();

            updateWeatherUI(data);

            getForecast(data.name);

        }
    );

});


// GET WEATHER DATA

async function getWeatherData(city){

    try{

        const weatherURL =
`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        const response =
        await fetch(weatherURL);

        const data =
        await response.json();

        if(data.cod != 200){

            alert(data.message);
            return;

        }

        updateWeatherUI(data);

        getForecast(city);

        getHourlyForecast(city);

    }

    catch(error){

        console.log(error);

        alert("Something went wrong");

    }

}


// UPDATE WEATHER UI

function updateWeatherUI(data){

    cityName.innerText =
    `${data.name}, ${data.sys.country}`;

    temperature.innerText =
    `${Math.round(data.main.temp)}°C`;

    weatherCondition.innerText =
    data.weather[0].main;

    humidity.innerText =
    `${data.main.humidity}%`;

    windSpeed.innerText =
    `${Math.round(data.wind.speed * 3.6)} km/h`;

    feelsLike.innerText =
    `${Math.round(data.main.feels_like)}°C`;

    visibility.innerText =
    `${(data.visibility / 1000).toFixed(1)} km`;

    const iconCode =
    data.weather[0].icon;

    weatherIcon.src =
`https://openweathermap.org/img/wn/${iconCode}@2x.png`;


// DATE

    const today = new Date();

    dateTime.innerText =
    today.toLocaleDateString("en-US",{

        weekday:"long",
        day:"numeric",
        month:"long"

    });



    // SUNRISE SUNSET

    const sunriseTime =
    new Date(data.sys.sunrise * 1000);

    const sunsetTime =
    new Date(data.sys.sunset * 1000);

    sunrise.innerText =
    sunriseTime.toLocaleTimeString([],{

        hour:"2-digit",
        minute:"2-digit"

    });

    sunset.innerText =
    sunsetTime.toLocaleTimeString([],{

        hour:"2-digit",
        minute:"2-digit"

    });



    // WEATHER ADVICE

    generateWeatherAdvice(data);



    // MAP

    updateMap(
        data.coord.lat,
        data.coord.lon
    );

    getAQI(
        data.coord.lat,
        data.coord.lon
    );


    // DYNAMIC BACKGROUND

    changeBackground(data.weather[0].main);

}



// WEATHER ADVICE

function generateWeatherAdvice(data){

    const temp =
    data.main.temp;

    const humidityValue =
    data.main.humidity;

    const weatherMain =
    data.weather[0].main;

    let advice = "";

    if(temp > 35){

        advice =
" High temperature detected. Stay hydrated and avoid direct sunlight.";

    }

    else if(weatherMain === "Rain"){

        advice =
" Rain expected. Carry an umbrella before going outside.";

    }

    else if(humidityValue > 80){

        advice =
" Humidity is high today. Wear light clothes and drink enough water.";

    }

    else if(weatherMain === "Clouds"){

        advice =
" Cloudy weather today. Good time for a walk or outdoor activities.";

    }

    else{

        advice =
" Weather looks pleasant today. Enjoy your day.";

    }

    weatherAdvice.innerText = advice;

}

// HOURLY FORECAST

async function getHourlyForecast(city){

    const url =
`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    const response =
    await fetch(url);

    const data =
    await response.json();

    hourlyContainer.innerHTML = "";

    const hourlyData =
    data.list.slice(0,8);

    hourlyData.forEach(item=>{

        const card =
        document.createElement("div");

        card.classList.add("hourly-card");

        const time =
        new Date(item.dt_txt)
        .toLocaleTimeString([],{
            hour:"2-digit",
            minute:"2-digit"
        });

        card.innerHTML = `

            <h3>${time}</h3>

            <img src=
"https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png">

            <p>${Math.round(item.main.temp)}°C</p>

        `;

        hourlyContainer.appendChild(card);

    });

}

// FORECAST

async function getForecast(city){

    const forecastURL =
`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    const response =
    await fetch(forecastURL);

    const data =
    await response.json();

    forecastContainer.innerHTML = "";

    const dailyForecast =
    data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    dailyForecast.forEach(item => {

        const date =
        new Date(item.dt_txt);

        const card =
        document.createElement("div");

        card.classList.add("forecast-card");

        card.innerHTML = `

            <h3>
                ${date.toLocaleDateString("en-US",{
                    weekday:"short"
                })}
            </h3>

            <img src=
"https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png">

            <p>
                ${Math.round(item.main.temp)}°C
            </p>

            <p>
                ${item.weather[0].main}
            </p>

        `;

        forecastContainer.appendChild(card);

    });

}

// AQI

async function getAQI(lat, lon){

    const url =
`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    const response =
    await fetch(url);

    const data =
    await response.json();

    const aqi =
    data.list[0].main.aqi;

    let text = "";

    if(aqi === 1){

        text = "🟢 Good";

    }

    else if(aqi === 2){

        text = "🟡 Fair";

    }

    else if(aqi === 3){

        text = "🟠 Moderate";

    }

    else if(aqi === 4){

        text = "🔴 Poor";

    }

    else{

        text = "⚫ Very Poor";

    }

    aqiValue.innerText = aqi;

    aqiText.innerText = text;

}

// MAP

function updateMap(lat, lon){

    if(map){

        map.remove();

    }

    map =
    L.map("map").setView([lat, lon], 10);

    L.tileLayer(

'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

        {
            attribution:
"&copy; OpenStreetMap contributors"
        }

    ).addTo(map);

    marker =
    L.marker([lat, lon]).addTo(map);

}



// DYNAMIC BACKGROUND

function changeBackground(weather){

    const body =
    document.body;

    if(weather === "Clear"){

        body.style.background =
"linear-gradient(135deg,#f59e0b,#f97316,#fb7185)";

    }

    else if(weather === "Clouds"){

        body.style.background =
"linear-gradient(135deg,#64748b,#94a3b8,#cbd5e1)";

    }

    else if(weather === "Rain"){

        createRain();

        body.style.background =
"linear-gradient(135deg,#0f172a,#1e3a8a,#2563eb)";

    }

    else{

        document.querySelector(".rain-container").innerHTML = "";

        body.style.background =
"linear-gradient(135deg,#0f172a,#1e293b,#334155)";

    }

}


// DEFAULT CITY

getWeatherData("Delhi, IN");

themeToggle.addEventListener("click",()=>{

    document.body.classList.toggle("light-mode");

    const icon =
    themeToggle.querySelector("i");

    if(document.body.classList.contains("light-mode")){

        icon.classList.remove("fa-moon");

        icon.classList.add("fa-sun");

    }

    else{

        icon.classList.remove("fa-sun");

        icon.classList.add("fa-moon");

    }

});

// RAIN EFFECT

function createRain(){

    const rainContainer =
    document.querySelector(".rain-container");

    rainContainer.innerHTML = "";

    for(let i=0;i<80;i++){

        const drop =
        document.createElement("div");

        drop.classList.add("rain-drop");

        drop.style.left =
        Math.random()*100 + "vw";

        drop.style.animationDuration =
        Math.random()*1 + 0.5 + "s";

        drop.style.opacity =
        Math.random();

        rainContainer.appendChild(drop);

    }

}