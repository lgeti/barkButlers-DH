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

        // Function to send a message to the AI and handle the response
        async function sendMessageToAI(userMessage) {
            userMessage = 'hello, how are you today';
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

        // Call the function to send the message to AI
        const aiResponse = await sendMessageToAI(userMessage);

        res.json({ aiResponse });
    }
    catch (error) {
        next(error);
    }
}

module.exports = {
  handleMessage
};