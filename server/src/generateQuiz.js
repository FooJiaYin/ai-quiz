import { getOpenAIResponse } from "./openai";
import { mainpointsPrompt, QGPrompt, keywordsPrompt, definitionPrompt, clozeParagraphPrompt, clozePrompt } from "./prompt.js";
import { getFunctions } from "./functions.js";
import XRegExp from "xregexp";

const wordBoundary = "[\\p{Katakana}\\p{Bopomofo}\\p{Hiragana}\\p{Han}\\p{Hangul}\\p{Khmer}\\p{Lao}\\p{Myanmar}\\p{Ogham}\\p{Thai}\\p{Tibetan}\\p{Punctuation}]|\\b|^|$" 

/**
 * Generate a quiz from a passage for given task
 * @param {string | [{role, content}]} input: prompt (string) or messages [{role, content}]
 * @param {string} language 
 * @param {string} task: "MC", "TF", "cloze", "definition", "mainpoints" or "keywords" 
 */
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

/**
 * Extract main points or keywords from a passage with OpenAI API
 * @param {string} input: passage
 * @param {string} language 
 * @param {string} task: "mainpoints" or "keywords"
 */
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
    let res = await getOpenAIResponse({
        model: "gpt-3.5-turbo",
        messages: msg,
        max_tokens,
        presence_penalty,
    });
    const result = res.content;
    msg.push({ "role": "assistant", "content": result });
    return { result, msg };
}

/**
 * Get response from OpenAI API and process the response
 * @param {[{role, content}]} input: messages 
 * @param {string} language 
 * @param {string} task: "MC", "TF", "cloze" or "definition"
 */
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

    const res = await getOpenAIResponse({
        messages: msg,
        functions: [callbackFunction],
        function_call: { "name": callbackFunction["name"] },
    });

    try {
        if (task === "MC" || task === "TF") {
            return processQuestions(res.function_call.arguments.result, task);
        } else if (task === "cloze") {
            return processCloze(res.function_call.arguments.result);
        } else {
            return processDefinition(res.function_call.arguments.result);
        }
    } catch (error) {
        error.message = `Error processing response result: ${error.message}`;
        throw error;
    }
}

/**
 * Shuffle options and insert answerId
 * @param {[{question, answer, ...}]} questions 
 * @param {string} task 
 */
function processQuestions(questions, task) {
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
            const { true_statement, false_statement } = q;
            // randomly select true or false, then output {"statement": "string", "answer": "string, True or false"}
            const question = Math.random() < 0.5 ? true_statement : false_statement;
            result.push({
                question,
                "options": ["True", "False"],
                "answerId": question === true_statement ? 0 : 1,
                "reason": true_statement
            });
        }
    }
    return { result };
}

/**
 * Remove keywords from definitions
 * @param {[{keyword, definition}]} definitions
 */
function processDefinition(definitions) {
    const result = [];
    for (let { keyword, definition } of definitions) {
        // Match whole word case insensitively
        const pattern = XRegExp(`(${wordBoundary})${keyword}(${wordBoundary})`, "gi");
        // Remove keyword from definition
        definition = definition.replace(pattern, "$1$2");
        result.push({ keyword, definition });
    }
    return { result };
}

/** 
 * Post-process cloze questions
 * 1. Remove duplicate sentences
 * 2. Remove keywords with unified blank format
 * @param {[{keyword, sentence}]} clozeList 
 */
function processCloze(clozeList) {
    const sentenceList = []; // in lowercase
    const processedClozes = [];
    const result = [];
    for (let { keyword, sentence } of clozeList) {
        // Case insensitive match
        if (!sentence.toLowerCase().includes(keyword.toLowerCase()) && !sentence.includes("_")) continue;
        const completeSentence = sentence.replace("_", keyword).toLowerCase();

        // Replace keyword with '___' case insensitively
        // \b: word boundary: match the keyword as a whole word
        const pattern = XRegExp(`(${wordBoundary})${keyword}`, "gi");
        const clozeSentence = sentence.replace(pattern, "$1___");

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