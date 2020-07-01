/*Loads previous searches*/
var previousSearch;
function loadPreviousSearch() {
    previousSearch = JSON.parse(localStorage.getItem("previousSearch"));
    if (previousSearch === null) {
        previousSearch = [];
    } else {
        $("#previousSearch").empty();
        previousSearch.forEach(function (element) {
            $("#previousSearch").append("<hr>");
            var newDiv = $("<div>");
            newDiv.text(element);
            newDiv.addClass("previousCity");
            newDiv.attr("CITY-NAME", element);
            $("#previousSearch").append(newDiv);
        });
    }
}
/*Show WF (Weather Forecast). CityName can be the name of the city, optionally state, and optionally country (separated by comma).
Ex: 'New York, NY, USA' (City, State and Country), or symply 'Toronto' (City name), or 'Sao Paulo, SP' (City name and state)*/
function showWF(cityName) {
    $(".weatherSection").css("visibility", "hidden");
    if (cityName.trim().length <= 2) {
        alert("Invalid city name!");
        return;
    }
    var settingsCurrentDay = {
        "async": true,
        "crossDomain": true,
        "url": "https://community-open-weather-map.p.rapidapi.com/weather?q=" + cityName,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
            "x-rapidapi-key": "8ff4f2693emsh1f78fb63b72267fp17c60bjsnede0a7ac56a5"
        }
    }
    $.ajax(settingsCurrentDay).done(function (response) {
        var respObj = response;
        var celcius = (parseInt(respObj.main.temp) - 272.15).toFixed(2);
        var icon = respObj.weather[0].icon;
        var lat = respObj.coord.lat;
        var lon = respObj.coord.lon;
        $("#cityAndDate").text(respObj.name + "," + respObj.sys.country);
        $("#todayImg").attr("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png")
        $("#temperature").text("Temperature: " + celcius + "ºC");
        $("#humidity").text("Humidity: " + respObj.main.humidity);
        $("#windSpeed").text("Wind Speed: " + respObj.wind.speed);
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/uvi?appid=" + "1e481f0f89ec344e01f76d7ae14f9c75" + "&lat=" + lat + "&lon=" + lon,
            method: "GET"
        }).done(function (response) {
            $("#uvIndex").text("UV Index: " + response.value);
        });
    });
    var settings5DaysForecast = {
        "async": true,
        "crossDomain": true,
        "url": "https://community-open-weather-map.p.rapidapi.com/forecast?q=" + cityName,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
            "x-rapidapi-key": "8ff4f2693emsh1f78fb63b72267fp17c60bjsnede0a7ac56a5"
        }
    }
    $.ajax(settings5DaysForecast).done(function (response) {
        var respObj = response;
        var d = 0;
        for (var i = 4; i <= 36; i += 8) {
            d++;
            var celcius = (parseInt(respObj.list[i].main.temp) - 272.15).toFixed(2);
            var icon = respObj.list[i].weather[0].icon;
            $("#day" + d + "Date").text(respObj.list[i].dt_txt.substr(0, 10));
            $("#day" + d + "Img").attr("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png");
            $("#day" + d + "Temp").text("Temp: " + celcius + "ºC");
            $("#day" + d + "Humidity").text("Humidity: " + respObj.list[i].main.humidity);
        }
        $(".weatherSection").css("visibility", "visible");
    });
    if (previousSearch.indexOf($("#cityName").val()) === -1) {
        previousSearch.unshift($("#cityName").val());
        if (previousSearch.length > 10) {
            previousSearch.pop();
        }
        localStorage.setItem("previousSearch", JSON.stringify(previousSearch));
        loadPreviousSearch();
    }
}
/*When search button is ckicked, triggers showWF function */
$("#searchBtn").click(function () {
    var cityName = $("#cityName").val();
    showWF(cityName);
});
/*When document is ready...*/
$(document).ready(function () {
    loadPreviousSearch();
});
/*Adds click events to previous searches*/
$(document).on("click", ".previousCity", function () {
    var cityName = $(this).attr("CITY-NAME");
    $("#cityName").val(cityName);
    showWF(cityName);
});