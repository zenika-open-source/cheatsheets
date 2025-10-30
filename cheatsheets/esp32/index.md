::: column
# ESP32 Diagram
![ESP32 Pinout diagram](assets/pinout.png "ESP32 Pinout diagram").

# ESP32 Capacity

|                    |                          |
|--------------------|--------------------------|
| - WiFi 2.4Ghz      | - Analog GPIO            |
| - Bluetooth        | - Touch sensor           |
| - 240Mhz dual core | - Hall sensor            |
| - Digital GPIO     | - I2C, SPI, SD, UART . . . |


# GPIOs digital specificities


| GPIO    | INPUT | OUTPUT | Comments           |
|---------|:-----:|:------:|--------------------|
| 0       |   Y   |   Y    | Pullup auto        |
| 1       |   N   |   Y    | TX0 UART PC        |
| 2       |   Y   |   Y    | Pulldown auto      |
| 3       |   Y   |   N    | RX0 UART PC        |
| 4 - 5   |   Y   |   Y    |                    |
| 6 - 11  |   N   |   N    | internal flash     |
| 12      |   Y   |   Y    | Pulldown auto      |
| 13 - 14 |   Y   |   Y    |                    |
| 15      |   Y   |   Y    | Pullup auto        |
| 16 - 33 |   Y   |   Y    |                    |
| 34 - 39 |   Y   |   N    | No pullup/pulldown |
| EN      |   N   |   N    | ESP32 Reset        |

:::

::: column
# Structure

```cpp
// Initialization function
void setup() {}

// Run function 
void loop() {}
```

# Digital IO

```cpp
pinMode(pin, [INPUT, OUTPUT, INPUT_PULLDOWN, INPUT_PULLUP]);
int digitalRead(pin);
digitalWrite(pin, value);
```

`value` can be `HIGH` or `LOW`

# Analog IO

```cpp
// return value between 0 - 4095
int analogRead(pin);

// return value in millivolts
int analogReadMilliVolts(pin);

// fake analog => PWM; 0 - 255
analogWrite(pin, value);
```

# Advanced IO

```cpp
// generate square wave at freq
tone(pin, freq, duration_ms?);
// stop generating wave
noTone(pin);

// shift each bit of value to dataPin at clkPin speed
// if value = 22 (0010110) and bitOrder MSBFIRST then
// dataPin will take value 0, 0, 1, 0, 1, 1, 0 at rhythm
// of clkPin
shiftOut(dataPin, clkPin, [MSBFIRST, LSBFIRST], value);
```

# Time
```cpp
unsingned long millis(); // overflow: 50days
unsigned long micros(); // overflow 70min
delay(ms);
vTaskDelay(ms); // use if multi-threading
delayMicroseconds(us)
```


:::
::: column

# Serial

```cpp
void setup() {
  Serial.begin(baudrate); // usually 115200
}

void loop() {
  if (Serial.available() == 0) {
    String message = Serial.readString();
    // can be read byte by byte with Serial.read();
    message.trim();
  }
  Serial.print("Hello");
  Serial.println(" World");
  // Not mandatory, wait for transmission to finish
  Serial.flush();
}
```

# External interrupts
```cpp
attachInterrupt(pin, function, [LOW, CHANGE, RISING, FALLING]);
detachInterrupt(pin);
noInterrupts(); // disable all interruptions
interrupts(); // re-enable all interruptions
```

# Mutli threading
/!\ do not overload core 0 as it controls WiFi

```cpp
// core: 0 or 1
TaskHandle_t taskRef;
xTaskCreatePinnedToCore(taskFunc, threadName, stackSize, 
                        parameters, priority, &taskRef, core);
vTaskDelete(taskRef);

// example:
TaskHandle_t myThreadTask;
xTaskCreatePinnedToCore(myThread, "My thread", 10000, 
                        NULL, 2, &myThreadTask, 0);

void myThread(void* parameter) {
    doSomething();
    vTaskDelay(200);
    doSomethingElse();
    vTaskDelete(myThreadTask);
}
```
:::

:::column

# WIFI

Connect to wifi AP

```cpp
#include <WiFi.h>
#define SSID zenika
#define PWD zenika

void setup() {
  Serial.begin(115200);
  WiFi.begin(SSID, PWD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
  Serial.print("Connected. IP: ");
  Serial.println(WiFi.localIP());
}

```

# HTTP

HTTP Client request with `HTTPClient` lib
```cpp
#include <HTTPClient.h>
String serverUrl = "http://192.168.0.88:3000/ping";

void setup() {
  // WiFi connection [...]
}

void loop() {
  if(myConditionToSendRequest) {
    HTTPClient http;
    String serverPath = serverUrl + "?name=Zenika";
    http.begin(serverPath);
    int httpResponseCode = http.GET();
    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      String response = http.getString();
      Serial.println(response);
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
    // Free resources
    http.end();
  }
}

```

:::

::: column

# Web server

```cpp

#include <WebServer.h>

WebServer server(3000);

void handlePingRequest() {
  server.send(200, "text/html", "OK");
  digitalWrite(LED_BUILTIN, HIGH);
  delay(1000);
  digitalWrite(LED_BUILTIN, LOW);
}

void setup() {
  // WiFi connection [...]
  server.on("/ping", handlePingRequest);
  server.begin();
}

void loop() {
  server.handleClient();
}


```


Note that `server.handleClient();` is mandatory to tell the lib to check the network stack request buffer.

Otherwise, request from clients will not be accepted.

The longer the delay between `handleClient` the longer the request connection will take.
:::
