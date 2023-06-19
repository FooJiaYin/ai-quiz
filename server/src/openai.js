import { Configuration, OpenAIApi } from "openai";
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
        const response = {
            response: completion.data.choices[0].message.content,
            usage: completion.data.usage
        };
        return response;
    } catch (e) {
        console.error(e);
        return { error: e };
    }
}

export default openai;