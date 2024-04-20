const { OpenAI } = require('openai');

const API_TOKEN = 'v8m5nok8iabc';
const BASE_URL = "https://openai-proxy.sellestial.com/api";

const client = new OpenAI({
    apiKey: API_TOKEN,
    baseURL: BASE_URL
});

async function handleMessage(req, res, next) {
    try {
        const userMessage = req.body.message;
        const vpisnaSt = req.body.vpisnaSt;

        async function readFRIUrnik(vpisnaSt) {
            const response = await fetch(`https://urnik.fri.uni-lj.si/timetable/fri-2023_2024-letni-1-17/allocations?student=${vpisnaSt}`);
            const html = await response.text();
            return html;
            const doc = new DOMParser().parseFromString(html, 'text/html');
            return doc;
            const selectedElement = doc.querySelector('.entry-hover');
            return selectedElement;
        }

        async function sendMessageToAI(userMessage) {
            const messages = [
                {
                    role: "system",
                    content: "You are a helpful assistant."
                },
                {
                    role: "user",
                    content: userMessage
                }
            ];

            const response = await client.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: messages
            });

            const aiContent = response.choices[0].message.content;
            return aiContent;
        }

        const urnik = await readFRIUrnik(vpisnaSt);

        const aiResponse = await sendMessageToAI(userMessage);

        res.json({ aiResponse, urnik });
    }
    catch (error) {
        next(error);
    }
}

module.exports = {
    handleMessage
};