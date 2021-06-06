// Varna lat & long
const API_KEY = "225e835d05867cec298d899420be0cdc";
const SEARCH_LIMIT = 3;

// Get Location from API
async function getLocationFromAPI(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${SEARCH_LIMIT}&appid=${API_KEY}`
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}

// Get API Data
async function getDataFromAPI(lat = null, lon = null) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
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

// Change locations in the select
function handleLocations(data, searchResultsNode) {
  data.forEach((result) => {
    const cityOption = document.createElement("option");
    cityOption.textContent = `${result.name} - ${result.country}`;

    searchResultsNode.appendChild(cityOption);
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

// Add previous searches
function handlePreviousSearches(prevSearchCities, prevSearchesNode) {
  const searches = prevSearchCities.map((city) => {
    const searchItem = document.createElement("p");
    searchItem.textContent = city;

    return searchItem;
  });

  searches.forEach((search) => prevSearchesNode.appendChild(search));
}

// Change current weather details
function handleWeatherDetails(data, weatherDetailsNode) {
  const strippedData = data.daily[0];
  const detailsHTML = `<h6>Weather Details</h6>
  <div class="details">
    <p class="details-type">Clouds: <span>${strippedData.clouds} %</span></p>
    <p class="details-humidity">Humidity: <span>${
      strippedData.humidity
    } %</span></p>
    <p class="details-wind">Wind: <span>${strippedData.wind_speed} %</span></p>
    <p class="details-rain-change">Chance of rain: <span>${Math.round(
      strippedData.pop * 100
    )} %</span></p>
  </div>`;

  const detailsWrapper = document.createElement("div");
  detailsWrapper.innerHTML = detailsHTML;
  weatherDetailsNode.appendChild(detailsWrapper);
}

// Change current city
function handleCity(data, currentCity) {
  const citySpan = document.createElement("span");
  citySpan.textContent = data;

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

function getPrevSearchesFromLS() {
  return JSON.parse(localStorage.getItem("previous_searches")) || [];
}

function addToLocalStorage(city) {
  const prevSearches = getPrevSearchesFromLS();

  !prevSearches.includes(city) && prevSearches.splice(0, 0, city);

  localStorage.setItem("previous_searches", JSON.stringify(prevSearches));
}

function checkLSForPrevSearch() {
  const prevSearches = getPrevSearchesFromLS();
  if (!prevSearches) {
    console.log("No prev searches found");
    return false;
  }

  return prevSearches;
}

function debounce(func, timeout) {
  let timer;

  return (...args) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      func(args);
    }, timeout);
  };
}

function handleInputEventListeners() {
  let lookupFromAPI = [];

  // Get DOM Nodes
  const searchInput = document.querySelector("#search");
  const searchResults = document.querySelector("#search-results");

  // Add Event Listeners
  searchInput.addEventListener(
    "keyup",
    debounce(async () => {
      if (searchInput.value) {
        // Location lookup call to API
        lookupFromAPI = await getLocationFromAPI(searchInput.value);
        handleLocations(lookupFromAPI, searchResults);
      }
    }, 800)
  );

  searchInput.addEventListener("change", async () => {
    const [city, country] = searchInput.value.split(" - ");

    const filteredCity = lookupFromAPI.filter((result) => {
      return result.name === city && result.country == country;
    });

    // Create a call to the API
    const dataFromAPI = await getDataFromAPI(
      filteredCity[0].lat,
      filteredCity[0].lon
    );

    clearNodesData();

    const prevSearchCities = checkLSForPrevSearch();
    prevSearchCities.splice(0, 0, city);

    populateData(dataFromAPI, prevSearchCities);
    addToLocalStorage(city);
  });
}

function populateData(dataFromAPI, prevSearchCities) {
  // Get DOM nodes
  const [
    currentTemp,
    feelsLike,
    currentCity,
    currentTimeDate,
    currentWeatherIcon,
    weekdaysCards,
    weatherDetails,
    prevSearches,
  ] = getDomElements();

  // Add current temp & feels like
  handleCurrentTemperature(dataFromAPI, currentTemp, feelsLike);

  // Add current city data
  handleCity(prevSearchCities[0], currentCity);

  // Add current data
  handleTimeAndDate(currentTimeDate);

  // Add weather icon
  handleWeatherType(dataFromAPI, currentWeatherIcon);

  // Add previous searches
  handlePreviousSearches(prevSearchCities, prevSearches);

  // Add data to Weather Details
  handleWeatherDetails(dataFromAPI, weatherDetails);

  //  Add data to flip cards
  handleFlipCards(dataFromAPI, weekdaysCards);

  // Attach observer
  const flipCards = document.querySelectorAll(".flip-card");
  handleObserver(flipCards);
}

function getDomElements() {
  const currentTemp = document.querySelector(".temperature");
  const feelsLike = document.querySelector(".max-min-temperature");
  const currentCity = document.querySelector(".city");
  const currentTimeDate = document.querySelector(".time");
  const currentWeatherIcon = document.querySelector(".weather-icon");
  const weekdaysCards = document.querySelector(".weekdays-cards");
  const weatherDetails = document.querySelector(".weather-details");
  const prevSearches = document.querySelector(".history-search");

  return [
    currentTemp,
    feelsLike,
    currentCity,
    currentTimeDate,
    currentWeatherIcon,
    weekdaysCards,
    weatherDetails,
    prevSearches,
  ];
}

function clearNodesData() {
  const domElements = getDomElements();
  domElements.forEach((element) => (element.textContent = ""));
}

// Main controller
async function main() {
  const prevSearchCities = checkLSForPrevSearch();

  if (prevSearchCities.length > 0) {
    // Location lookup call to API
    const lookupFromAPI = await getLocationFromAPI(prevSearchCities[0]);
    // // Create a call to the API
    const dataFromAPI = await getDataFromAPI(
      lookupFromAPI[0].lat,
      lookupFromAPI[0].lon
    );

    populateData(dataFromAPI, prevSearchCities);
  }

  handleInputEventListeners();
}

main();
