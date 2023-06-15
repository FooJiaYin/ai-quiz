import { Configuration, OpenAIApi } from "openai";
import defaultConfig from "./config";

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
    ...props
}) {
    if (prompt.length > 0) {
        messages.push({ role: "user", content: prompt });
    }
    try {
        const completion = await openai.createChatCompletion({
            ...defaultConfig,
            ...props,
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