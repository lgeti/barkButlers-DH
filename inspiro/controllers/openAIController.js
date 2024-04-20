const { OpenAI } = require('openai');

const API_TOKEN = 'v8m5nok8iabc';
const BASE_URL = "https://openai-proxy.sellestial.com/api";

const client = new OpenAI({
    apiKey: API_TOKEN,
    baseURL: BASE_URL
});

async function main(req, res, next) {
    try {
        const userMessage = req.body.message;
        const urnik = req.body.urnik;

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

        const aiResponse = await sendMessageToAI(userMessage);

        res.json({ aiResponse, urnik });
    }
    catch (error) {
        next(error);
    }
}

module.exports = {
    main
};