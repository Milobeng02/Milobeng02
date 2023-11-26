// Define pin numbers for sensors, actuators, and potentiometer
#define SOIL_MOISTURE_PIN A0
#define LIGHTBREAK_SENSOR_PIN A1
#define MQ2_SENSOR_PIN A3
#define RELAY_PIN 3
#define POTENTIOMETER_PIN A4
#define LED_PIN_A 5  // Pin for the LED controlled by the potentiometer
#define LED_PIN_B 6  // Pin for the LED controlled by the lightbreak sensor
#define BUZZER_PIN 7

// Define threshold values
const int MOISTURE_THRESHOLD = 200;  // Adjust based on your soil moisture sensor readings
const int LIGHT_THRESHOLD = 500;     // Adjust based on your lightbreak sensor readings
const int GAS_THRESHOLD = 200;       // Adjust based on your gas sensor readings

void setup() {
  Serial.begin(9600);
  pinMode(LIGHTBREAK_SENSOR_PIN, INPUT);
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(POTENTIOMETER_PIN, INPUT);
  pinMode(LED_PIN_A, OUTPUT);
  pinMode(LED_PIN_B, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
}

void loop() {
  // Read sensor values
  int moisture = analogRead(SOIL_MOISTURE_PIN);
  int lightValue = analogRead(LIGHTBREAK_SENSOR_PIN);
  int gasValue = analogRead(MQ2_SENSOR_PIN);

  // Check soil moisture level
  if (moisture < MOISTURE_THRESHOLD) {
    // Soil is too dry, turn on water pump
    digitalWrite(RELAY_PIN, HIGH);
    Serial.println("Action: Water pump activated for irrigation.");

    // Beep pattern for soil moisture activation
    beepPattern(2, 666, 300);  // Beep 2 times with frequency 666 Hz in delay 300ms

    // Wait for irrigation to complete
    delay(5000);  // Simulated irrigation time, adjust as needed

    // Turn off water pump after irrigation
    digitalWrite(RELAY_PIN, LOW);
    Serial.println("Action: Irrigation completed, water pump deactivated.");

    // Beep once to indicate irrigation is done
    beepPattern(1, 1000, 500);  // Beep once with frequency 1000 Hz in delay 500ms
  }

  // Check gas level
  if (gasValue > GAS_THRESHOLD) {
    // High gas level detected, take appropriate action
    Serial.println("Action: Gas detected, potential hazard. Implement safety measures.");

    // Beep pattern for gas detection
    beepPattern(3, 1000, 1500);  // Beep 3 times with frequency 1000 Hz in delay 1500ms
  }

  // Check light level
  int potValue = analogRead(POTENTIOMETER_PIN);

  // Calculate the combined brightness using a weighted average
  int brightnessB = (map(lightValue, 0, LIGHT_THRESHOLD, 0, 255) + map(potValue, 0, 1023, 0, 255)) / 2;

  // Set the brightness of LED_PIN_B
  analogWrite(LED_PIN_B, brightnessB);

  // Check darkness level from lightbreak sensor and adjust LED brightness
  int brightnessA = map(potValue, 0, 1023, 0, 255);  // Map potentiometer value to LED brightness
  analogWrite(LED_PIN_A, brightnessA);

  // Print sensor values to serial monitor
  Serial.print("Soil Moisture: ");
  Serial.print(moisture);
  Serial.print(", Light Value: ");
  Serial.print(lightValue);
  Serial.print(", Gas Value: ");
  Serial.print(gasValue);
  Serial.print(", Potentiometer Value: ");
  Serial.println(potValue);

  delay(1000);  // Add a delay to prevent rapid sensor readings
}

// Function to generate beep pattern
void beepPattern(int count, int frequency, int duration) {
  for (int i = 0; i < count; i++) {
    tone(BUZZER_PIN, frequency);
    delay(duration);
    noTone(BUZZER_PIN);
    delay(100);  // Pause between beeps
  }
}
