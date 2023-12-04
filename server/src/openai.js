import OpenAI from "openai";
// import { functions } from "./functions";
import defaultParams from "./config";

const runtimeConfig = useRuntimeConfig();
const { openaiApiKey, openaiOrgId } = runtimeConfig;


const configuration = {
    organization: openaiOrgId,
    apiKey: openaiApiKey,
}

const openai = new OpenAI(configuration);

/**
 * A wrapper around the OpenAI API
 * @param {string} prompt - The prompt to send to the API
 * @param {array} messages - An array of messages to send to the API, in the format [{role: "user", content: "Hello"}, {role: "AI", content: "Hi"}]
 * If no messages are provided, the prompt will be sent as a message
 * @param {object} request - Any other properties to send to the API, use the defaultConfig from config.js if not specified
 * Please refer to the [OpenAI API documentation](https://beta.openai.com/docs/api-reference/create-completion) for more information
 * @returns {object} - The response from the API, in the format {content: "Hello", usage: 0.123, function_call: {name: "getUserInfo", arguments: {}}, messages}
 */
export async function getOpenAIResponse({
    prompt = "",
    messages = [],
    ...request
}) {
    if (prompt.length > 0) {
        messages.push({ role: "user", content: prompt });
    }
    let completion;
    try {
        console.log({ ...defaultParams, ...request, messages: messages }.model)
        console.log(messages)
        completion = await openai.chat.completions.create({
            ...defaultParams,
            ...request,
            messages: messages,
        });
    } catch (error) {
        error.message = `Error getting response from OpenAI API: ${error.message}`;
        throw error;
    }

    const message = completion.choices[0].message;
    let response = {
        content: message.content,
        usage: completion.usage,
        messages: [...messages, message],
    };

    console.log(message)

    if (message.tool_calls[0].function) {
        const function_call = message.tool_calls[0].function;
        try {
            response["function_call"] = {
                ...function_call,
                arguments: JSON.parse(function_call.arguments),
            };
            // response = await handleFunctionCall(response, request);
        } catch (error) {
            error.message = `Error parsing function call arguments: ${error.message}. The response length may exceeds the max_tokens.
            
${function_call.arguments}`;
            error.arguments = function_call.arguments;
            throw error;
        }
    }
    return response;
}

/** Recursively handle function calls in the response */
async function handleFunctionCall(response, request) {
    const args = response.function_call.arguments;
    const name = response.function_call.name;

    let result;
    // Call the function if it is a server-side function
    if (name in functions && functions[name].function)
        result = functions[name].function(args);
    if (result instanceof Promise) result = await result;

    // If the function will callback, send the result to OpenAI API
    if (functions[name].willCallback) {
        const messages = [
            ...response.messages,
            { role: "function", "content": JSON.stringify(result), "name": response.function_call.name }
        ];
        response = await getOpenAIResponse({
            ...request,
            prompt: "",
            messages: messages,
        });
        if (response.function_call) {
            return await handleFunctionCall(response, request);
        }
    }
    return response;
}

export default openai;