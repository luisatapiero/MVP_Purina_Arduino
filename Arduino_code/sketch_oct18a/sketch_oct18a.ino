int xPin = A0;
int yPin = A1;
int buttonPin = 7;
int buttonVal;
int xVal;
int yVal;
int dt = 100;

void setup() {

pinMode(xPin, INPUT);
pinMode(yPin, INPUT);
pinMode(buttonPin, INPUT);
digitalWrite(buttonPin, HIGH);

Serial.begin(9600);

}

void loop() {

xVal = makePercent(analogRead(xPin));
yVal = makePercent(analogRead(yPin));
buttonVal = digitalRead(buttonPin);
Serial.print(xVal);
Serial.print(' ');
Serial.print(yVal);
Serial.print(' ');
Serial.println(buttonVal);

delay(dt);

}

int makePercent (float value) {
  return (value / 1023.00 * 100);
}