import { API_KEY } from "./env.js";

// Varna lat & long
const LAT = 43.2167;
const LON = 27.9167;
const CITY = "Varna";

// Get API Data
async function getDataFromAPI() {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${LAT}&lon=${LON}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) throw new Error("Something went wrong!");

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}

// Intersection observer
function handleObserver(cards) {
  const options = { root: null, rootMargin: "80px", threshold: 1.0 };

  let observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
      // Uncomment if you want cards to close when not viewed
      //  else {
      //   entry.target.classList.remove("active");
      // }
    });
  }, options);

  cards.forEach((card) => {
    observer.observe(card);
  });
}

// Change current temperature
function handleCurrentTemperature(data, currentTempNode, minmaxNode) {
  const temp = Math.round(data.current.temp);
  const maxTemp = Math.round(data.daily[0].temp.max);
  const minTemp = Math.round(data.daily[0].temp.min);

  currentTempNode.insertAdjacentHTML("afterbegin", `${temp}&#8451;`);
  const minMaxSpan = document.createElement("span");
  minMaxSpan.innerHTML = `${maxTemp}&deg; &sol; <span class="min">${minTemp}&deg;</span>`;
  minmaxNode.appendChild(minMaxSpan);
}

// Change weather type and image
function handleWeatherType(data, imgNode) {
  const img = document.createElement("img");
  const typeSpan = document.createElement("p");

  img.src = `https://openweathermap.org/img/wn/${data.current.weather[0].icon}.png`;
  imgNode.appendChild(img);

  typeSpan.classList.add("type");
  typeSpan.textContent = data.current.weather[0].main;
  imgNode.appendChild(typeSpan);
}

// Change current weather details
function handleWeatherDetails(
  data,
  [currentWeatherType, currentHumidity, currentWind, currentRainChance]
) {
  const strippedData = data.daily[0];
  const details = {
    0: [currentWeatherType, `${strippedData.clouds} %`],
    1: [currentHumidity, `${strippedData.humidity} %`],
    2: [currentWind, `${strippedData.wind_speed} m/s`],
    3: [currentRainChance, `${Math.round(strippedData.pop * 100)} %`],
  };

  for (const key in details) {
    const detailSpan = document.createElement("span");
    detailSpan.textContent = details[key][1];
    details[key][0].appendChild(detailSpan);
  }
}

// Change current city
function handleCity(data, currentCity) {
  const citySpan = document.createElement("span");
  citySpan.textContent = CITY;

  currentCity.appendChild(citySpan);
}

// Change time and date
function handleTimeAndDate(timeDateNode = null) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const current = new Date();
  const day = days[current.getDay()];
  const date = current.getDate();
  const month = months[current.getMonth()];
  const year = current.getFullYear();
  const hours = current.getHours();
  const minutes = current.getMinutes();

  const currentFormated = `${hours}:${minutes} - ${day}, ${date} ${month} ${year}`;
  const timeDateSpan = document.createElement("span");
  timeDateSpan.textContent = currentFormated;

  timeDateNode.appendChild(timeDateSpan);
}

// Change flip cards info
function handleFlipCards(data, weekDaysNode) {
  const strippedData = data.daily.slice(1, 7);
  let currentDay = new Date().getDay();

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const newCards = strippedData.map(
    (item, index) =>
      `<div class="box-week">
                <div class="flip-card">
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                    <h5 class="day">${
                      currentDay + index >= 7
                        ? days[currentDay + index - 7]
                        : days[currentDay + index]
                    }</h5>
                    <p>
                        <ion-icon name="information-circle-outline"></ion-icon>
                    </p>
                    </div>
                    <div class="flip-card-back">
                    <h6>${Math.round(item.temp.max)}° / ${Math.round(
        item.temp.min
      )}°</h6>
                    <img src="https://openweathermap.org/img/wn/${
                      item.weather[0].icon
                    }.png"  alt="Weather icon type">
                    <p>Cloudy <span>${item.clouds} %</span></p>
                    <p>Humidity <span>${item.humidity} %</span></p>
                    <p>Windy <span>${item.wind_speed} m/s</span></p>
                    <p>Chance of rain <span>${Math.round(
                      item.pop * 100
                    )} %</span></p>
                    </div>
                </div>
            </div>
            </div>`
  );

  newCards.forEach((card) => {
    let divNode = document.createElement("div");
    divNode.className = "col-12 col-sm-6 col-md-4 col-lg";
    divNode.innerHTML = card;
    weekDaysNode.appendChild(divNode);
  });
}

// Main controller
async function main() {
  // Get DOM nodes
  const currentTemp = document.querySelector(".temperature");
  const feelsLike = document.querySelector(".max-min-temperature");
  const currentCity = document.querySelector(".city");
  const currentTimeDate = document.querySelector(".time");
  const currentWeatherIcon = document.querySelector(".weather-icon");
  const currentWeatherType = document.querySelector(".details-type");
  const currentHumidity = document.querySelector(".details-humidity");
  const currentWind = document.querySelector(".details-wind");
  const currentRainChance = document.querySelector(".details-rain-change");
  const weekdaysCards = document.querySelector(".weekdays-cards");

  // Create a call to the API
  const dataFromAPI = await getDataFromAPI();

  // Add current temp & feels like
  handleCurrentTemperature(dataFromAPI, currentTemp, feelsLike);

  // Add current city data
  handleCity(dataFromAPI, currentCity);

  // Add current data
  handleTimeAndDate(currentTimeDate);

  // Add weather icon
  handleWeatherType(dataFromAPI, currentWeatherIcon);

  // Add data to Weather Details
  handleWeatherDetails(dataFromAPI, [
    currentWeatherType,
    currentHumidity,
    currentWind,
    currentRainChance,
  ]);

  //  Add data to flip cards
  handleFlipCards(dataFromAPI, weekdaysCards);

  // Attach observer
  const flipCards = document.querySelectorAll(".flip-card");
  handleObserver(flipCards);
}

main();
