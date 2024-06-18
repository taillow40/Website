const axios  = require('axios');
const config = require('../config.js');
const API_KEY = config.openai;

const openai = axios.create({
    baseURL: 'https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct', 
    timeout: 10000,
    headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
    }
});

async function callChatGPT(promptText) {
    console.log(promptText);
    try {
        const response = await openai.post('/completions', {
            prompt: promptText,
            max_tokens: 100
        });
        console.log(response.data.choices[0].text.trim());
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Error calling ChatGPT:', error.response.data);
    }
}
function chickenGpt(){
    retval = `1. Chicken Fried Rice
    2. Chicken Parmesan
    3. Chicken Fajitas`;
    console.log(retval)
    return retval;
}
function hello(){
    console.log('hello');
}
module.exports = {
    hello,
    callChatGPT
}
