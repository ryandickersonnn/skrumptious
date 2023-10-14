const { Configuration, OpenAIApi } = require("openai");

const config = new Configuration({
	apiKey: "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",
});

const openai = new OpenAIApi(config);

let data = "";
for(let i = 0; i < events.length(); i++){
    data += envents[i];
}



const runPrompt = async () => {
	const prompt = `
        write me a joke about a cat and a bowl of pasta. Return response in the following parsable JSON format:

        {
            "Q": "question",
            "A": "answer"
        }

    `;

	const response = await openai.createCompletion({
		model: "text-davinci-003",
		prompt: prompt,
		max_tokens: 2048,
		temperature: 1,
	});

	const parsableJSONresponse = response.data.choices[0].text;
	const parsedResponse = JSON.parse(parsableJSONresponse);

	console.log("Question: ", parsedResponse.Q);
	console.log("Answer: ", parsedResponse.A);
};

runPrompt();