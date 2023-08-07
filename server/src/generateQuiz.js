import { getFunctions } from "./functions.js";
import { getOpenAIResponse } from "./openai";
import { processCloze, processClozeParagraph, processDefinition, processDiagram, processQuestions, processSOP } from "./postprocess.js";
import { QGPrompt, clozeParagraphPrompt, clozePrompt, definitionPrompt, diagramPrompt, keywordsPrompt, mainpointsPrompt, sopPrompt } from "./prompt.js";

/**
 * Generate a quiz from a passage for given task
 * @param {string | [{role, content}]} input: prompt (string) or messages [{role, content}]
 * @param {string} language 
 * @param {string} task: "MC", "TF", "cloze", "definition", "mainpoints" or "keywords" 
 */
export async function generateQuiz(input, language = "en-us", task) {
    if (task === "mainpoints" || task === "keywords" || task === "SOP" || task === "diagram") {
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
    let config = {};
    let prompt;
    if (task === "mainpoints") {
        prompt = mainpointsPrompt(language, input);
    } else if (task === "keywords") {
        prompt = keywordsPrompt(language, input);
        config = {
            model: "gpt-4",
            presence_penalty: 1.0,
        };
    } else if (task === "SOP") {
        prompt = sopPrompt(language, input);
        config = {
            presence_penalty: 0.2,
            temperature: 0.2,
        };
    } else if (task === "diagram") {
        prompt = diagramPrompt(language, input);
    }
    let msg = [{ "role": "user", "content": prompt }];
    let res = await getOpenAIResponse({
        messages: msg,
        ...config
    });
    let result = res.content;
    msg.push({ "role": "assistant", "content": result });
    if (task === "SOP") result = processSOP(result);
    else if (task === "diagram") result = processDiagram(result);
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
    } else if (task === "clozeParagraph") {
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
        } else if (task === "definition") {
            return processDefinition(res.function_call.arguments.result);
        } else if (task === "cloze") {
            return processCloze(res.function_call.arguments.result);
        } else if (task === "clozeParagraph") {
            return processClozeParagraph(res.function_call.arguments.result);
        }
    } catch (error) {
        error.message = `Error processing response result: ${error.message}`;
        throw error;
    }
}