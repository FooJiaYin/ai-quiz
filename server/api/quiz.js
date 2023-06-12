import { generateQuiz } from "../src/generateQuiz";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { input, language, task } = body;
    const response = await generateQuiz(input, language, task);
    return response;
});