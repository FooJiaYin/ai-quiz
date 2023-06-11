import { Configuration, OpenAIApi } from "openai";

const runtimeConfig = useRuntimeConfig();
const { openaiApiKey, openaiOrgId } = runtimeConfig;


const configuration = new Configuration({
    organization: openaiOrgId,
    apiKey: openaiApiKey,
});

const openai = new OpenAIApi(configuration);

export async function getResponse({
    prompt = "say hello",
    model = "gpt-3.5-turbo",
    ...props
}) {
    console.log(props)
    const completion = await openai.createChatCompletion({
        ...props,
        model: model,
        messages: props.messages || [{ role: "user", content: prompt }],
    });
    const response = {
        response: completion.data.choices[0].message.content,
        usage: completion.data.usage
    }
    return response
}

export default openai;