# BloomCircuit

BloomCircuit is an advanced automation system designed to optimize grow room conditions. Leveraging the power of IoT, the system captures real-time soil moisture readings, controls a pump, and provides a frontend interface for data visualization and system configuration.

## Overview

The BloomCircuit project is divided into two main components:

1. **Backend**: Comprising of a NodeMCU and a Raspberry Pi, the backend handles data collection, pump control, and data storage.
2. **Frontend**: A web-based interface that provides real-time charts, historical data visualization, and system configuration options.

## Backend

### NodeMCU

The NodeMCU captures soil moisture readings and controls a pump based on the moisture levels:

- **Soil Moisture Sensor**: Connected to the A1 pin, it continuously monitors the soil's moisture levels.
- **Pump Control**: A relay connected to the D0 pin activates or deactivates a pump based on moisture readings.
- **WebSocket Communication**: The NodeMCU sends moisture readings to the Raspberry Pi in real-time via WebSocket.
- **OTA Updates**: The NodeMCU supports Over-The-Air updates, allowing for remote firmware deployments.

### Raspberry Pi

The Raspberry Pi acts as a bridge between the NodeMCU and the MongoDB database:

- **WebSocket Server**: Receives real-time moisture readings from the NodeMCU.
- **MongoDB Interaction**: Processes the data and updates a MongoDB database with the latest readings.

## Frontend

The frontend provides a user-friendly interface to interact with the BloomCircuit system:

- **Real-time Charts**: Visualize current moisture levels and pump status.
- **Historical Data**: Analyze past moisture readings and pump activity.
- **System Configuration**: Set parameters for the sensor system, such as moisture thresholds for pump activation.
- **Alerts & Notifications**: Get notified about critical conditions or system anomalies.

## Getting Started

1. **Backend Setup**: Follow the setup instructions for [NodeMCU](/backend/nodemcu/README.md) and [Raspberry Pi](/backend/rpi/README.md).
2. **Frontend Setup**: Navigate to the frontend directory and follow the setup instructions to get the web interface up and running.
3. **System Configuration**: Once the frontend is operational, access the web interface to set the desired parameters for the sensor system.

## Contributing

Opportunities for contribution will be available in the future. Stay tuned for guidelines and details.

## License

This project is licensed under the MIT License. Please refer to the `LICENSE` file for more details.

