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
        const location = req.body.location;


        async function sendMessageToAI(userMessage) {
            const messages = [
                {
                    role: "system",
                    content: "You are a helpful assistant. Based on my profile, decide what should I do right now from this array ['play video games', 'go for a short walk']. ONLY RESPOND WITH THE STRING IN THE ARRAY AND NOTHING ELSE!"
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


        async function getNearbyLocations(location) {
            const newLocation = location;
            newLocation.lat += ((Math.random() * 2) - 1) * 0.01;
            newLocation.lon += ((Math.random() * 2) - 1) * 0.01;

            const apiKey = 'PfqxxmxYJI7jSv825k5xwLYetdp1q3mL';
  
            const url = `https://api.tomtom.com/search/2/nearbySearch/.json?key=${apiKey}&lat=${parseFloat(newLocation.lat)}&lon=${parseFloat(newLocation.lon)}`;
            const response = await fetch(url, {
                method: 'GET'
            });
            const data = await response.json();
            return data;
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
            const formattedResponse = formatResponse(data);

            return formattedResponse;

            // if (data.status === 'success') {
            //     return data.photos[0].tags; // this will be an array of detected faces
            // } else {
            //     throw new Error(data.error_message);
            // }
        }

        function formatResponse(response) {
            const face = response.photos[0].tags[0];
            const attributes = face.attributes;

            if (attributes.face.value === 'false') {
                return 'No face detected.';
            }

            const text = `I am ${attributes.age_est.value} years old and I am ${attributes.gender.value}. I am feeling ${attributes.mood.value} and I am feeling ${attributes.liveness.value ? 'lively' : 'not lively'}.`;

            return text;
        }

        async function currentWeather(location) {
            const apiKey = 'c6cfe84fb9d39e1858a6ea4c98817489';

            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}&units=metric`;

            console.log("url: " . url);
            const response = await fetch(url, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            return data;
        }

        const nearbyLocations = await getNearbyLocations(location);
        const weather = await currentWeather(location);
        const faceDetectorResponse = await faceDetector(imageUrl);
        const aiResponse = await sendMessageToAI(faceDetectorResponse);

        res.json({ aiResponse, urnik, faceDetectorResponse, nearbyLocations, weather });
    }
    catch (error) {
        next(error);
    }
}

module.exports = {
    main
};