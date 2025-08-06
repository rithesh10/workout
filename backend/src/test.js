import  OpenAI  from "openai";

const client = new OpenAI({
	baseURL: "https://router.huggingface.co/v1",
	apiKey: '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',
});

const chatCompletion = await client.chat.completions.create({
	model: "openai/gpt-oss-120b:novita",
    messages: [
        {
            role: "user",
            content: "give me mysql format data like in dbms",
        },
    ],
});

console.log(chatCompletion.choices[0].message.content);