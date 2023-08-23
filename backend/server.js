const express = require('express');
const app = express();
const path = require('path');
const routes = require('./routes.js');
const bp = require('body-parser');
const ai = require('./chat-gpt-integration.js');

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

app.listen(4047, () => {
    console.log(`listening on port 4047`)
})