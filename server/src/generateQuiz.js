import { getFunctions } from "./functions.js";
import { getOpenAIResponse } from "./openai";
import defaultParams from "./config.js";
import { processCloze, processClozeParagraph, processDefinition, processDiagram, processQuestions, processSOP } from "./postprocess.js";
import { MCPrompt, QGPrompt, TFPrompt, clozeParagraphPrompt, clozePrompt, definitionPrompt, diagramPrompt, editPrompt, keywordsPrompt, mainpointsPrompt, sopPrompt } from "./prompt.js";

/**
 * Generate a quiz from a passage for given task
 * @param {string | [{role, content}]} input: prompt (string) or messages [{role, content}]
 * @param {string} language 
 * @param {string} task: "MC", "TF", "cloze", "definition", "mainpoints" or "keywords" 
 */
export async function generateQuiz({ type, task, ...props }) {
    // if (["mainpoints", "keywords", "SOP", "diagram", "mainpointsPrompt"].includes(task)) {
    //     return await extractContext(input, language, task);
    // } else {
    //     return await getQuestions(input, language, task);
    // }
    if (task == "MC" || task == "TF") {
        const { input, language, n, topic } = props;
        return await generateQuestions(type, input, language, n, topic);
    } else {
        const { msg, input, topic } = props;
        return await editQuestion(type, msg, input, task, topic);
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
    let msg = (prompt && [{ "role": "user", "content": prompt }]) ?? input;
    let res = await getOpenAIResponse({
        messages: msg ?? input,
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
// async function getQuestions(input, language = "en-us", task = "MC") {
//     // Get questions
//     let msg = input;
//     const callbackFunction = getFunctions(task.split("Prompt")[0]);

//     // Get prompt
//     let prompt;
//     if (task === "MC") {
//         msg = [];
//         prompt = MCPrompt(language, input, 10);
//     } else if (task === "MC" || task === "TF") {
//         prompt = QGPrompt(language, task);
//     } else if (task === "definition") {
//         prompt = definitionPrompt(language);
//     } else if (task === "cloze") {
//         prompt = clozePrompt(language);
//     } else if (task === "clozeParagraph") {
//         prompt = clozeParagraphPrompt(language);
//     }
//     if (prompt) msg.push({ "role": "system", "content": prompt });

//     const res = await getOpenAIResponse({
//         messages: msg,
//         functions: [callbackFunction],
//         function_call: { "name": callbackFunction["name"] },
//     });

//     try {
//         let result;
//         if (task.includes("MC") || task === "TF") {
//             result = processQuestions(res.function_call.arguments.result, task);
//         } else if (task === "definition") {
//             result = processDefinition(res.function_call.arguments.result);
//         } else if (task === "cloze") {
//             result = processCloze(res.function_call.arguments.result);
//         } else if (task === "clozeParagraph") {
//             result = processClozeParagraph(res.function_call.arguments.result);
//         }
//         msg.push({ "role": "assistant", "content": JSON.stringify(result.result) });
//         return { ...result, msg };
//     } catch (error) {
//         error.message = `Error processing response result: ${error.message}`;
//         throw error;
//     }
// }

async function generateQuestions(type, input, language = "en-us", n, topic) {
    // const prompt = MCPrompt(language, input, n, topic);
    let prompt = "";
    if (type == "MC") {
        prompt = MCPrompt(language, input, n, topic);
    } else if (type == "TF") {
        prompt = TFPrompt(language, input, n, topic);
    }
    const msg = [{ "role": "system", "content": prompt }];
    console.log(msg);

    return await getQuestions(type, msg, input, "gpt-3.5-turbo-16k");
}

async function editQuestion(type, msg, input, task, topic) {
    msg[0].content.replace("10 different", "1");
    const prompt = editPrompt(task, topic, task == "Selection" ? input : "");
    msg.push({ "role": "user", "content": prompt });
    console.log(msg);

    return await getQuestions(type, msg, input, "gpt-3.5-turbo-16k");
}

async function getQuestions(type, msg, input, model = defaultParams.model) {
    const callbackFunction = getFunctions(type);
    const res = await getOpenAIResponse({
        model: model,
        messages: msg,
        tools: [{
            type: "function",
            function: callbackFunction,
        }],
        tool_choice: { type: "function", function: { name: callbackFunction["name"] } }
    });

    try {
        let result = processQuestions(res.function_call.arguments.result, type, input);
        msg.push({ "role": "assistant", "content": JSON.stringify(result.result) });
        // console.log(result.result)
        return { ...result, msg };
    } catch (error) {
        error.message = `Error processing response result: ${error.message}`;
        throw error;
    }
}