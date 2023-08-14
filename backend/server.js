const express = require('express');
const app = express();
const path = require('path');
const bp = require('body-parser');
const ai = require('./chat-gpt-integration.js');

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '../public')));

ai.hello();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.post('/whatAmIEating', (req, res) => {
    ai.callChatGPT(req.body.prompt)
        .then(response => {
            res.send(response);
        });
})

app.listen(4047, () => {
    console.log(`listening on port 4047`)
})