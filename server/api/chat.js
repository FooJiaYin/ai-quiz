import { getResponse } from "../src/openai";

export default defineEventHandler(async (event) => {
    var body = await readBody(event);
    if (typeof body === "string") {
        body = { prompt: body };
    }
    body.prompt ??= "say hi";
    const { response } = await getResponse(body);
    return response;
});