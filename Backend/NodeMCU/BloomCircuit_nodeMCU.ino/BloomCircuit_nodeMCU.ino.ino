#include <ESP8266WiFi.h>
#include <ESP8266mDNS.h>
#include <WiFiUdp.h>
#include <ArduinoOTA.h>
#include <WebSocketsClient.h>  // Include WebSocket Library

// Replace with your network credentials
const char* ssid = "";
const char* password = "";

const int sensorPin = A0;  
const int pumpPin = D1;    

unsigned long lastUpdate = 0;
unsigned long lastPumpAction = 0;
bool watering = false;
unsigned long updateInterval = 30000;
bool pumpWasOn = false; // Add this flag at the beginning of your sketch, with the other global variables

WebSocketsClient webSocket;   // WebSocket object

void sendRestartNotification() {
    webSocket.sendTXT("action=restarted");
}

void sendRunningNotification() {
    webSocket.sendTXT("action=running");
}

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
    switch(type) {
        case WStype_DISCONNECTED:
            Serial.printf("[WSc] Disconnected!\n");
            break;
        case WStype_CONNECTED:
            Serial.printf("[WSc] Connected to url: %s\n", payload);
            sendRestartNotification();  // Send restart notification upon WebSocket connection
            break;
        // You can handle other types of WebSocket messages if necessary
    }
}

void setup() {
    // Start Serial
    Serial.begin(9600);

    // Connect to Wi-Fi
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    while (WiFi.waitForConnectResult() != WL_CONNECTED) {
        Serial.println("Connection Failed! Rebooting...");
        delay(5000);
    }

    // Set up OTA
    ArduinoOTA.setHostname("BigAutoSoftSuite");
    ArduinoOTA.begin();

    Serial.println("Ready");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());

    pinMode(LED_BUILTIN, OUTPUT);
    pinMode(pumpPin, OUTPUT);

    // Initialize WebSocket
    webSocket.begin("192.168.1.xx"/*Put the ip that you want to send to here*/, 3000, "/");
    webSocket.onEvent(webSocketEvent);
    webSocket.setReconnectInterval(5000);  // Try to reconnect every 5 seconds if connection is lost
    digitalWrite(pumpPin, HIGH);  // Ensure pump is turned off initially
}


void loop() {
    ArduinoOTA.handle();
    unsigned long now = millis();

    // If in watering state, water for 2 seconds every 10 seconds
    if (watering) {
    if (now - lastPumpAction > 300000) {  // Adjusted for 10 seconds as per your comment
        lastPumpAction = now;
        digitalWrite(pumpPin, LOW);
        webSocket.sendTXT("turning pump on");
        pumpWasOn = true; // Set the flag
    } else if ((now - lastPumpAction > 2500) && pumpWasOn) {  // Check the flag here
        digitalWrite(pumpPin, HIGH);
        webSocket.sendTXT("turning pump off");
        pumpWasOn = false; // Reset the flag
    }
}

    if (now - lastUpdate >= updateInterval) {
        lastUpdate = now;

        // Read the raw sensor value
        int sensorValue = analogRead(sensorPin);
        int moisturePercentage = map(sensorValue, 760, 320, 0, 100);
        moisturePercentage = constrain(moisturePercentage, 0, 100);

        // Adjust watering state based on moisture level
        if (moisturePercentage < 58 && !watering) {
            watering = true;
            webSocket.sendTXT("action=watering_started");
        } else if (moisturePercentage > 63 && watering) {
            watering = false;
            webSocket.sendTXT("action=watering_stopped");
        }

        String statusMessage = "Moisture Percentage: " + String(moisturePercentage) + "%, Watering: " + (watering ? "ON" : "OFF");
        webSocket.sendTXT(statusMessage);
        delay(250);
    }
    
    webSocket.loop();  // Keep the WebSocket connection alive
}
