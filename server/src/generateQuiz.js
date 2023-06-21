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
        return await getQuestions(input, language, task);
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

    // Get prompt
    let req;
    if (task === "MC" || task === "TF") {
        req = QGPrompt(language, task);
    } else if (task === "definition") {
        req = definitionPrompt(language);
    } else if (task === "cloze") {
        req = clozePrompt(language);
    } else {
        req = clozeParagraphPrompt(language);
    }
    msg.push({ "role": "system", "content": req });

    const res = await getResponse({
        messages: msg,
        functions: [callbackFunction],
        function_call: { "name": callbackFunction["name"] },
    });

    if (task === "MC" || task === "TF") {
        return processQuestions(res.function_call.arguments.result, task);
    } else if (task === "cloze") {
        return processCloze(res.function_call.arguments.result);
    } else {
        return res.function_call.arguments;
    }
}

function processQuestions(questions, task) {
    try {
        let result = [];
        for (let q of questions) {
            if (task === "MC") {
                const { question, answer, options } = q;
                // Shuffle options
                options.sort(() => Math.random() - 0.5);
                result.push({
                    question, options,
                    "answerId": options.indexOf(answer)
                });
            } else {
                const { question, reason, answer } = q;
                result.push({
                    question, reason,
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

function processCloze(clozeList) {
    const sentenceList = []; // in lowercase
    const processedClozes = [];
    const result = [];
    for (let { keyword, sentence } of clozeList) {
        // Case insensitive match
        if (!sentence.toLowerCase().includes(keyword.toLowerCase()) && !sentence.includes("_")) continue;
        const completeSentence = sentence.replace("_", keyword).toLowerCase();

        // Replace keyword with '___' case insensitively
        const pattern = new RegExp(keyword, "gi");
        const clozeSentence = sentence.replace(pattern, "___");

        // Remove duplicate clozes
        if (!sentenceList.includes(completeSentence) && !processedClozes.includes(clozeSentence.toLowerCase())) {
            sentenceList.push(completeSentence);
            processedClozes.push(clozeSentence.toLowerCase());
            result.push({ question: clozeSentence, answer: keyword });
        }
    }
    // Shuffle result
    result.sort(() => Math.random() - 0.5);
    return { result };
}