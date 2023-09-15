const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const { MongoClient } = require('mongodb');

// Replace with your Atlas connection string
const uri = "";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let collection;

client.connect(err => {
    if (err) {
        console.error("MongoDB connection error:", err);
        process.exit();
    }
    console.log("Connected to MongoDB Atlas");
    collection = client.db("").collection("s");
});

// This is executed whenever a new WebSocket connection is established
wss.on('connection', (ws) => {
    console.log('Client connected');

    // This is executed whenever a message is received from a connected client
    ws.on('message', (message) => {
        console.log('Received:', message.toString());
    
        const jsonData = convertToJSON(message.toString());
        if (jsonData) {
            collection.insertOne(jsonData, (err, result) => {
                if (err) console.error("Error inserting data into MongoDB:", err);
                else console.log("Data inserted into MongoDB");
            });
        }
    });
    

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// This still responds to POST requests on the /endpoint path (if you still need it)
app.post('/endpoint', (req, res) => {
    console.log(req.body);
    res.send('Data received.\n');
});

function convertToJSON(dataStr) {
    let jsonData = {};

    if (dataStr.includes("action=")) {
        const [, actionValue] = dataStr.split('=');
        jsonData.action = actionValue;
    } else if (dataStr.includes("Moisture Percentage:")) {
        const [, moistureStr] = dataStr.split(':');
        const [moistureValue] = moistureStr.match(/\d+/);  // Extract numbers from string
        jsonData.moisturePercentage = parseInt(moistureValue);
        jsonData.watering = dataStr.includes("Watering: ON") ? "ON" : "OFF";
    } else {
        console.warn('Unknown data format received:', dataStr);
        return null;
    }

    return jsonData;
}


const port = 3000; // You can choose any port

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
