const urlParams = new URLSearchParams(window.location.search);
const temperature = urlParams.get("temperature");
const icon = urlParams.get("icon");
const description = urlParams.get("description");
const feels_like = urlParams.get("feels_like");
const humidity = urlParams.get("humidity");
const pressure = urlParams.get("pressure");
const wind_speed = urlParams.get("wind_speed");
const rain_volume = urlParams.get("rain_volume");
const coordinates = urlParams.get("coordinates");
const time_zone = urlParams.get("time_zone");

picture = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

document.getElementById("temperature").innerText = temperature
    ? temperature + "°C"
    : "Temperature not available";

document.getElementById("description").innerText = description || "N/A";
document.getElementById("feels_like").innerText = feels_like
    ? feels_like + "°C"
    : "N/A";
document.getElementById("humidity").innerText = humidity || "N/A";
document.getElementById("pressure").innerText = pressure || "N/A";
document.getElementById("wind_speed").innerText = wind_speed || "N/A";
document.getElementById("rain_volume").innerText = rain_volume || "N/A";
document.getElementById("coordinates").innerText = coordinates;
document.getElementById("time_zone").innerText = "Timezone: " + time_zone;
pic = document.getElementById("icon");
pic.src = picture;

function initMap() {
    const urlParams = new URLSearchParams(window.location.search);
    const coordinatesString = urlParams.get("coordinates");

    const [lat, lng] = coordinatesString.split(",");

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    const myLatLng = { lat: latitude, lng: longitude };

    var map = new google.maps.Map(document.getElementById("map"), {
        center: myLatLng,
        zoom: 8,
    });

    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: "My Location",
    });
}
