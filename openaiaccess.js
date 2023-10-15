const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config({ path: '.env.local' });

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(config);

module.exports = {
    runPrompt,
}

async function runPrompt (question) {
    try {
        // const prompt = `
        //     ${question} Return a schedule for these assignments so that a student would know when to study for what assignment based on the due dates.

        // `;
        const prompt = `
        ${question} Return a schedule for these assignments so that a student would know when to study for what assignment based on the due dates. Reccommend how long to complete each assignment assuming it takes around an hour +- 30 minutes.
         Just randomly assign a work time of one of the values 1,2, or 3 to each assignment. No ranges just one number. Give a specific time to work on each assignment and call it start date. On that day give a time of the day so start working on it and call it start time.
        
        `;
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 2048,
            temperature: 1,
        });

        const parsableJSONresponse = response.data.choices[0].text;
        // console.log(parsableJSONresponse);
        return parsableJSONresponse;
    } catch (error) {
        console.error("An error occurred:", error);
    }
};

runPrompt("Tell me a joke");
