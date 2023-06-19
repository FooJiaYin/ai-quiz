import { getResponse } from "./openai";
import { mainpointsPrompt, QGPrompt } from "./prompt.js";
import { getFunctions } from "./functions.js";

export async function generateQuiz(input, language = "en-us", task) {
    if (input.length > 1500) {
        input = input.slice(0, 1500);
    }

    if (task === "mainpoints") {
        return await getMainpoints(input, language);
    } else {
        const response = await getQuestions(input, language, task);
        const res = processQuestions(response, task);
        return res;
    }
}

async function getMainpoints(input, language = "en-us") {
    // Get main points
    let req = mainpointsPrompt(language, input);
    let msg = [{ "role": "system", "content": req }];
    let res = await getResponse({
        messages: msg,
        max_tokens: 256,
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