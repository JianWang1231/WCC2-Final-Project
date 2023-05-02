#define PIN_TRIG 10
#define PIN_ECHO 9
void setup() {
  Serial.begin(9600);
  pinMode(PIN_TRIG, OUTPUT);

  pinMode(PIN_ECHO, INPUT);
}

void loop() {
  Serial.print(checDistance());
}
float checDistance() {
  digitalWrite(PIN_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);
  float dist = pulseIn(PIN_ECHO, HIGH) / 58;
  delay(100);
  return dist;
}
