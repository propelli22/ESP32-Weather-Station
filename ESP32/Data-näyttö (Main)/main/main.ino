#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "DNA-WIFI-62C7";
const char* password = "48140406";
const char* serverUrl = "http://192.168.1.123:3000/data"; // Replace with your server URL

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  
  Serial.println("Connected to WiFi");
}

void sendData(float sensorData) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    String jsonPayload = "{\"sensorData\":" + String(sensorData) + "}";
    int httpResponseCode = http.POST(jsonPayload);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      Serial.print("Server response: ");
      Serial.println(response);
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
      Serial.print("Error detail: ");
      Serial.println(http.errorToString(httpResponseCode).c_str());
    }
    
    http.end();
  } else {
    Serial.println("WiFi Disconnected");
  }
}

void loop() {
  float testValue = 14.0; // Fixed test value
  
  sendData(testValue);
  
  delay(10000); // Send data every minute
}
