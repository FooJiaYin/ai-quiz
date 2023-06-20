import { getResponse } from "./openai";
import { mainpointsPrompt, QGPrompt, keywordsPrompt, definitionPrompt, clozeParagraphPrompt, clozePrompt } from "./prompt.js";
import { getFunctions } from "./functions.js";

export async function generateQuiz(input, language = "en-us", task) {
    if (input.length > 1500) {
        input = input.slice(0, 1500);
    }

    if (task === "mainpoints" || task === "keywords") {
        return await extractContext(input, language, task);
    } else {
        const response = await getQuestions(input, language, task);
        const res = processQuestions(response, task);
        return res;
    }
}

async function extractContext(input, language = "en-us", task) {
    // Get main points
    let prompt, max_tokens = 256, presence_penalty = 0.0;
    if (task === "mainpoints") {
        prompt = mainpointsPrompt(language, input);
    } else {
        prompt = keywordsPrompt(language, input);
        max_tokens = 100;
        presence_penalty = 1.0;
    }
    let msg = [{ "role": "system", "content": prompt }];
    let res = await getResponse({
        messages: msg,
        max_tokens,
        presence_penalty,
    });
    const result = res.content;
    msg.push({ "role": "assistant", "content": result });
    return { result, msg };
}

async function getQuestions(input, language = "en-us", task = "MC") {
    // Get questions
    let msg = input;
    const callbackFunction = getFunctions(task);
    const req = QGPrompt(language, task);
    const res = await getResponse({
        messages: msg,
        functions: [callbackFunction],
        function_call: { "name": callbackFunction["name"] },
    });
    return res.function_call.arguments.result;
}

function processQuestions(questions, task) {
    try {
        let result = [];
        for (let { question, options, answer } of questions) {
            if (task === "MC") {
                // Shuffle options
                options = options.sort(() => Math.random() - 0.5);
                result.push({
                    question,
                    "options": options,
                    "answerId": options.indexOf(answer)
                });
            } else if (task === "TF") {
                result.push({
                    question,
                    "options": ["True", "False"],
                    "answerId": answer === "True" ? 0 : 1
                });
            }
        }
        return { result };
    } catch (error) {
        // Handle the error
        console.error(questions);
        return { error: error.message };
    }
}