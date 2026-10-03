// ============================================================
// WEATHER PARAMETER MONITORING SYSTEM
// BACKEND SERVER
//
// Node.js + Express
//
// Serves:
//   Dashboard
//   Workflow
//   Hardware
//   Analytics
//
// API:
//   POST /api/weather
//   GET  /api/weather
//   GET  /api/status
// ============================================================

const express = require("express");
const path = require("path");

const app = express();

const PORT = 3000;

// ============================================================
// PATHS
// ============================================================

const dashboardPath = path.join(
    __dirname,
    "..",
    "Dashboard"
);


// ============================================================
// MIDDLEWARE
// ============================================================

app.use(express.json());


// ============================================================
// SERVE DASHBOARD FILES
// ============================================================

app.use(
    express.static(dashboardPath)
);


// ============================================================
// EXPLICIT WORKFLOW ROUTE
//
// This makes sure /workflow.html works even if
// Express static routing has an issue.
// ============================================================

app.get("/workflow.html", (req, res) => {

    res.sendFile(
        path.join(
            dashboardPath,
            "workflow.html"
        )
    );

});


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
// LAST UPDATE
// ============================================================

let lastUpdated = null;


// ============================================================
// POST WEATHER DATA
//
// Raspberry Pi Pico W → Server
// ============================================================

app.post("/api/weather", (req, res) => {

    if (
        req.body.temperature !== undefined
    ) {

        weatherData.temperature =
            Number(
                req.body.temperature
            );

    }


    if (
        req.body.humidity !== undefined
    ) {

        weatherData.humidity =
            Number(
                req.body.humidity
            );

    }


    if (
        req.body.pressure !== undefined
    ) {

        weatherData.pressure =
            Number(
                req.body.pressure
            );

    }


    if (
        req.body.rainLevel !== undefined
    ) {

        weatherData.rainLevel =
            Number(
                req.body.rainLevel
            );

    }


    if (
        req.body.windSpeed !== undefined
    ) {

        weatherData.windSpeed =
            Number(
                req.body.windSpeed
            );

    }


    if (
        req.body.lightIntensity !== undefined
    ) {

        weatherData.lightIntensity =
            Number(
                req.body.lightIntensity
            );

    }


    // Update timestamp

    lastUpdated =
        new Date();


    // Console output

    console.log("");
    console.log(
        "----------------------------------------------"
    );

    console.log(
        "Weather data received:"
    );

    console.log(
        weatherData
    );

    console.log(
        "Updated:",
        lastUpdated.toLocaleString()
    );

    console.log(
        "----------------------------------------------"
    );


    // Response to Pico W

    res.json({

        success: true,

        message:
            "Weather data received successfully",

        data:
            weatherData,

        timestamp:
            lastUpdated

    });

});


// ============================================================
// GET WEATHER DATA
//
// Dashboard → Server
// ============================================================

app.get("/api/weather", (req, res) => {

    res.json({

        success: true,

        data:
            weatherData,

        timestamp:
            lastUpdated

    });

});


// ============================================================
// SYSTEM STATUS
// ============================================================

app.get("/api/status", (req, res) => {

    res.json({

        success: true,

        system:
            "Weather Parameter Monitoring System",

        status:
            "online",

        controller:
            "Raspberry Pi Pico W",

        backend:
            "Node.js + Express.js",

        timestamp:
            new Date()

    });

});


// ============================================================
// OPTIONAL ROOT ROUTE
//
// http://localhost:3000/
// ============================================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            dashboardPath,
            "index.html"
        )
    );

});


// ============================================================
// 404 HANDLER
// ============================================================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        error:
            "Page or API endpoint not found",

        path:
            req.originalUrl

    });

});


// ============================================================
// START SERVER
// ============================================================

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log("");

        console.log(
            "=============================================="
        );

        console.log(
            "   WEATHER PARAMETER MONITORING SYSTEM"
        );

        console.log(
            "=============================================="
        );

        console.log(
            `Dashboard:   http://localhost:${PORT}`
        );

        console.log(
            `Workflow:    http://localhost:${PORT}/workflow.html`
        );

        console.log(
            `Hardware:    http://localhost:${PORT}/hardware.html`
        );

        console.log(
            `Analytics:   http://localhost:${PORT}/analytics.html`
        );

        console.log(
            `Weather API: http://localhost:${PORT}/api/weather`
        );

        console.log(
            `Status API:  http://localhost:${PORT}/api/status`
        );

        console.log(
            "=============================================="
        );

        console.log("");

    }
);