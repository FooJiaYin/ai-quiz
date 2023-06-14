import { getResponse } from "./openai";
import { mainpoints_prompt, QG_prompt } from "./prompt.js";

export async function generateQuiz(input, language = "en-us", task) {
    if (input.length > 1500) {
        input = input.slice(0, 1500);
    }
    
    if (task === "mainpoints") {
        return await getMainPoints(input, language);
    } else {
        const response = await getQuestions(input, language, task);
        return processQuestions(response)
    }
}

async function getMainPoints(input, language = "en-us") {
    // Get main points
    let req = mainpoints_prompt(language, input);
    let msg = [{ "role": "system", "content": req }];
    let res = await getResponse({
        messages: msg,
        temperature: 0.0,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
    });
    const mainPoints = res.response;
    msg.push({ "role": "assistant", "content": mainPoints });
    return { mainPoints, msg };
}

async function getQuestions(input, language = "en-us", task = "MC") {
    // Get questions
    let msg = input;
    const req = QG_prompt(language);
    msg.push({ "role": "user", "content": req });
    const res = await getResponse({
        messages: msg,
        temperature: 0.0,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
    });
    return res.response;
}

function processQuestions(questions) {
    try {
        questions = JSON.parse(questions);
        let result = [];
        for (let q of questions) {
            let options = q.slice(1);
            let answer = options[0];
            // Shuffle options
            options = options.sort(() => Math.random() - 0.5);
            result.push({
                "question": q[0],
                "options": options,
                "answerId": options.indexOf(answer)
            });
        }
        return result;
    } catch (error) {
        // Handle the error
        console.error('Error parsing JSON:', error.message);
        console.error(questions);
    }
}