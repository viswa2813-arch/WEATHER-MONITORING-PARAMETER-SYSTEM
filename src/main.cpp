#include <Arduino.h>
#include <Wire.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Adafruit_BME280.h>

// ============================================================
// Wi-Fi
// ============================================================

const char *WIFI_SSID = "OPPO F29 5G e7uj";
const char *WIFI_PASSWORD = "ShadowRR";

// ============================================================
// LOCAL BACKEND
// ============================================================

const char *BACKEND_URL =
    "http://10.244.237.214:3000/api/weather";

// ============================================================
// BME280
// ============================================================

Adafruit_BME280 bme;

#define SDA_PIN 4
#define SCL_PIN 5

const uint8_t BME_ADDRESS = 0x76;

// ============================================================
// RAIN SENSOR
// ============================================================

#define RAIN_PIN 26

// ============================================================
// TIMING
// ============================================================

unsigned long lastSendTime = 0;

const unsigned long SEND_INTERVAL = 10000;

// ============================================================
// CONNECT TO WI-FI
// ============================================================

void connectWiFi()
{
    Serial.println();
    Serial.println("Connecting to Wi-Fi...");

    WiFi.begin(
        WIFI_SSID,
        WIFI_PASSWORD);

    int attempts = 0;

    while (
        WiFi.status() != WL_CONNECTED &&
        attempts < 30)
    {
        delay(500);
        Serial.print(".");
        attempts++;
    }

    Serial.println();

    if (WiFi.status() == WL_CONNECTED)
    {
        Serial.println("Wi-Fi       : CONNECTED");

        Serial.print("IP Address  : ");
        Serial.println(WiFi.localIP());
    }
    else
    {
        Serial.println("Wi-Fi       : CONNECTION FAILED");
    }
}

// ============================================================
// READ SENSOR VALUES
// ============================================================

void readSensors()
{
    float temperature =
        bme.readTemperature();

    float humidity =
        bme.readHumidity();

    float pressure =
        bme.readPressure() / 100.0F;

    int rawRainValue =
        analogRead(RAIN_PIN);

    float rainLevel =
        100.0 -
        ((float)rawRainValue /
         4095.0 *
         100.0);

    Serial.println();
    Serial.println("--------------------------------");

    Serial.print("Temperature : ");
    Serial.print(temperature);
    Serial.println(" °C");

    Serial.print("Humidity    : ");
    Serial.print(humidity);
    Serial.println(" %");

    Serial.print("Pressure    : ");
    Serial.print(pressure);
    Serial.println(" hPa");

    Serial.print("Rain Level  : ");
    Serial.print(rainLevel);
    Serial.println(" %");

    Serial.print("Rain Raw ADC: ");
    Serial.println(rawRainValue);

    Serial.print("Wi-Fi       : ");

    if (WiFi.status() == WL_CONNECTED)
    {
        Serial.println("CONNECTED");
    }
    else
    {
        Serial.println("DISCONNECTED");
    }
}

// ============================================================
// SEND WEATHER DATA
// ============================================================

void sendWeatherData()
{
    if (WiFi.status() != WL_CONNECTED)
    {
        Serial.println();
        Serial.println("Wi-Fi disconnected.");
        Serial.println("Reconnecting...");

        connectWiFi();

        if (WiFi.status() != WL_CONNECTED)
        {
            Serial.println("Unable to reconnect.");
            return;
        }
    }

    float temperature =
        bme.readTemperature();

    float humidity =
        bme.readHumidity();

    float pressure =
        bme.readPressure() /
        100.0F;

    int rawRainValue =
        analogRead(RAIN_PIN);

    float rainLevel =
        100.0 -
        ((float)rawRainValue /
         4095.0 *
         100.0);

    float windSpeed = 0.0;

    float lightIntensity = 0.0;

    // --------------------------------------------------------
    // Create JSON
    // --------------------------------------------------------

    String jsonData = "{";

    jsonData +=
        "\"temperature\":" +
        String(
            temperature,
            2) +
        ",";

    jsonData +=
        "\"humidity\":" +
        String(
            humidity,
            2) +
        ",";

    jsonData +=
        "\"pressure\":" +
        String(
            pressure,
            2) +
        ",";

    jsonData +=
        "\"rainLevel\":" +
        String(
            rainLevel,
            2) +
        ",";

    jsonData +=
        "\"windSpeed\":" +
        String(
            windSpeed,
            2) +
        ",";

    jsonData +=
        "\"lightIntensity\":" +
        String(
            lightIntensity,
            2);

    jsonData += "}";

    // --------------------------------------------------------
    // Serial information
    // --------------------------------------------------------

    Serial.println();

    Serial.println(
        "Sending data to backend...");

    Serial.print(
        "Backend URL: ");

    Serial.println(
        BACKEND_URL);

    Serial.print(
        "JSON: ");

    Serial.println(
        jsonData);

    // --------------------------------------------------------
    // HTTP
    // --------------------------------------------------------

    HTTPClient http;

    http.setTimeout(10000);

    if (!http.begin(BACKEND_URL))
    {
        Serial.println(
            "ERROR: HTTP begin failed.");

        return;
    }

    http.addHeader(
        "Content-Type",
        "application/json");

    int httpResponseCode =
        http.POST(
            jsonData);

    // --------------------------------------------------------
    // Response
    // --------------------------------------------------------

    Serial.print(
        "HTTP Response Code: ");

    Serial.println(
        httpResponseCode);

    if (httpResponseCode > 0)
    {
        String response =
            http.getString();

        Serial.println(
            "Backend Response:");

        Serial.println(
            response);
    }
    else
    {
        Serial.print(
            "HTTP Error: ");

        Serial.println(
            http.errorToString(
                httpResponseCode));
    }

    http.end();
}

// ============================================================
// SETUP
// ============================================================

void setup()
{
    Serial.begin(115200);

    delay(2000);

    Serial.println();
    Serial.println(
        "================================");

    Serial.println(
        " WEATHER PARAMETER MONITORING");

    Serial.println(
        "================================");

    // --------------------------------------------------------
    // I2C
    // --------------------------------------------------------

    Wire.setSDA(SDA_PIN);
    Wire.setSCL(SCL_PIN);

    Wire.begin();

    Serial.println(
        "Starting BME280...");

    // --------------------------------------------------------
    // BME280
    // --------------------------------------------------------

    if (!bme.begin(BME_ADDRESS))
    {
        Serial.println(
            "ERROR: BME280 NOT FOUND!");

        Serial.println(
            "Check BME280 wiring.");
    }
    else
    {
        Serial.println(
            "BME280     : CONNECTED");

        Serial.print(
            "I2C Address: 0x");

        Serial.println(
            BME_ADDRESS,
            HEX);
    }

    // --------------------------------------------------------
    // Rain sensor
    // --------------------------------------------------------

    pinMode(
        RAIN_PIN,
        INPUT);

    Serial.println(
        "Rain Sensor: READY");

    // --------------------------------------------------------
    // Wi-Fi
    // --------------------------------------------------------

    connectWiFi();

    Serial.println();

    Serial.println(
        "System ready.");
}

// ============================================================
// LOOP
// ============================================================

void loop()
{
    readSensors();

    if (
        millis() -
            lastSendTime >=
        SEND_INTERVAL)
    {
        lastSendTime =
            millis();

        sendWeatherData();
    }

    delay(2000);
}