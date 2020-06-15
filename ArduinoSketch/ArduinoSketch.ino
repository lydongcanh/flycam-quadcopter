#include <SoftwareSerial.h>
 
#define TX_PIN      7
#define RX_PIN      6
 
SoftwareSerial bluetooth(RX_PIN, TX_PIN);
 
void setup() {
  Serial.begin(9600);
  while (!Serial) {}
  
  Serial.println("Configuring, please wait...");
  
  bluetooth.begin(9600);
  Serial.println("Config done");
  while (!bluetooth) {}
  }
 
void loop() {
  if (bluetooth.available()) {
    Serial.write(bluetooth.read());
  }
  
  if (Serial.available()) {
    bluetooth.write(Serial.read());
  }
}
