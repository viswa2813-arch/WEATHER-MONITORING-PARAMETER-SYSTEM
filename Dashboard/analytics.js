// ============================================================
// WEATHER PARAMETER MONITORING SYSTEM
// ANALYTICS PAGE
// ============================================================

const API_URL = "/api/weather";


// ============================================================
// GET HTML ELEMENTS
// ============================================================

const temperatureElement =
    document.getElementById("analyticsTemperature");

const humidityElement =
    document.getElementById("analyticsHumidity");

const pressureElement =
    document.getElementById("analyticsPressure");

const rainElement =
    document.getElementById("analyticsRain");

const currentTemperatureElement =
    document.getElementById("analyticsCurrent");

const chartElement =
    document.getElementById("analyticsChart");

const temperatureMeaningElement =
    document.getElementById("temperatureMeaning");

const humidityMeaningElement =
    document.getElementById("humidityMeaning");

const pressureMeaningElement =
    document.getElementById("pressureMeaning");

const rainMeaningElement =
    document.getElementById("rainMeaning");


// ============================================================
// TEMPERATURE HISTORY
// ============================================================

let temperatureHistory = [];


// ============================================================
// FETCH WEATHER DATA
// ============================================================

async function updateAnalytics() {

    try {

        const response = await fetch(
            API_URL,
            {
                cache: "no-store"
            }
        );

        if (!response.ok) {

            throw new Error(
                "HTTP " + response.status
            );

        }

        const result =
            await response.json();

        if (
            !result.success ||
            !result.data
        ) {

            throw new Error(
                "Invalid API response"
            );

        }

        const weather =
            result.data;


        // ====================================================
        // CONVERT VALUES TO NUMBERS
        // ====================================================

        const temperature =
            Number(weather.temperature);

        const humidity =
            Number(weather.humidity);

        const pressure =
            Number(weather.pressure);

        const rainLevel =
            Number(weather.rainLevel);


        // ====================================================
        // UPDATE TEMPERATURE
        // ====================================================

        if (temperatureElement) {

            temperatureElement.textContent =
                Number.isFinite(temperature)
                    ? temperature.toFixed(2)
                    : "--";

        }


        // ====================================================
        // UPDATE HUMIDITY
        // ====================================================

        if (humidityElement) {

            humidityElement.textContent =
                Number.isFinite(humidity)
                    ? humidity.toFixed(2)
                    : "--";

        }


        // ====================================================
        // UPDATE PRESSURE
        // ====================================================

        if (pressureElement) {

            pressureElement.textContent =
                Number.isFinite(pressure)
                    ? pressure.toFixed(2)
                    : "--";

        }


        // ====================================================
        // UPDATE RAIN
        // ====================================================

        if (rainElement) {

            rainElement.textContent =
                Number.isFinite(rainLevel)
                    ? rainLevel.toFixed(2)
                    : "--";

        }


        // ====================================================
        // CURRENT TEMPERATURE
        // ====================================================

        if (currentTemperatureElement) {

            currentTemperatureElement.textContent =
                Number.isFinite(temperature)
                    ? temperature.toFixed(2) + " °C"
                    : "-- °C";

        }


        // ====================================================
        // SAVE TEMPERATURE HISTORY
        // ====================================================

        if (Number.isFinite(temperature)) {

            temperatureHistory.push(
                temperature
            );

        }


        // Keep only latest 30 readings

        if (temperatureHistory.length > 30) {

            temperatureHistory =
                temperatureHistory.slice(-30);

        }


        // ====================================================
        // UPDATE CHART
        // ====================================================

        drawChart();


        // ====================================================
        // UPDATE INTERPRETATION
        // ====================================================

        updateInterpretation(
            temperature,
            humidity,
            pressure,
            rainLevel
        );

    }

    catch (error) {

        console.error(
            "Analytics error:",
            error
        );

    }

}


// ============================================================
// DRAW TEMPERATURE CHART
// ============================================================

function drawChart() {

    if (!chartElement) {
        return;
    }


    if (
        temperatureHistory.length === 0
    ) {

        chartElement.innerHTML = `
            <div style="
                height:100%;
                display:flex;
                align-items:center;
                justify-content:center;
                color:#71889d;
                font-size:13px;
            ">
                Waiting for temperature data...
            </div>
        `;

        return;

    }


    const width = 900;
    const height = 260;
    const padding = 30;


    const values =
        temperatureHistory;


    let minimum =
        Math.min(...values);

    let maximum =
        Math.max(...values);


    // Prevent flat-line calculation

    if (minimum === maximum) {

        minimum -= 1;
        maximum += 1;

    }


    const range =
        maximum - minimum;


    // ========================================================
    // CREATE POINTS
    // ========================================================

    const points =
        values.map(
            (value, index) => {

                const x =
                    padding +
                    (
                        index /
                        Math.max(
                            values.length - 1,
                            1
                        )
                    ) *
                    (
                        width -
                        padding * 2
                    );


                const y =
                    height -
                    padding -
                    (
                        (
                            value -
                            minimum
                        ) /
                        range
                    ) *
                    (
                        height -
                        padding * 2
                    );


                return `${x},${y}`;

            }
        );


    const pointsString =
        points.join(" ");


    // ========================================================
    // DRAW SVG
    // ========================================================

    chartElement.innerHTML = `

        <svg
            viewBox="0 0 ${width} ${height}"
            width="100%"
            height="100%"
            preserveAspectRatio="none"
        >

            <!-- Horizontal grid -->

            <line
                x1="${padding}"
                y1="${padding}"
                x2="${width - padding}"
                y2="${padding}"
                stroke="rgba(120,160,190,0.15)"
            />

            <line
                x1="${padding}"
                y1="${height / 2}"
                x2="${width - padding}"
                y2="${height / 2}"
                stroke="rgba(120,160,190,0.15)"
            />

            <line
                x1="${padding}"
                y1="${height - padding}"
                x2="${width - padding}"
                y2="${height - padding}"
                stroke="rgba(120,160,190,0.15)"
            />


            <!-- Temperature line -->

            <polyline
                points="${pointsString}"
                fill="none"
                stroke="#36e4ff"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
            />

        </svg>

    `;

}


// ============================================================
// INTERPRETATION
// ============================================================

function updateInterpretation(
    temperature,
    humidity,
    pressure,
    rain
) {

    // ========================================================
    // TEMPERATURE
    // ========================================================

    if (temperatureMeaningElement) {

        if (!Number.isFinite(temperature)) {

            temperatureMeaningElement.textContent =
                "Waiting for data";

        }
        else if (temperature < 15) {

            temperatureMeaningElement.textContent =
                "Cool";

        }
        else if (temperature < 25) {

            temperatureMeaningElement.textContent =
                "Comfortable";

        }
        else if (temperature < 32) {

            temperatureMeaningElement.textContent =
                "Warm";

        }
        else {

            temperatureMeaningElement.textContent =
                "Hot";

        }

    }


    // ========================================================
    // HUMIDITY
    // ========================================================

    if (humidityMeaningElement) {

        if (!Number.isFinite(humidity)) {

            humidityMeaningElement.textContent =
                "Waiting for data";

        }
        else if (humidity < 30) {

            humidityMeaningElement.textContent =
                "Dry";

        }
        else if (humidity <= 60) {

            humidityMeaningElement.textContent =
                "Comfortable";

        }
        else if (humidity <= 80) {

            humidityMeaningElement.textContent =
                "Humid";

        }
        else {

            humidityMeaningElement.textContent =
                "Very humid";

        }

    }


    // ========================================================
    // PRESSURE
    // ========================================================

    if (pressureMeaningElement) {

        if (!Number.isFinite(pressure)) {

            pressureMeaningElement.textContent =
                "Waiting for data";

        }
        else if (pressure < 1000) {

            pressureMeaningElement.textContent =
                "Low pressure";

        }
        else if (pressure <= 1020) {

            pressureMeaningElement.textContent =
                "Normal";

        }
        else {

            pressureMeaningElement.textContent =
                "High pressure";

        }

    }


    // ========================================================
    // RAIN
    // ========================================================

    if (rainMeaningElement) {

        if (!Number.isFinite(rain)) {

            rainMeaningElement.textContent =
                "Waiting for data";

        }
        else if (rain < 20) {

            rainMeaningElement.textContent =
                "Low sensor level";

        }
        else if (rain < 60) {

            rainMeaningElement.textContent =
                "Moderate sensor level";

        }
        else {

            rainMeaningElement.textContent =
                "High sensor level";

        }

    }

}


// ============================================================
// START
// ============================================================

updateAnalytics();


// ============================================================
// REFRESH EVERY 2 SECONDS
// ============================================================

setInterval(
    updateAnalytics,
    2000
);


// ============================================================
// MOBILE MENU
// ============================================================

const menuButton =
    document.getElementById("menuBtn");

const sidebar =
    document.getElementById("sidebar");

const overlay =
    document.getElementById("mobileOverlay");


if (menuButton && sidebar) {

    menuButton.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "open"
            );

            if (overlay) {

                overlay.classList.toggle(
                    "show"
                );

            }

        }
    );

}


if (overlay) {

    overlay.addEventListener(
        "click",
        () => {

            if (sidebar) {

                sidebar.classList.remove(
                    "open"
                );

            }

            overlay.classList.remove(
                "show"
            );

        }
    );

}