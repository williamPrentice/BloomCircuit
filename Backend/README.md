# BloomCircuit Backend

This is the backend for the BloomCircuit project. It consists of a NodeMCU setup to capture soil moisture readings and an RPi that receives this data via WebSocket and then uploads it to a server.

## NodeMCU

The NodeMCU setup uses the Capacitive Soil Moisture Sensor V2 to capture soil moisture readings.

- **Directory**: `/Backend/NodeMCU`
- [NodeMCU Setup and Instructions](/Backend/NodeMCU/README.md)

## Raspberry Pi (RPi)

The RPi receives data from the NodeMCU via WebSocket and then uploads it to a server.

- **Directory**: `/backend/rpi`
- [RPi Setup and Instructions](/Backend/Rpi/README.md)

## Setup

1. **NodeMCU**: Follow the [NodeMCU setup instructions](/backend/nodemcu/README.md).
2. **RPi**: Follow the [RPi setup instructions](/backend/rpi/README.md).

## Dependencies

- List any global dependencies here.

## Contributing

Opportunities for contribution will be available in the future. Stay tuned for guidelines and details.

