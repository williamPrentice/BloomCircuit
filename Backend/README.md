# BloomCircuit Backend

This is the backend for the BloomCircuit project. It consists of a NodeMCU setup to capture soil moisture readings and an RPi that receives this data via WebSocket and then uploads it to a server.

## NodeMCU

The NodeMCU setup uses the Soil Capac. Sens. V2 to capture soil moisture readings.

- **Directory**: `/backend/nodemcu`
- [Setup and Instructions](/backend/nodemcu/README.md)

## Raspberry Pi (RPi)

The RPi receives data from the NodeMCU via WebSocket and then uploads it to a server.

- **Directory**: `/backend/rpi`
- [Setup and Instructions](/backend/rpi/README.md)

## Setup 1

1. **NodeMCU**: Follow the [NodeMCU setup instructions](/backend/nodemcu/README.md).
2. **RPi**: Follow the [RPi setup instructions](/backend/rpi/README.md).

## Dependencies

- List any global dependencies here.

## Contributing

Provide guidelines if you want others to contribute.

## License

Specify your license here.
