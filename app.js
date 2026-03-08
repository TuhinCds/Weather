const SearchCountryInput = document.getElementById("SearchCountryInput")
const SearchCountryBtn = document.getElementById("SearchCountryBtn")
const ShowDayInfoData = document.getElementById("ShowDayInfoData")
const showCountry = document.getElementById("showCountry")
const IconImage = document.getElementById("IconImage")
const wetherType = document.getElementById("wetherType")
const showCelcius = document.getElementById("showCelcius")
const ShowHighCel = document.getElementById("ShowHighCel")
const ShowLowCel = document.getElementById("ShowLowCel")
const pressureData = document.getElementById("pressureData")
const visibilityDataShow = document.getElementById("visibilityDataShow")
const ShowWind = document.getElementById("ShowWind")
const WetherMain = document.querySelector(".WetherMain")
const WeatherFooter = document.querySelector(".WeatherFooter")
const loadingbar = document.getElementById("loadingbar")
const ShowStatusIcon = document.getElementById("ShowStatusIcon")
const overly = document.getElementById("overly")
const ShowFullCountryNameContainer = document.getElementById("ShowFullCountryNameContainer")
const headerIconShow = document.querySelector(".headerIconShow")
const SearchInGoogle = document.getElementById("SearchInGoogle")
const OpenAiResopnseBtn = document.getElementById("OpenAiResopnseBtn")
const ShowCityDataSlide = document.getElementById("ShowCityDataSlide")
const LanguageChangebtn = document.getElementById("LanguageChangebtn")

let savedSearch = localStorage.getItem("savedSearch") || "Bangladesh"



const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];


function SearchCountry(){
    let searchValue = SearchCountryInput.value.trim()
    GetCountryWeather(searchValue)
    localStorage.setItem("savedSearch", searchValue)
}

SearchCountryBtn.addEventListener("click", () => {
    SearchCountry()
})

SearchCountryInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter"){
        SearchCountry()
    }
})

async function GetCountryWeather(country){
    SearchCountryInput.value = country
    let MyApi = '424be41c53cfe8e0209f842ee0dfd2b2'

        // loading part
        ShowLoader("load")

    try {
        let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=${MyApi}&units=metric`)
        let res2 = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${country}&prop=pageimages&format=json&pithumbsize=600&origin=*`)
        let weather = await res.json()
        let citydataImgs = await res2.json()
        await ShowData(weather)
        const dynamicWeather = await generateAdvancedWeather(weather);
        await ShowCitydataInSlide(weather, citydataImgs, dynamicWeather)
        

        OpenAiResopnseBtn.addEventListener("click", () => {
            ChatGptWeatherSearch(weather)
        })
    } catch (err){
        ShowLoader("add")
    } finally {
        setTimeout(() => {
            ShowLoader()
        }, 1000)
    }
}

GetCountryWeather(savedSearch)



function ShowLoader(status){
    if (status === "load"){
        WetherMain.classList.add("hide")
        WeatherFooter.classList.add("hide")
        loadingbar.classList.remove("hideLoader")
    } else {
        WetherMain.classList.remove("hide")
        WeatherFooter.classList.remove("hide")
        loadingbar.classList.add("hideLoader")
    }
}

async function ShowData(weather){
    let c = "˚C"
    showCountry.innerHTML = weather.name.length > 25 ? weather.name.slice(0, 20) + ".." : weather.name
    IconImage.src = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
    wetherType.innerHTML = weather.weather[0].main + `${weather.clouds.all > 0 && weather.weather[0].main === "Clouds" ?  " " + weather.clouds.all + "%" : ""}`
    showCelcius.innerHTML = weather.main.temp + c
    ShowHighCel.innerHTML = weather.main.temp_max + c
    ShowLowCel.innerHTML = weather.main.temp_min + c
    pressureData.innerHTML = weather.main.pressure + ` <span class="showKilomitter">hPa</span>`
    visibilityDataShow.innerHTML = `${(weather.visibility) / 1000} <span class="showKilomitter">km</span>`
    ShowWind.innerHTML = (weather.wind.speed * 3.6).toFixed(2) + `<span class="showKilomitter">km/h</span>`

    // show date
    let date = new Date(weather.dt * 1000)
    let showDate = `${months[date.getMonth()].slice(0, 3)} ${date.getDate()}, ${date.getFullYear()}`

    ShowDayInfoData.innerHTML = showDate

    if (weather.dt >= weather.sys.sunrise && weather.dt < weather.sys.sunset){
        ShowStatusIcon.innerHTML = `<i class="fa-solid fa-sun"></i>`
        headerIconShow.classList.add("sun")
        headerIconShow.classList.remove("moon")
    } else {
        ShowStatusIcon.innerHTML = `<i class="fa-regular fa-moon"></i>`
        headerIconShow.classList.add("moon")
        headerIconShow.classList.remove("sun")
    }
}


function Overly(status){
    if (status === "add"){
        overly.classList.add("active")
    } else {
        overly.classList.remove("active")
    }
}

function ClickedOverly(){
    Overly("remove")
    ShowFullCountryNameContainer.classList.add("hideAnimate0")
}

overly.addEventListener("click", () => {
    ClickedOverly()
})


WetherMain.addEventListener("click", () => {
    Overly("add")
    ShowFullCountryNameContainer.classList.remove("hideAnimate0")
})

function ChangLang(languageUse, dynamicWeather){
    let allRes = dynamicWeather.res.map(res => res[languageUse === "en" ? 0 : 1])
    return allRes
}

async function ShowCitydataInSlide(weather, citydata, dynamicWeather){
    let languageUse = "en"
    let allRes = ChangLang(languageUse, dynamicWeather)
    let fullreasponse = allRes.flat().join(" ")





    let pages = citydata.query.pages
    let pageid = Object.keys(pages)[0]
    let imgUrl = pages[pageid].thumbnail.source
    ShowCityDataSlide.innerHTML = 
                                    `<div class="sliderTexts">
                                        <span>${weather.name}</span>
                                        <span>Country ${weather.sys.country}</span>
                                        <div class="WeatherAdvices">
                                            ${fullreasponse}
                                        </div>
                                    </div>
                                    <div class="countryImg">
                                        <img src="${imgUrl}" alt="">
                                        <div class="imgOverwritetext">
                                            <span class="showCity">${weather.name}</span>
                                        </div>
                                    </div>`



            LanguageChangebtn.addEventListener("click", () => {
                languageUse = languageUse === "en" ? "bn" : "en"
                languageUse = languageUse.toLowerCase()
                fullreasponse = ChangLang(languageUse, dynamicWeather)
                fullreasponse = fullreasponse.flat().join(" ")
                ShowCityDataSlide.querySelector(".WeatherAdvices").innerHTML = `${fullreasponse}`
            })
            

            


}




    SearchInGoogle.addEventListener("click", () => {
        let searchWeather = SearchCountryInput.value.trim()
        GoogleWeatherSearch(searchWeather)
    })

function GoogleWeatherSearch(weatherSearch){
    window.open(`https://www.google.com/search?q=WEATHER+${weatherSearch}`, "_balnk")
}

function ChatGptWeatherSearch(weatherSearch){

    let date = new Date(weatherSearch.dt * 1000)
    let searchWeath = `
        I want to know the weather in ${weatherSearch.name} on ${months[date.getMonth()]}, ${date.getDate()} , ${date.getFullYear()}. Please include:
    - Average temperature
    - Chance of rain
    - Typical wind speed
    - General description (sunny, cloudy, etc.)`

    window.open(`https://chat.openai.com/?q=${encodeURIComponent(searchWeath)}`, "_balnk")
}

async function generateAdvancedWeather(weatherData) {
  const city = weatherData.name;
  const country = weatherData.sys.country;
  const temp = weatherData.main.temp;
  const temp_min = weatherData.main.temp_min;
  const temp_max = weatherData.main.temp_max;
  const humidity = weatherData.main.humidity;
  const windSpeed = weatherData.wind.speed;
  const pressure = weatherData.main.pressure;
  const weatherType = weatherData.weather[0].main.toLowerCase();
  const description = weatherData.weather[0].description;

  const res = [];

  // 1️⃣ Base description
  res.push([
    `Weather in ${city}, ${country} is ${description}. Temperature is ${temp}°C (min: ${temp_min}°C, max: ${temp_max}°C), humidity ${humidity}%, wind ${windSpeed} m/s, pressure ${pressure} hPa.`,
    `${city}, ${country}-এর আবহাওয়া ${description}। তাপমাত্রা ${temp}°C (ন্যূনতম: ${temp_min}°C, সর্বোচ্চ: ${temp_max}°C), আর্দ্রতা ${humidity}%, বাতাসের গতি ${windSpeed} m/s, চাপ ${pressure} hPa।`
  ]);

  // 2️⃣ Weather type advice
  if (weatherType.includes("rain")) {
    res.push([
      "It's raining. Carry an umbrella and avoid getting wet.",
      "বৃষ্টি হচ্ছে। ছাতা সঙ্গে রাখুন এবং ভিজে যাওয়া এড়ান।"
    ]);
    res.push([
      "Roads may be slippery, drive carefully.",
      "রাস্তা ভিজে থাকতে পারে, ধীরে গাড়ি চালান।"
    ]);
  }

  if (weatherType.includes("cloud")) {
    res.push([
      "Cloudy day, light jacket recommended.",
      "মেঘলা দিন, হালকা জ্যাকেট পরা ভালো।"
    ]);
  }

  if (weatherType.includes("clear")) {
    res.push([
      "Sunny day, wear light and breathable clothes.",
      "সূর্য দেখা দিন, হালকা এবং শ্বাসপ্রশ্বাস যোগ্য কাপড় পরুন।"
    ]);
  }

  if (weatherType.includes("snow")) {
    res.push([
      "Snow expected, wear warm clothes and stay safe.",
      "তুষারপাত হতে পারে, উষ্ণ কাপড় পরুন এবং নিরাপদ থাকুন।"
    ]);
  }

  // 3️⃣ Temp-based advice
  if (temp >= 35) {
    res.push([
      "It's very hot. Drink plenty of water and avoid the sun.",
      "অত্যন্ত গরম। প্রচুর পানি পান করুন এবং সূর্য থেকে দূরে থাকুন।"
    ]);
  } else if (temp >= 28) {
    res.push([
      "Warm day. Light clothes recommended.",
      "উষ্ণ দিন। হালকা কাপড় পরা ভালো।"
    ]);
  } else if (temp <= 15) {
    res.push([
      "Cold day. Wear warm clothes and maybe a scarf.",
      "ঠান্ডা দিন। উষ্ণ কাপড় এবং প্রয়োজনে scarf পরুন।"
    ]);
  }

  // 4️⃣ Humidity advice
  if (humidity >= 70) {
    res.push([
      "High humidity. Stay hydrated and cool.",
      "উচ্চ আর্দ্রতা। পর্যাপ্ত পানি পান করুন এবং শরীর ঠান্ডা রাখুন।"
    ]);
  }

  if (humidity <= 30) {
    res.push([
      "Low humidity. Skin may dry, keep moisturizer handy.",
      "নিম্ন আর্দ্রতা। ত্বক শুষ্ক হতে পারে, moisturizer সঙ্গে রাখুন।"
    ]);
  }

  // 5️⃣ Wind advice
  if (windSpeed >= 10) {
    res.push([
      "Strong winds. Be careful when outside.",
      "প্রবল বাতাস। বাইরে থাকলে সতর্ক থাকুন।"
    ]);
  } else if (windSpeed <= 3) {
    res.push([
      "Calm wind today.",
      "আজকের বাতাস শান্ত।"
    ]);
  }

  // 6️⃣ Additional advice
  res.push([
    "Check local forecasts for updates throughout the day.",
    "দিনের মধ্যে আপডেটের জন্য স্থানীয় আবহাওয়ার খবর দেখুন।"
  ]);

  res.push([
    `Sunrise: ${new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}, Sunset: ${new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}`,
    `সূর্য উদয়: ${new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}, সূর্যাস্ত: ${new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}`
  ]);

  return {
    city,
    country,
    temp,
    weatherType,
    res
  };
}


