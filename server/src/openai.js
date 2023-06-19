import { Configuration, OpenAIApi } from "openai";
import { functions } from "./functions";
import defaultParams from "./config";

const runtimeConfig = useRuntimeConfig();
const { openaiApiKey, openaiOrgId } = runtimeConfig;


const configuration = new Configuration({
    organization: openaiOrgId,
    apiKey: openaiApiKey,
});

const openai = new OpenAIApi(configuration);

/**
 * A wrapper around the OpenAI API
 * @param {string} prompt - The prompt to send to the API
 * @param {array} messages - An array of messages to send to the API, in the format [{role: "user", content: "Hello"}, {role: "AI", content: "Hi"}]
 * If no messages are provided, the prompt will be sent as a message
 * @param {object} request - Any other properties to send to the API, use the defaultConfig from config.js if not specified
 * Please refer to the [OpenAI API documentation](https://beta.openai.com/docs/api-reference/create-completion) for more information
 * @returns {object} - The response from the API, in the format {content: "Hello", usage: 0.123, function_call: {name: "getUserInfo", arguments: {}}, messages}
 */
export async function getResponse({
    prompt = "",
    messages = [],
    ...request
}) {
    if (prompt.length > 0) {
        messages.push({ role: "user", content: prompt });
    }
    try {
        const completion = await openai.createChatCompletion({
            ...defaultParams,
            ...request,
            messages: messages,
        });
        const message = completion.data.choices[0].message;
        let response = {
            content: message.content,
            usage: completion.data.usage,
            messages: [...messages, message],
        };

        if (message.function_call) {
            try {
                response["function_call"] = {
                    ...message.function_call,
                    arguments: JSON.parse(message.function_call.arguments),
                };
                response = await handleFunctionCall(response, request);
            } catch (e) {
                return {
                    error: "Error parsing function call arguments",
                    ...response,
                };
            }
        }
        return response;
    } catch (e) {
        console.error(e);
        return { error: e };
    }
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
        response = await getResponse({
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