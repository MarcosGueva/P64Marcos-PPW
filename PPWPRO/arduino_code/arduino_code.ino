#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// Dirección I2C del LCD (Cambia a 0x3F si 0x27 no funciona)
LiquidCrystal_I2C lcd(0x27, 16, 2);

// Definir pines
const int greenLed = 3;
const int redLed = 4;
const int buzzer = 5;

// Contador de aciertos
int aciertos = 0;
unsigned long lastCommandTime = 0; // Para evitar múltiples lecturas

void setup() {
    Serial.begin(115200);

    // Configurar pines como salida
    pinMode(greenLed, OUTPUT);
    pinMode(redLed, OUTPUT);
    pinMode(buzzer, OUTPUT);

    // Inicializar LCD
    lcd.init();
    lcd.backlight();
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Juego Iniciado!");

    Serial.println("✅ Sistema Listo");
}

void loop() {
    if (Serial.available()) {
        char command = Serial.read();
        
        // Evitar múltiples detecciones de la misma señal
        unsigned long currentTime = millis();
        if (currentTime - lastCommandTime < 1000) { // 1 segundo de protección
            return; // Ignorar señales repetidas en menos de 1 seg
        }
        lastCommandTime = currentTime;

        if (command == 'G') { // Acierto
            aciertos++;
            lcd.clear();
            lcd.setCursor(0, 0);
            lcd.print("Aciertos: ");
            lcd.print(aciertos);

            // Parpadear LED verde y sonar buzzer 1 vez
            digitalWrite(greenLed, HIGH);
            tone(buzzer, 1000, 200); // 1000 Hz por 200ms
            delay(200);
            noTone(buzzer);
            digitalWrite(greenLed, LOW);

            Serial.println("✅ Acierto registrado");
        } 
        
        else if (command == 'R') { // Error
            lcd.clear();
            lcd.setCursor(0, 0);
            lcd.print("Perdiste! Puntaje:");
            lcd.setCursor(0, 1);
            lcd.print(aciertos);

            // Encender LED rojo por 2.5 segundos
            digitalWrite(redLed, HIGH);
            delay(2500);
            digitalWrite(redLed, LOW);

            Serial.println("❌ Error registrado");
        }
    }
}

