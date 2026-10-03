/* ============================================================
   WEATHER//MONITOR — FRONTEND ENGINE

   Existing backend endpoint:
   GET /api/weather

   No backend changes required.
   ============================================================ */

const API_URL = "/api/weather";

const MAX_POINTS = 12;


const history = {

    temperature: [],
    humidity: [],
    pressure: [],
    rain: []

};


function $(id) {

    return document.getElementById(id);

}


function setText(id, value) {

    const element = $(id);

    if (element) {

        element.textContent = value;

    }

}


function number(value) {

    const n = Number(value);

    return Number.isFinite(n)
        ? n
        : null;

}


function pushValue(key, value) {

    if (value === null) {

        return;

    }


    history[key].push(value);


    if (
        history[key].length >
        MAX_POINTS
    ) {

        history[key].shift();

    }

}


function setConnection(online) {

    const pill =
        $("connectionPill");

    const text =
        $("connectionText");


    if (!pill) {

        return;

    }


    pill.classList.toggle(
        "offline",
        !online
    );


    if (text) {

        text.textContent =
            online
                ? "SYSTEM ONLINE"
                : "OFFLINE";

    }

}


function drawBars(
    id,
    values
) {

    const container =
        $(id);


    if (!container) {

        return;

    }


    container.innerHTML = "";


    if (!values.length) {

        container.innerHTML =
            '<span class="chart-empty">WAITING FOR TELEMETRY…</span>';

        return;

    }


    let min =
        Math.min(...values);


    let max =
        Math.max(...values);


    if (max === min) {

        min -= 1;
        max += 1;

    }


    values.forEach(
        (value, index) => {

            const bar =
                document.createElement(
                    "div"
                );


            bar.className =
                "chart-bar";


            const height =
                12 +
                (
                    (value - min) /
                    (max - min)
                ) *
                82;


            bar.style.height =
                `${Math.max(
                    12,
                    Math.min(
                        94,
                        height
                    )
                )}%`;


            bar.title =
                value.toFixed(2);


            bar.style.animationDelay =
                `${index * 35}ms`;


            container.appendChild(
                bar
            );

        }
    );

}


function drawMiniTemperature() {

    const container =
        $("miniTemperatureChart");


    if (!container) {

        return;

    }


    container.innerHTML = "";


    if (
        !history.temperature.length
    ) {

        container.innerHTML =
            '<span class="chart-empty">WAITING…</span>';

        return;

    }


    const values =
        history.temperature;


    const min =
        Math.min(...values);


    const max =
        Math.max(...values);


    const range =
        Math.max(
            max - min,
            0.5
        );


    values.forEach(
        (value, index) => {

            const point =
                document.createElement(
                    "i"
                );


            point.style.left =
                `${(
                    index /
                    Math.max(
                        values.length - 1,
                        1
                    )
                ) *
                100
                }%`;


            point.style.bottom =
                `${12 +
                (
                    (value - min) /
                    range
                ) *
                68
                }%`;


            container.appendChild(
                point
            );

        }
    );

}


function updateDashboard(data) {

    const temperature =
        number(
            data.temperature
        );


    const humidity =
        number(
            data.humidity
        );


    const pressure =
        number(
            data.pressure
        );


    const rain =
        number(
            data.rainLevel
        );


    if (
        temperature !== null
    ) {

        setText(
            "temperature",
            temperature.toFixed(2)
        );


        setText(
            "chartCurrent",
            `${temperature.toFixed(2)} °C`
        );

    }


    if (
        humidity !== null
    ) {

        setText(
            "humidity",
            humidity.toFixed(2)
        );

    }


    if (
        pressure !== null
    ) {

        setText(
            "pressure",
            pressure.toFixed(2)
        );

    }


    if (
        rain !== null
    ) {

        setText(
            "rainLevel",
            rain.toFixed(2)
        );

    }


    pushValue(
        "temperature",
        temperature
    );


    pushValue(
        "humidity",
        humidity
    );


    pushValue(
        "pressure",
        pressure
    );


    pushValue(
        "rain",
        rain
    );


    drawMiniTemperature();


    setText(
        "aTemp",
        temperature === null
            ? "-- °C"
            : `${temperature.toFixed(2)} °C`
    );


    setText(
        "aHumidity",
        humidity === null
            ? "-- %"
            : `${humidity.toFixed(2)} %`
    );


    setText(
        "aPressure",
        pressure === null
            ? "-- hPa"
            : `${pressure.toFixed(2)} hPa`
    );


    setText(
        "aRain",
        rain === null
            ? "-- %"
            : `${rain.toFixed(2)} %`
    );


    drawBars(
        "temperatureChart",
        history.temperature
    );


    drawBars(
        "humidityChart",
        history.humidity
    );


    drawBars(
        "pressureChart",
        history.pressure
    );


    drawBars(
        "rainChart",
        history.rain
    );

}


async function fetchWeather() {

    try {

        const response =
            await fetch(
                `${API_URL}?t=${Date.now()}`,
                {
                    method: "GET",

                    cache: "no-store",

                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const result =
            await response.json();


        if (
            !result ||
            result.success === false
        ) {

            throw new Error(
                "API returned unsuccessful response"
            );

        }


        updateDashboard(
            result.data || {}
        );


        setConnection(true);


        if (
            result.timestamp
        ) {

            setText(
                "lastUpdated",

                new Date(
                    result.timestamp
                ).toLocaleTimeString()
            );

        } else {

            setText(
                "lastUpdated",

                new Date()
                    .toLocaleTimeString()
            );

        }

    }

    catch (error) {

        console.error(
            "Weather API error:",
            error
        );


        setConnection(false);


        setText(
            "lastUpdated",
            "Connection unavailable"
        );

    }

}


function setupMobileMenu() {

    const menu =
        $("menuBtn");


    const sidebar =
        $("sidebar");


    const overlay =
        $("mobileOverlay");


    if (
        !menu ||
        !sidebar ||
        !overlay
    ) {

        return;

    }


    const close = () => {

        sidebar.classList.remove(
            "open"
        );


        overlay.classList.remove(
            "show"
        );


        document.body.classList.remove(
            "menu-open"
        );

    };


    menu.addEventListener(
        "click",
        () => {

            const open =
                sidebar.classList.toggle(
                    "open"
                );


            overlay.classList.toggle(
                "show",
                open
            );


            document.body.classList.toggle(
                "menu-open",
                open
            );

        }
    );


    overlay.addEventListener(
        "click",
        close
    );


    document
        .querySelectorAll(
            ".nav-item"
        )
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    close
                );

            }
        );


    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth >
                900
            ) {

                close();

            }

        }
    );

}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupMobileMenu();

        fetchWeather();

        window.setInterval(
            fetchWeather,
            2000
        );

    }
);