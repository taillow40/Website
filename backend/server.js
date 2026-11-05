const express = require('express');
const app = express();
const path = require('path');
const routes = require('./routes.js');
const bp = require('body-parser');
const ai = require('./chat-gpt-integration.js');
const fs = require('fs');

app.disable('x-powered-by');
app.use('/', routes)
app.use(bp.json({ limit: '10kb' }))
app.use(bp.urlencoded({ extended: true, limit: '10kb' }))

const UPLOADS_DIR = path.join(__dirname, '../uploads');
app.use(express.static(path.join(__dirname, '../public')));

app.post('/whatAmIEating', (req, res) => {
    const fields = ['ingredient', 'cuisine', 'time'];
    if (fields.some(f => req.body[f] !== undefined && (typeof req.body[f] !== 'string' || req.body[f].length > 50))) {
        return res.status(400).send('Invalid input');
    }
    if (!req.body.ingredient) {
        return res.status(400).send('Please enter an ingredient');
    }
    let prompt = `List only the names of 3 dishes whose main ingredient is ${req.body.ingredient}`
    if (req.body.cuisine) {
        prompt += ` in the ${req.body.cuisine} cuisine`
    }
    if (req.body.time) {
        prompt += ` and can be made in around ${req.body.time}.`
    }

    ai.callChatGPT(prompt)
        .then(response => res.send(response || 'Something went wrong, try again.'))
        .catch(() => res.status(500).send('Something went wrong, try again.'));
})

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