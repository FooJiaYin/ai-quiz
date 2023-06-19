import { Configuration, OpenAIApi } from "openai";
import defaultParams from "./config";

const runtimeConfig = useRuntimeConfig();
const { openaiApiKey, openaiOrgId } = runtimeConfig;


const configuration = new Configuration({
    organization: openaiOrgId,
    apiKey: openaiApiKey,
});

const openai = new OpenAIApi(configuration);

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