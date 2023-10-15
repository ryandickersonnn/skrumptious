const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config({ path: '.env.local' });

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(config);

module.exports = {
    runPrompt,
}
const path = require('path');


async function runPrompt (question, additional) {
    try {
        // const prompt = `
        //     ${question} Return a schedule for these assignments so that a student would know when to study for what assignment based on the due dates.

        // `;
        const prompt = `
        ${question} Return a schedule for these assignments so that a student would know when to study for what assignment based on the due dates. No ranges just one number. Give a specific time to work on each assignment and call it start date.
         Work these events in ${additional} and have the assignment be either studying or watching movie have the name be studying or watching movie and the start dates should be spread out so that they study or watch movies on several days each. Make sure the return value is a valid JSON, do not violate anything for any reason, following this form:

        Assignment: {
            "name" : "assignment name",
            "startdate": "start date"
        } OR
        Watching Movie: {
            "name" : "Watching Movie",
            "startdate": "start date"
        }
        
        `;
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 2048,
            temperature: 1,
        });

        const parsableJSONresponse = response.data.choices[0].text;
        const json = JSON.parse(parsableJSONresponse);
        console.log(json);
        // console.log(parsableJSONresponse);
        return parsableJSONresponse;
    } catch (error) {
        console.error("An error occurred:", error);
    }
};
let tester = "Assignment: HW5 Due Date: 2023-10-18 Due Time: 04:59:59 Assignment: Module 5 Individual Due Date: 2023-10-25 Due Time: 17:50:00 Assignment: Module 5 Group Due Date: 2023-10-25 Due Time: 17:50:00 Assignment: Homework 3 Due Date: 2023-10-26 Due Time: 04:59:59 Assignment: Reaction Paper #2 Due Date: 2023-11-02 Due Time: 22:00:00 Assignment: Written Homework 4 Due Date: 2023-11-04 Due Time: 04:59:59 Assignment: Implementation Project 4: Neural Networks Due Date: 2023-11-04 Due Time: 04:59:59 Assignment: Module 6 Individual Due Date: 2023-11-06 Due Time: 18:50:00 Assignment: Module 6 Group Due Date: 2023-11-06 Due Time: 18:50:00 Assignment: Quiz 8 (prog optimization / linking) Due Date: 2023-11-09 Due Time: 06:05:00 Assignment: Writing Assignment 3 Due Date: 2023-11-11 Due Time: 05:59:59 Assignment: Quiz 9 (more linking) Due Date: 2023-11-16 Due Time: 06:05:00Assignment: Quiz 10 (VM) Due Date: 2023-11-23 Due Time: 06:05:00 Assignment: Quiz 11 (ECF: Processes / Signals) Due Date: 2023-12-07 Due Time: 06:05:00 Assignment: Writing Assignment 4 Due Date: 2023-12-09 Due Time: 05:59:59";
runPrompt(tester, "I also want to spend time 10 hours throughout the next two weeks (after 2023-10-15 and spend 7 hours studying for tests");
