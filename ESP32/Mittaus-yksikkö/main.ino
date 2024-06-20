#include <esp_now.h>
#include <WiFi.h> 
#include <OneWire.h>
#include <DallasTemperature.h>

const int sensori = 4; // !! VAIHDA !!

OneWire oneWire(sensori);
DallasTemperature sensors(&oneWire);

uint8_t main_data[] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF}; // !! VAIHDA !!

float vesiLampotila;

String success;

typedef struct data_paketti {
  float vesiLampotila;
} data_paketti;

data_paketti Data;

esp_now_peer_info_t peerInfo;

void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status) {
  Serial.print("\r\nLast Packet Send Status:\t");
  Serial.println(status == ESP_NOW_SEND_SUCCESS ? "Delivery Success" : "Delivery Fail");

  if (status == 0) {
    success = "Delivery Success";
  }
  else {
    success = "Delivery Fail"
  }
}

void setup() {
  Serial.begin(115200);

  sensors.begin();

  WiFi.mode(WIFI_STA);

  if (esp_now_init() != ESP_OK) {
    Serial.println("Error initializing ESP-NOW");
    return;
  }

  esp_now_register_send_cb(OnDataSent);

  memcpy(peerInfo.peer_addr, main_data, 6);
  peerInfo.channel = 0;  
  peerInfo.encrypt = false;

  if (esp_now_add_peer(&peerInfo) != ESP_OK){
    Serial.println("Failed to add peer");
    return;
  }
}

void loop() {
  sensors.requestTemperatures();
  float lampotila = sensors.getTempCByIndex(0);

  Data.vesiLampotila = lampotila;

  esp_err_t result = esp_now_send(main_data, (uint8_t *) &Data, sizeof(Data));

  if (result == ESP_OK) {
    Serial.println("Sent with success");
  }
  else {
    Serial.println("Error sending the data");
  }
}
