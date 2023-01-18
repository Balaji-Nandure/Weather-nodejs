/** @format */

const http = require("http");
const requests = require("requests");
const fs = require("fs");

const homeFile = fs.readFileSync("./home.html", "utf8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

    return temperature;
};

const server = http.createServer((req, res) => {
    if (req.url === "/") {
        requests(
            "https://api.openweathermap.org/data/2.5/weather?q=pune&units=metric&appid=5d5f21818289dac3e023d2aaf2b7f81a"
        )
            .on("data", (chunk) => {
                const objData = JSON.parse(chunk);
                const arrData = [objData];
                // console.log(arrData[0].main.temp);
                const realtimeData = arrData
                    .map((val) => {
                        return replaceVal(homeFile, val);
                    })
                    .join("");
                res.write(realtimeData);
            })
            .on("end", (err) => {
                if (err) {
                    return console.log(err);
                }
                res.end();
            });
    }
});

server.listen(4200);
