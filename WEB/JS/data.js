const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

app.post('/data', (req, res) => {
    const sensorData = req.body.sensorData;
    fs.appendFile('data.txt', `${sensorData}\n`, (err) => {
        if (err) throw err;
        console.log('Dataa vastaanotettu:', sensorData);
    });
    res.send('Data vastaanotettu');
});

app.get('/data', (req, res) => {
    fs.readFile('data.txt', 'utf8', (err, data) => {
        if (err) throw err;
        res.send(data);
    });
});

app.listen(PORT, () => {
    console.log(`Data palvelin pyörii osoitteessa: http://localhost:${PORT}`);
});