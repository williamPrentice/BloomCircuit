require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;





const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_URI;

let db;

console.log("Script started");

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, connectTimeoutMS: 10000 })
    .then(client => {
        console.log("Connected to MongoDB successfully!");

        db = client.db("");

        // Start Express Server Here
        app.use(express.static('public'));

        app.get('/', (req, res) => {
            res.sendFile(__dirname + '/public/index.html');
        });

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
        

    })
    .catch(err => {
        console.error("Failed to connect to MongoDB:", err);
    });

    // const ObjectId = require('mongodb').ObjectId;

    app.get('/data', (req, res) => {
        const collection = db.collection("");
        collection.find({}).toArray()
            .then(docs => {
                res.json(docs);
            })
            .catch(err => {
                console.error("Error fetching documents:", err);
                res.status(500).send('Failed to fetch data from MongoDB');
            });
    });
    
app.get('/latest-data', (req, res) => {
    const collection = db.collection("");
    
    collection.find({})
        .sort({ _id: -1 })  // Sort by ObjectID in descending order to get the latest documents
        .limit(2000)  // Limit to the last 2,000 documents
        .toArray()
        .then(docs => {
            res.json(docs);
        })
        .catch(err => {
            console.error("Error fetching latest documents:", err);
            res.status(500).send('Failed to fetch latest data from MongoDB');
        });
});

    
