# NodeMCU Setup for BloomCircuit

This document provides a comprehensive overview of the NodeMCU's role in the BloomCircuit project, detailing its connections, functionality, and communication with the Raspberry Pi.

## Overview

The NodeMCU serves as a crucial component in the BloomCircuit project. It's responsible for controlling a pump based on soil moisture levels and communicating these readings to a Raspberry Pi for further processing and action. Additionally, the NodeMCU is equipped with OTA (Over-The-Air) technology, allowing for remote firmware updates without physical access to the device.

## Flow and Functionality

1. **Soil Moisture Reading**: The NodeMCU continuously monitors the soil's moisture levels using a sensor connected to its A1 pin. 

2. **Pump Control**: Based on the moisture readings, the NodeMCU can activate or deactivate a pump to maintain optimal soil conditions. This control is achieved through a relay connected to the D0 pin.

3. **WebSocket Communication**: After each moisture reading, the NodeMCU communicates the data to a Raspberry Pi via WebSocket. This ensures real-time data transfer and allows the Raspberry Pi to make informed decisions or store the data for further analysis.

4. **OTA Updates**: The NodeMCU is configured to support OTA updates. This means that firmware changes, improvements, or bug fixes can be deployed remotely, ensuring that the system is always up-to-date without the need for physical intervention.

## Connections

### Pump Control (Relay)

- **NodeMCU D0** is connected to **K1** on the 4-channel relay. This connection allows for turning the pump on and off.

### Soil Moisture Sensor

- **NodeMCU A1** captures the moisture level readings from the soil sensor.

### Power

- **NodeMCU 5V (VCC)** is connected to the **5V** power source.
- **NodeMCU GND** is connected to the **Ground (GND)**.

## Code

The code running on the NodeMCU handles several tasks:

- Reading moisture levels from the A1 pin.
- Controlling the pump via the D0 pin based on moisture readings.
- Communicating with the Raspberry Pi using WebSocket to transmit the moisture data.
- Listening for OTA updates and applying them as they become available.

## Getting Started

For new users looking to understand or work with the NodeMCU in the BloomCircuit project:

1. Familiarize yourself with the [NodeMCU documentation](https://nodemcu.readthedocs.io/en/release/).
2. Review the codebase to understand the logic behind moisture reading, pump control, WebSocket communication, and OTA handling.
3. Ensure that the WebSocket server on the Raspberry Pi is running and accessible.
4. Test OTA updates in a controlled environment before deploying to the main device.

## Future Enhancements

As the BloomCircuit project evolves, there's potential to integrate more sensors or actuators with the NodeMCU, expanding its capabilities and enhancing the overall system.

