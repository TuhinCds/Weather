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
    let MyApi = '424be41c53cfe8e0209f842ee0dfd2b2'

        // loading part
        ShowLoader("load")

    try {
        let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=${MyApi}&units=metric`)
        let weather = await res.json()
        await ShowData(weather)
    } catch (err){

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
    showCountry.innerHTML = weather.name
    IconImage.src = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
    wetherType.innerHTML = weather.weather[0].main
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
    } else {
        ShowStatusIcon.innerHTML = `<i class="fa-regular fa-moon"></i>`
    }
}


