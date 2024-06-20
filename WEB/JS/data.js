const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Endpoint to receive sensor data via POST
app.post('/data', (req, res) => {
    const sensorData = req.body.sensorData;
    
    // Log the received data
    console.log('Received data:', sensorData);
    
    // Write data to file (clear existing data and write new data)
    fs.writeFile('data.txt', `${sensorData}\n`, (err) => {
        if (err) {
            console.error('Error writing data:', err.message);
            res.status(500).send('Error writing data');
            return;
        }
        console.log('Data saved:', sensorData);
        res.send('Data received');
    });
});

// Endpoint to retrieve all data from file via GET
app.get('/data', (req, res) => {
    // Read data from file
    fs.readFile('data.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err.message);
            res.status(500).send('Error reading data file');
            return;
        }
        res.send(data);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Data server running at http://localhost:${PORT}`);
});
