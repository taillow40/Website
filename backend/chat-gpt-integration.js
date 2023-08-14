const axios  = require('axios');
const config = require('../config.js');
const API_KEY = config.openai;

const openai = axios.create({
    baseURL: 'https://api.openai.com/v1/engines/text-davinci-003', 
    timeout: 10000,
    headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
    }
});

async function callChatGPT(promptText) {
    try {
        const response = await openai.post('/completions', {
            prompt: promptText,
            max_tokens: 150
        });
        console.log(response.data.choices[0].text.trim());
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Error calling ChatGPT:', error.response.data);
    }
}

function hello(){
    console.log('hello');
}
module.exports = {
    hello,
    callChatGPT
}
