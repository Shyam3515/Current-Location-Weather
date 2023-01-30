//open weather map current weather
//key:30ab3579b616a41fce49262d034cccb9
//api.openweathermap.org/data/2.5/forecast/daily?lat=44.34&lon=10.99&cnt=7&appid={API key}
//One call Api
//https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const APIKey = '49cc8c821cd2aff9af04c9f98c36eb74';
//Calling after every 0.001 seconds...
setInterval(()=>{
    const time = new Date();
    const month = time.getMonth();
    const day = time.getDay();
    const date = time.getDate();
    const hour = time.getHours();
    const hoursIn12HrsFormat = hour >= 13 ? hour%12 : hour;
    const min = time.getMinutes();
    const mins = min <10 ? '0'+min : min
    const ampm = hour <= 12 ? 'AM' : 'PM';

    timeEl.innerHTML = (hoursIn12HrsFormat<10 ? '0'+hoursIn12HrsFormat : hoursIn12HrsFormat) +':'+ mins +' '+ `<span id="am-pm">${ampm}</span>`;
    dateEl.innerHTML = days[day]+','+date+' '+months[month];
},1);
//get Weather Data
function getWeatherData(){
    navigator.geolocation.getCurrentPosition(success=>{
        console.log(success);
        // let lat = success.coords.latitude;
        // let lon = success.coords.longitude;
        let {latitude, longitude } = success.coords;
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${APIKey}`)
        .then(res => res.json())
        .then(data =>{
             console.log(data);
             showWeatherData(data);
            })
    })
   
}
getWeatherData();
//Show Data
function showWeatherData (data){
    let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;

    timezone.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat + 'N ' + data.lon+'E'

    currentWeatherItemsEl.innerHTML = 
    `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div>${   window.moment(sunrise * 1000).format('  HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset*1000).format('  HH:mm a')}</div>
    </div>
    `;

    let otherDayForecast = ''
    data.daily.forEach((day, idx) => {
        if(idx == 0){
            currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>`
        }else{
            otherDayForecast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>`
        }
    })
    weatherForecastEl.innerHTML = otherDayForecast;
}