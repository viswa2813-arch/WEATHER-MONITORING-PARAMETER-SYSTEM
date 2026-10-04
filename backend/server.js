const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(express.json());

// ============================================================
// DASHBOARD
// ============================================================

app.use(express.static(path.join(__dirname, "..", "Dashboard")));

// ============================================================
// WEATHER DATA
// ============================================================

let weatherData = {
    temperature: 0,
    humidity: 0,
    pressure: 0,
    rainLevel: 0,
    windSpeed: 0,
    lightIntensity: 0
};

// ============================================================
// WORKFLOW
// ============================================================

app.get("/workflow.html", (req, res) => {

    res.sendFile(
        path.join(__dirname, "..", "Dashboard", "workflow.html")
    );

});

// ============================================================
// RECEIVE DATA FROM PICO W
// ============================================================

app.post("/api/weather", (req, res) => {

    console.log();
    console.log("==========================================");
    console.log("Weather data received from Pico W");
    console.log("==========================================");

    console.log("Received data:");
    console.log(req.body);

    weatherData = {
        temperature: Number(req.body.temperature) || 0,
        humidity: Number(req.body.humidity) || 0,
        pressure: Number(req.body.pressure) || 0,
        rainLevel: Number(req.body.rainLevel) || 0,
        windSpeed: Number(req.body.windSpeed) || 0,
        lightIntensity: Number(req.body.lightIntensity) || 0
    };

    console.log();
    console.log("Stored weather data:");
    console.log(weatherData);

    res.status(200).json({
        success: true,
        message: "Weather data received successfully",
        data: weatherData
    });

});

// ============================================================
// SEND DATA TO DASHBOARD
// ============================================================

app.get("/api/weather", (req, res) => {

    res.status(200).json({
        success: true,
        data: weatherData
    });

});

// ============================================================
// SYSTEM STATUS
// ============================================================

app.get("/api/status", (req, res) => {

    res.status(200).json({
        success: true,
        system: "Weather Parameter Monitoring System",
        status: "online",
        controller: "Raspberry Pi Pico W",
        backend: "Node.js + Express.js"
    });

});

// ============================================================
// ROOT
// ============================================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "..", "Dashboard", "index.html")
    );

});

// ============================================================
// 404
// ============================================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "Route not found"
    });

});

// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, "0.0.0.0", () => {

    console.log();
    console.log("==========================================");
    console.log(" WEATHER PARAMETER MONITORING SYSTEM");
    console.log("==========================================");

    console.log(`Server running on port ${PORT}`);

    console.log();
    console.log("Laptop:");
    console.log(`http://localhost:${PORT}`);

    console.log();
    console.log("Pico W Backend:");
    console.log(`http://10.244.237.214:${PORT}/api/weather`);

    console.log();
    console.log("Dashboard:");
    console.log(`http://10.244.237.214:${PORT}`);

    console.log();
    console.log("Status:");
    console.log(`http://10.244.237.214:${PORT}/api/status`);

    console.log();
    console.log("==========================================");

});