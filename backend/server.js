const express = require('express');
const app = express();
const path = require('path');
const routes = require('./routes.js');
const fs = require('fs');

app.disable('x-powered-by');
app.use('/', routes)

const UPLOADS_DIR = path.join(__dirname, '../uploads');
app.use(express.static(path.join(__dirname, '../public')));

app.post('/whatAmIEating', (req, res) => {
    res.status(503).send('The meal maker is currently disabled.');
});

app.get('/stocks/get-csvs', (req, res) => {
    const directoryPath = UPLOADS_DIR;

    if (!fs.existsSync(directoryPath)) {
        return res.status(404).send('Uploads directory not found.');
    }

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).send('Error reading directory');
        } else {
            files = files.filter(file => file.endsWith('.csv') && file != "history.csv");
            if (files.length === 0) {
                return res.status(404).send('No files found in uploads directory.');
            } else {
                return res.status(200).send(files);
            }
        }
    });
});

app.get('/stocks/get-csv/:filename', (req, res) => {
    const filename = path.basename(req.params.filename);
    if (!/^[\w. -]+\.csv$/.test(filename)) {
        return res.status(400).send('Invalid filename');
    }
    const filePath = path.join(UPLOADS_DIR, filename);
    if (path.dirname(filePath) !== UPLOADS_DIR) {
        return res.status(400).send('Invalid filename');
    }
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send('File not found');
        } else {
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');

            // Send the file
            res.sendFile(filePath);
        }
    });
});



app.listen(4047, '127.0.0.1', () => {
    console.log(`listening on port 4047`)
})