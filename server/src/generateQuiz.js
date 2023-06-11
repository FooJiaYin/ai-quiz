import { getResponse } from "./openai";
import { mainpoints_prompt, QG_prompt } from "./prompt.js";

export async function generateQuiz(transcript, language = "en-us") {
    const { questions, mainPoints } = await getQuestions(transcript, language);
    return {
        questions: processQuestions(questions),
        mainPoints
    };
}

async function getQuestions(input, language = "en-us", question_type = "Main point-based (3.5-turbo)") {
    if (input.length > 1500) {
        input = input.slice(0, 1500);
    }
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

    // Get questions
    msg.push({ "role": "assistant", "content": mainPoints });
    req = QG_prompt(language);
    msg.push({ "role": "user", "content": req });
    res = await getResponse({
        messages: msg,
        temperature: 0.0,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
    });
    const questions = res.response;
    return { questions, mainPoints };
}

function processQuestions(questions) {
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
}