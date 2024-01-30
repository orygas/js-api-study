const input = document.querySelector('input');
const button = document.querySelector('button');
const errorMsg = document.querySelector('p.error');
const date = document.querySelector('date');
const city = document.querySelector('h2.city')
const img = document.querySelector('img');
const temp = document.querySelector('p.temp');
const description = document.querySelector('p.description');
const feelsLike = document.querySelector('span.feels_like');
const pressure = document.querySelector('span.pressure');
const humidity = document.querySelector('span.humidity');
const windSpeed = document.querySelector('span.wind_speed');
const clouds = document.querySelector('span.clouds');
const pollution_info = document.querySelector('span.pollution_info');
const imgPollution = document.querySelector('img.pm25');

const apiLink = 'https://api.openweathermap.org/data/2.5/weather?q=';
const apiKey = '&appid=c9adfb5734ef4c8aff48a2cf9d6a9e42';
const apiLang = '&lang=pl';
const apiUnits = '&units=metric';

const getWeather = () => {
    const apiCity = input.value;
    const URL = apiLink + apiCity + apiKey + apiUnits + apiLang

    axios.get(URL).then(response => {
        // console.log(response)

        city.textContent = `${response.data.name}, ${response.data.sys.country}`;
        img.src = `http://openweathermap.org/img/wn/${response.data.weather[0].icon}.png`;
        temp.textContent = `${Math.round(response.data.main.temp)} °C`;
        description.textContent = `${response.data.weather[0].description} `;
        feelsLike.textContent = `${Math.round(response.data.main.feels_like)} °C`;
        pressure.textContent = `${response.data.main.pressure} hPa`;
        humidity.textContent = `${response.data.main.humidity} % `;
        windSpeed.textContent = `${Math.round(response.data.wind.speed * 3.6)} km / h`;
        clouds.textContent = `${response.data.clouds.all} % `;
        errorMsg.textContent = '';
        description.classList.add('red_decor');

        //odwołanie do airpollution api

        const URL_Pollution = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${response.data.coord.lat}&lon=${response.data.coord.lon}` + apiKey;

        axios.get(URL_Pollution).then(response => {
            console.log(response)

            pollution_info.textContent = `${response.data.list[0].components.pm2_5}`;
            const pm25 = Number(`${response.data.list[0].components.pm2_5}`);

            if (pm25 >= 0 && pm25 < 10) {
                imgPollution.style.backgroundColor = 'green';
            } else if (pm25 >= 10 && pm25 < 25) {
                imgPollution.style.backgroundColor = 'yellowGreen';
            } else if (pm25 >= 25 && pm25 < 50) {
                imgPollution.style.backgroundColor = 'yellow';
            } else if (pm25 >= 50 && pm25 < 75) {
                imgPollution.style.backgroundColor = 'yellowGreen';
            } else {
                imgPollution.style.backgroundColor = 'red';
            }
        })

    }).catch(error => {
        console.log(error);
        if (error.response.data.cod !== '200') {
            errorMsg.textContent = `BŁĄD: ${error.response.data.message}`
        }
        [city, temp, description, feelsLike, pressure, humidity, windSpeed, clouds].forEach(el => {
            el.textContent = '';
        })
        img.src = '';
        imgPollution.style.backgroundColor = 'transparent';
        pollution_info.textContent = '';

        description.classList.remove('red_decor');
    }).finally(() => {
        input.value = '';
    })
}

const getWeatherByEnter = e => {
    if (e.key === 'Enter') {
        getWeather();
    }
}

button.addEventListener('click', getWeather);
input.addEventListener('keypress', getWeatherByEnter);