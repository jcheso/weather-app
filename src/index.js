import "./styles.css";

const weatherController = (() => {
  let getGeoLocation = async (location) => {
    const geoObj = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=d9e5b08d8639ae39ae8a23305b524d6b`
    );
    const geoData = await geoObj.json();
    return geoData[0];
  };

  let getWeatherData = async (geoData) => {
    const weatherObj = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${geoData.lat}&lon=${geoData.lon}&exclude={part}&appid=d9e5b08d8639ae39ae8a23305b524d6b&units=metric`
    );
    const weatherData = await weatherObj.json();
    return weatherData;
  };

  let returnSearch = async () => {
    const location = displayController.getSearchForm(event);
    const geoData = await getGeoLocation(location);
    const weatherData = await getWeatherData(geoData);
    displayController.displayLocation(geoData);
    displayController.displayCurrentWeather(weatherData.current);
    displayController.displayDailyForecast(weatherData.daily);
  };
  return { returnSearch };
})();

const displayController = (() => {
  const addEventListeners = () => {
    const searchForm = document.getElementById("searchForm");
    searchForm.addEventListener("submit", weatherController.returnSearch);
  };

  const getSearchForm = (event) => {
    let location = event.srcElement[0].value;
    event.preventDefault();
    return location;
  };

  const updateSite = (geoData, weatherData) => {
    displayLocation(geoData);
    displayCurrentWeather(weatherData.current);
    displayDailyForecast(weatherData.daily);
  };

  const displayLocation = (geoData) => {
    const currentWeatherContainer = document.getElementById(
      "location-container"
    );
    removeAllChildNodes(currentWeatherContainer);
    const city = geoData.name;
    const country = geoData.country;
    createDivElementContent(
      "location-container",
      "location",
      "location",
      `${city}, ${country}`
    );
  };

  const displayCurrentWeather = (currentWeather) => {
    const currentWeatherContainer = document.getElementById(
      "weather-container"
    );
    removeAllChildNodes(currentWeatherContainer);
    insertWeatherElements("weather-container", currentWeather, "current");
  };

  const displayDailyForecast = (dailyForecast) => {
    const currentWeatherContainer = document.getElementById(
      "forecast-container"
    );
    removeAllChildNodes(currentWeatherContainer);

    dailyForecast.forEach((day, index) => {
      insertWeatherElements("forecast-container", day, index);
    });
  };

  const getDate = (weather) => {
    let date = new Date(weather.dt * 1000);
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let dayOfWeek = date.getDay();
    let weekday = new Array(7);
    weekday[0] = "Monday";
    weekday[1] = "Tuesday";
    weekday[2] = "Wednesday";
    weekday[3] = "Thursday";
    weekday[4] = "Friday";
    weekday[5] = "Saturday";
    weekday[6] = "Sunday";
    let newDate = `${weekday[dayOfWeek]} ${day}/${month + 1}/${year}`;

    return newDate;
  };

  const insertWeatherElements = (parentContainer, weather, index) => {
    if (index !== "current") {
      weather.temp = weather.temp.max;
    }
    if (index === "current" && typeof weather.rain !== "undefined") {
      weather.rain = weather.rain["1h"];
    }
    let date = ''
    if (index === "current"){
       date = "Right Now"
    }else{
       date = getDate(weather);
    }


    createDivElement(
      parentContainer,
      `weather-wrapper-${index}`,
      "weather-wrapper"
    );

    createDivElementContent(`weather-wrapper-${index}`, `dt-${index}`, "dt", `${date}`);

    createDivElement(
      `weather-wrapper-${index}`,
      `temp-wrapper-${index}`,
      "temp-wrapper"
    );
    createWeatherIcon(
      `temp-wrapper-${index}`,
      "weather-img",
      weather.weather[0].icon
    );
    createDivElementContent(
      `temp-wrapper-${index}`,
      "temp",
      "temp",
      `${weather.temp}°`
    );

    if (typeof weather.rain !== "undefined") {
      createDivElementContent(
        `weather-wrapper-${index}`,
        "precipitation",
        "weather-stat",
        `Precipitation: ${weather.rain}%`
      );
    } else {
      createDivElementContent(
        `weather-wrapper-${index}`,
        "humidity",
        "weather-stat",
        `Precipitation: 0%`
      );
    }

    createDivElementContent(
      `weather-wrapper-${index}`,
      "humidity",
      "weather-stat",
      `Humidity: ${weather.humidity}%`
    );
    createDivElementContent(
      `weather-wrapper-${index}`,
      "wind",
      "weather-stat",
      `Wind: ${weather.wind_speed} m/s at ${weather.wind_deg}°`
    );
  };

  const removeAllChildNodes = (parent) => {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  };

  const createDivElement = (targetId, id, className) => {
    const insertLocation = document.getElementById(targetId);
    const newDiv = document.createElement("div");
    newDiv.setAttribute("id", id);
    newDiv.setAttribute("class", className);
    insertLocation.appendChild(newDiv);
  };

  const createDivElementContent = (targetId, id, className, content) => {
    const insertLocation = document.getElementById(targetId);
    const newDiv = document.createElement("div");
    newDiv.setAttribute("id", id);
    newDiv.setAttribute("class", className);
    newDiv.innerHTML = content;
    insertLocation.appendChild(newDiv);
  };

  const createWeatherIcon = (targetId, className, icon) => {
    const insertLocation = document.getElementById(targetId);
    const newImg = document.createElement("img");
    newImg.setAttribute("class", className);
    newImg.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    insertLocation.appendChild(newImg);
  };

  addEventListeners();

  return {
    getSearchForm,
    updateSite,
    displayLocation,
    displayCurrentWeather,
    displayDailyForecast,
  };
})();

export { weatherController, displayController };
