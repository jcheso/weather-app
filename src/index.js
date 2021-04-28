import "./styles.css";
// import Icon from './icon.png';

const weatherController = (() => {
  async function getGeoLocation(location) {
    const geoObj = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=d9e5b08d8639ae39ae8a23305b524d6b`
    );
    const geoData = await geoObj.json();
    return geoData[0];
  }

  async function getWeatherData(geoData) {
    const weatherObj = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${geoData.lat}&lon=${geoData.lon}&exclude={part}&appid=d9e5b08d8639ae39ae8a23305b524d6b`
    );
    const weatherData = await weatherObj.json();
    return weatherData;
  }

  async function callWeatherAPI() {
    const location = displayController.getSearchForm(event);
    const geoData = await getGeoLocation(location);
    const weatherData = await getWeatherData(geoData);
    displayController.updateSite(weatherData);
  }

  return { callWeatherAPI };
})();

const displayController = (() => {
  const addEventListeners = () => {
    const searchForm = document.getElementById("searchForm");
    searchForm.addEventListener("submit", weatherController.callWeatherAPI);
  };

  const getSearchForm = (event) => {
    let location = event.srcElement[0].value;
    event.preventDefault();
    return location;
  };

  const updateSite = (weatherData) => {
    console.table(weatherData);
    // Create function to create weather element for each day and loop through array
  };

  addEventListeners();

  return { getSearchForm, updateSite };
})();

export { weatherController, displayController };
