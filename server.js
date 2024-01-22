const express = require("express");
const http = require("http");
const https = require("https");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "view", "index.html"));
});

app.get("/weather", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "view", "weather.html"));
});

app.post("/", (req, res) => {
    const city = req.body.city;
    getWeatherData(city, (error, weatherData) => {
        if (error) {
            console.error(error);
            res.send("<h1>Error fetching weather data</h1>");
        } else {
            getTimezoneData(
                weatherData.coord.lat,
                weatherData.coord.lon,
                (timezoneError, timezoneData) => {
                    if (timezoneError) {
                        console.error(timezoneError);
                        res.send("<h1>Error fetching timezone data</h1>");
                    } else {
                        const timezone = timezoneData.timeZoneId;
                        res.redirect(
                            `/weather?city=${city}&timezone=${timezone}&temperature=${
                                weatherData.main.temp
                            }&description=${
                                weatherData.weather[0].description
                            }&icon=${weatherData.weather[0].icon}&coordinates=${
                                weatherData.coord.lat
                            },${weatherData.coord.lon}&feels_like=${
                                weatherData.main.feels_like
                            }&humidity=${weatherData.main.humidity}&pressure=${
                                weatherData.main.pressure
                            }&wind_speed=${
                                weatherData.wind.speed
                            }&country_code=${
                                weatherData.sys.country
                            }&rain_volume=${
                                weatherData.rain
                                    ? weatherData.rain["3h"]
                                    : "N/A"
                            }&time_zone=${timezone}`
                        );
                    }
                }
            );
        }
    });
});

function getWeatherData(city, callback) {
    const apiKey = "09b0887cfdc2961284caf30e31c34f91";
    const requestUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    http.get(requestUrl, (response) => {
        let data = "";

        response.on("data", (chunk) => {
            data += chunk;
        });

        response.on("end", () => {
            const weatherData = JSON.parse(data);
            callback(null, weatherData);
        });
    }).on("error", (error) => {
        callback(error, null);
    });
}

function getTimezoneData(lat, lon, callback) {
    const apiKey = "AIzaSyCMXJzmyzV1QhzAYQYgUoL1hqAwFonpKo8";
    const requestUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lon}&timestamp=${Math.floor(
        Date.now() / 1000
    )}&key=${apiKey}`;

    https
        .get(requestUrl, (response) => {
            let data = "";

            response.on("data", (chunk) => {
                data += chunk;
            });

            response.on("end", () => {
                const timezoneData = JSON.parse(data);
                callback(null, timezoneData);
            });
        })
        .on("error", (error) => {
            callback(error, null);
        });
}

const port = 3000;
server.listen(port, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${port}`);
});
