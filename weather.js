const iconElement = document.querySelector(".weather-icon");
const notificationElement = document.querySelector(".notification");
const tempValueElement = document.querySelector(".temperature p");
const descElement = document.querySelector(".description p");
const locationElement = document.querySelector(".location p");

const weather = {};
const iconId = {};

weather.temperature = {
  unit: "celsius",
};

const KELVIN = 273;
// api key
const key = "f2e4cd6b175202d624e8da22700412ee";
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
  notificationElement.style.display = "block";
  notificationElement.innerHTML =
    "<p> Browser doesnit support geolocation </p>";
}

function setPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  getWeather(latitude, longitude);
}

function showError(error) {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

function getWeather(latitude, longitude) {
  let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
  console.log(api); //to check the key is working
  fetch(api)
    .then(function (response) {
      let data = response.json();
      return data;
    })
    .then(function (data) {
      weather.temperature.value = Math.floor(data.main.temp - KELVIN);
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
      weather.city = data.name;
      weather.country = data.sys.country;
    })
    .then(function () {
      displayWeather();
    });

  function displayWeather() {
    tempValueElement.innerHTML = ` Todays temperature in celcius : ${weather.temperature.value}degrees<span>C</span>`;
    descElement.innerHTML = `Weather  is : ${weather.description}`;
    locationElement.innerHTML = `Location: ${weather.city}`;
    iconElement.innerHTML = `<img src ="http://openweathermap.org/img/wn/10d.png">`;
  }
}
function celsiusToFarenheit(temperature) {
  return (temperature * 9) / 5 + 32;
}

tempValueElement.addEventListener("click", function () {
  if (weather.temperature.value === undefined) return;
  if (weather.temperature.unit === "celsius") {
    let farenheit = celsiusToFarenheit(weather.temperature.value);
    farenheit = Math.floor(farenheit);
    tempValueElement.innerHTML = `Todays temperature in Farenheit :${farenheit}degrees<span>F</span>`;
  } else {
    tempValueElement.innerHTML = `${weather.temperature.value}degrees<span>C</span>`;
    weather.temperature.unit = "celsius";
  }
});
