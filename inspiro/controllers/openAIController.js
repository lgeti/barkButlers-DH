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
        const imageUrl = "https://i.pinimg.com/736x/3d/90/7f/3d907f72a577dfcb702751b047e201c5.jpg";

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

        async function faceDetector(imageUrl) {
            const apiKey = 'r6ggfvdal68rs118rcmacn3a7v';
            const apiSecret = 'q9ojaqej6oejh587i3k9jeu0p8';
            const attributes = 'all';

            const url = `https://api.skybiometry.com/fc/faces/detect.json?api_key=${apiKey}&api_secret=${apiSecret}&urls=${imageUrl}&attributes=${attributes}`;

            const response = await fetch(url, {
                method: 'POST'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const data = await response.json();
            console.log(data);

            return data;
        
            // if (data.status === 'success') {
            //     return data.photos[0].tags; // this will be an array of detected faces
            // } else {
            //     throw new Error(data.error_message);
            // }
        }

        const aiResponse = await sendMessageToAI(userMessage);
        const faceDetectorResponse = await faceDetector(imageUrl);

        res.json({ aiResponse, urnik, faceDetectorResponse });
    }
    catch (error) {
        next(error);
    }
}

module.exports = {
    main
};