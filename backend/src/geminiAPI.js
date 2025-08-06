// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { gemini_text } from './constant.js';
// const genAI = new GoogleGenerativeAI(process.env.API_KEY);
// console.log(process.env.API_KEY)
// async function run(prompt) {
//     try {
//         const model = genAI.getGenerativeModel({ model: gemini_text});
//         const result = await model.generateContent(prompt);
//         const response = await result.response;
//         const text = await response.text();  // Await the Promise from response.text()
//         return text;
//     } catch (error) {
//         // console.error("Error generating content:", error);
//         throw error;  // Optionally rethrow the error
//     }
// }
// export { run };
import OpenAI from 'openai';
// import { hf_model } from './constant.js'; // You can define the model name here

const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: process.env.API_KEY, // Use environment variable instead of hardcoded key
});

async function run(prompt) {
    try {
        const chatCompletion = await client.chat.completions.create({
            model: 'openai/gpt-oss-120b:novita', // pulled from constant.js
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        return chatCompletion.choices[0].message.content;
    } catch (error) {
        // Optionally log the error
        console.error("Error generating content:", error);
        throw error;
    }
}

export { run };

