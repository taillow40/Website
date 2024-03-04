const express = require('express');
const multer = require('multer');
const app = express();
const path = require('path');
const routes = require('./routes.js');
const bp = require('body-parser');
const ai = require('./chat-gpt-integration.js');
const fs = require('fs');

app.use('/', routes)
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '../public')));

app.post('/whatAmIEating', (req, res) => {
    if(!req.body.ingredient || req.body.ingredient == ''){
        res.send('Please enter an ingredient');
    }
    let prompt = `List only the names of 3 dishes whose main ingredient is ${req.body.ingredient}`
    if(req.body.cuisine){
        prompt += ` in the ${req.body.cuisine} cuisine`
    } 
    if(req.body.time){
        prompt += ` and can be made in around ${req.body.time}.`
    } 
    
    ai.callChatGPT(prompt)
        .then(response => {
            res.send(response);
        });
})

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.post('/stocks/upload-csv', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    res.send('File uploaded successfully: ' + req.file.path);
  });

app.get('/stocks/get-csvs', (req, res) => {
    const directoryPath = path.join('uploads');

    if (!fs.existsSync(directoryPath)) {
        return res.status(404).send('Uploads directory not found.');
    }

    fs.readdir(directoryPath, (err, files) => {
        files = files.filter(file => file != "history.csv");

        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).send('Error reading directory');
        } else {
            if (files.length === 0) {
                return res.status(404).send('No files found in uploads directory.');
            } else {
                return res.status(200).send(files);
            }
        }
    });
});

app.get('/stocks/get-csv/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('File does not exist:', err);
            return res.status(404).send('File not found');
        } else {
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');
            
            // Send the file
            res.sendFile(filePath);
        }
    });
});



app.listen(4047, () => {
    console.log(`listening on port 4047`)
})