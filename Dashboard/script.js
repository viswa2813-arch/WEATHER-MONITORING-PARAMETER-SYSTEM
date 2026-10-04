document.addEventListener(
    "DOMContentLoaded",
    () => {

        const API_URL =
            "/api/weather";

        const STATUS_URL =
            "/api/status";


        const temperatureEl =
            document.getElementById(
                "temperature"
            );

        const humidityEl =
            document.getElementById(
                "humidity"
            );

        const pressureEl =
            document.getElementById(
                "pressure"
            );

        const rainEl =
            document.getElementById(
                "rainLevel"
            );

        const lastUpdatedEl =
            document.getElementById(
                "lastUpdated"
            );

        const connectionPill =
            document.getElementById(
                "connectionPill"
            );

        const connectionText =
            document.getElementById(
                "connectionText"
            );

        const deviceConnection =
            document.getElementById(
                "deviceConnection"
            );

        const healthBadge =
            document.getElementById(
                "healthBadge"
            );

        const chartCurrent =
            document.getElementById(
                "chartCurrent"
            );

        const chart =
            document.getElementById(
                "miniTemperatureChart"
            );


        let temperatureHistory = [];


        /* ====================================================
           MOBILE MENU
        ==================================================== */

        const menuBtn =
            document.getElementById(
                "menuBtn"
            );

        const sidebar =
            document.getElementById(
                "sidebar"
            );

        const overlay =
            document.getElementById(
                "mobileOverlay"
            );


        function closeMenu() {

            sidebar?.classList.remove(
                "open"
            );

            overlay?.classList.remove(
                "open"
            );

            if (menuBtn) {
                menuBtn.innerHTML = "☰";
            }
        }


        menuBtn?.addEventListener(
            "click",
            () => {

                const isOpen =
                    sidebar?.classList.toggle(
                        "open"
                    );

                overlay?.classList.toggle(
                    "open"
                );

                menuBtn.innerHTML =
                    isOpen
                        ? "×"
                        : "☰";

            }
        );


        overlay?.addEventListener(
            "click",
            closeMenu
        );


        document
            .querySelectorAll(
                ".nav-item"
            )
            .forEach(
                link => {

                    link.addEventListener(
                        "click",
                        closeMenu
                    );

                }
            );


        /* ====================================================
           CONNECTION
        ==================================================== */

        function setConnection(
            connected
        ) {

            if (
                connectionText &&
                connectionPill
            ) {

                connectionText.textContent =
                    connected
                        ? "CONNECTED"
                        : "OFFLINE";

                connectionPill.style.color =
                    connected
                        ? "#159957"
                        : "#d93648";

                connectionPill.style.background =
                    connected
                        ? "#f1fbf5"
                        : "#fff4f5";

                connectionPill.style.borderColor =
                    connected
                        ? "#cdebdc"
                        : "#f0cdd2";
            }


            if (deviceConnection) {

                deviceConnection.textContent =
                    connected
                        ? "CONNECTED"
                        : "OFFLINE";

                deviceConnection.style.color =
                    connected
                        ? "#159957"
                        : "#d93648";
            }


            if (healthBadge) {

                healthBadge.innerHTML =
                    `
                    <i></i>
                    ${connected
                        ? "OPERATIONAL"
                        : "OFFLINE"}
                    `;

                healthBadge.style.color =
                    connected
                        ? "#159957"
                        : "#d93648";

                healthBadge.style.background =
                    connected
                        ? "#f1fbf5"
                        : "#fff4f5";
            }

        }


        /* ====================================================
           NUMBER
        ==================================================== */

        function formatNumber(
            value,
            decimals = 1
        ) {

            const number =
                Number(value);

            if (
                !Number.isFinite(number)
            ) {
                return "--";
            }

            return number.toFixed(
                decimals
            );
        }


        /* ====================================================
           INTERPRETATION
        ==================================================== */

        function temperatureState(
            value
        ) {

            if (value < 10)
                return "Cold";

            if (value < 25)
                return "Comfortable";

            if (value < 35)
                return "Warm";

            return "Very warm";
        }


        function humidityState(
            value
        ) {

            if (value < 30)
                return "Dry";

            if (value <= 60)
                return "Comfortable";

            if (value <= 80)
                return "Humid";

            return "Very humid";
        }


        function pressureState(
            value
        ) {

            if (value < 980)
                return "Low pressure";

            if (value <= 1030)
                return "Normal range";

            return "High pressure";
        }


        function rainState(
            value
        ) {

            if (value < 20)
                return "Low rain level";

            if (value < 60)
                return "Moderate level";

            if (value < 85)
                return "High rain level";

            return "Very high level";
        }


        /* ====================================================
           UPDATE STATES
        ==================================================== */

        function updateStates(
            data
        ) {

            const states =
                document.querySelectorAll(
                    ".parameter-state"
                );

            if (states.length < 4)
                return;


            const t =
                Number(data.temperature);

            const h =
                Number(data.humidity);

            const p =
                Number(data.pressure);

            const r =
                Number(data.rainLevel);


            states[0].textContent =
                Number.isFinite(t)
                    ? temperatureState(t)
                    : "Awaiting reading";

            states[1].textContent =
                Number.isFinite(h)
                    ? humidityState(h)
                    : "Awaiting reading";

            states[2].textContent =
                Number.isFinite(p)
                    ? pressureState(p)
                    : "Awaiting reading";

            states[3].textContent =
                Number.isFinite(r)
                    ? rainState(r)
                    : "Awaiting reading";
        }


        /* ====================================================
           CHART
        ==================================================== */

        function drawChart() {

            if (!chart)
                return;


            if (
                temperatureHistory.length < 2
            ) {

                chart.innerHTML =
                    `
                    <div style="
                        color:#91a2af;
                        font-size:10px;
                    ">
                        Collecting readings...
                    </div>
                    `;

                return;
            }


            const width = 500;
            const height = 155;
            const padding = 12;


            const min =
                Math.min(
                    ...temperatureHistory
                );

            const max =
                Math.max(
                    ...temperatureHistory
                );

            const range =
                Math.max(
                    max - min,
                    1
                );


            const points =
                temperatureHistory.map(
                    (
                        value,
                        index
                    ) => {

                        const x =
                            padding +
                            (
                                index /
                                (
                                    temperatureHistory.length -
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
                                    min
                                ) /
                                range
                            ) *
                            (
                                height -
                                padding * 2
                            );


                        return {
                            x,
                            y
                        };

                    }
                );


            const line =
                points
                    .map(
                        point =>
                            `${point.x},${point.y}`
                    )
                    .join(" ");


            const dots =
                points
                    .map(
                        point =>
                            `
                            <circle
                                cx="${point.x}"
                                cy="${point.y}"
                                r="3"
                                fill="#079bc1"
                            />
                            `
                    )
                    .join("");


            chart.innerHTML =
                `
                <svg
                    viewBox="0 0 ${width} ${height}"
                    preserveAspectRatio="none"
                >

                    <polyline
                        points="${line}"
                        fill="none"
                        stroke="#079bc1"
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />

                    ${dots}

                </svg>
                `;
        }


        /* ====================================================
           UPDATE DASHBOARD
        ==================================================== */

        function updateDashboard(
            data,
            timestamp
        ) {

            const t =
                Number(data.temperature);

            const h =
                Number(data.humidity);

            const p =
                Number(data.pressure);

            const r =
                Number(data.rainLevel);


            temperatureEl.textContent =
                formatNumber(t);

            humidityEl.textContent =
                formatNumber(h);

            pressureEl.textContent =
                formatNumber(p);

            rainEl.textContent =
                formatNumber(r);


            if (chartCurrent) {

                chartCurrent.textContent =
                    `${formatNumber(t)} °C`;
            }


            if (lastUpdatedEl) {

                if (timestamp) {

                    const date =
                        new Date(timestamp);

                    if (
                        !Number.isNaN(
                            date.getTime()
                        )
                    ) {

                        lastUpdatedEl.textContent =
                            date.toLocaleTimeString(
                                [],
                                {
                                    hour:
                                        "2-digit",

                                    minute:
                                        "2-digit",

                                    second:
                                        "2-digit"
                                }
                            );

                    } else {

                        lastUpdatedEl.textContent =
                            "Just now";
                    }

                } else {

                    lastUpdatedEl.textContent =
                        "Just now";
                }
            }


            if (
                Number.isFinite(t)
            ) {

                temperatureHistory.push(t);

                if (
                    temperatureHistory.length >
                    12
                ) {
                    temperatureHistory.shift();
                }

                drawChart();
            }


            updateStates(data);
        }


        /* ====================================================
           FETCH WEATHER
        ==================================================== */

        async function fetchWeather() {

            try {

                const response =
                    await fetch(
                        API_URL,
                        {
                            cache:
                                "no-store"
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
                    !result.data
                ) {

                    throw new Error(
                        "Invalid API data"
                    );
                }


                updateDashboard(
                    result.data,
                    result.timestamp
                );


                setConnection(true);


            } catch (error) {

                console.error(
                    "Weather API:",
                    error
                );

                setConnection(false);
            }
        }


        /* ====================================================
           START
        ==================================================== */

        fetchWeather();


        setInterval(
            fetchWeather,
            2000
        );

    }
);