#define POT A0

void setup() {
    // Establece la velocidad de datos en bits por segundo
    Serial.begin(9600);
}

void loop() {
    // Leemos el valor del potenciometro
    int sensorValue = analogRead(A0);
    // Enviamos ese valor por el puerto serial, agregandole el caracter '\n'
    Serial.println(sensorValue);
    // Nos esperamos 10 milisegundos
    delay(10);
}
