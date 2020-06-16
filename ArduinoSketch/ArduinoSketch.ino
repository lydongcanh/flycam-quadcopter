#include <SoftwareSerial.h>
#include <MPU9250.h>
#include<Servo.h>

#define TX_PIN      7
#define RX_PIN      6
#define BAUD        9600
#define MPU_DELAY   30000

void setup_serial();
void setup_bluetooth();
void setup_mpu9250();
void loop_bluetooth();
void loop_mpu9250();

Servo ESC1;
int pos = 0; //Sets position variable
char state = 'E';

void setSpeed(int speed) {
  int angle = map(speed, 0, 100, 0, 180); //Sets servo positions to different speeds ESC1.write(angle);
  ESC1.write(angle);
}

SoftwareSerial bluetooth(RX_PIN, TX_PIN);
MPU9250 IMU(Wire, 0x68);

void setup() {
  setup_serial();
  setup_bluetooth();
  // setup_mpu9250();
  ESC1.attach(9);
}

void loop() {
  loop_bluetooth();
  // loop_mpu9250();

  if (state == '1')
  {
    setSpeed(70);
  }
  else if (state == '2')
  {
    setSpeed(60);
  } 
    else if (state == '3')
  {
    setSpeed(40);
  } 
    else if (state == '4')
  {
    setSpeed(30);
  } 
  else if (state == '0')
  {
    setSpeed(0);
  } 
  else 
  {
    setSpeed(0);
  }
}

void setup_serial() {
  Serial.begin(BAUD);
  //while (!Serial) {}
}

void setup_bluetooth() {
  Serial.println("Configuring bluetooth, please wait...");
  bluetooth.begin(BAUD);
  Serial.println("Bluetooth configuration done.");

  //while (!bluetooth) {}
}

void setup_mpu9250() {
  int status = IMU.begin();
  if (status < 0) {
    Serial.println("IMU initialization unsuccessful.");
    Serial.println("Check IMU wiring or try cycling power.");
    Serial.print("Status: ");
    Serial.println(status);
    //while(status < 0) {}
  }
}

void loop_bluetooth() {
  if (bluetooth.available()) {
    state = bluetooth.read();
    Serial.write(state);
  }
  
  if (Serial.available())
    bluetooth.write(Serial.read());
}

int mpu_delay_counter = 0;
void loop_mpu9250() {
  if (mpu_delay_counter < MPU_DELAY) {
    mpu_delay_counter++;
    return;
  }
  mpu_delay_counter = 0;

  IMU.readSensor();
  Serial.print(IMU.getAccelX_mss(), 6);
  Serial.print("\t");
  Serial.print(IMU.getAccelY_mss(), 6);
  Serial.print("\t");
  Serial.print(IMU.getAccelZ_mss(), 6);
  Serial.print("\t");
  Serial.print(IMU.getGyroX_rads(), 6);
  Serial.print("\t");
  Serial.print(IMU.getGyroY_rads(), 6);
  Serial.print("\t");
  Serial.print(IMU.getGyroZ_rads(), 6);
  Serial.print("\t");
  Serial.print(IMU.getMagX_uT(), 6);
  Serial.print("\t");
  Serial.print(IMU.getMagY_uT(), 6);
  Serial.print("\t");
  Serial.print(IMU.getMagZ_uT(), 6);
  Serial.print("\t");
  Serial.println(IMU.getTemperature_C(), 6);
}
