import { generateQuiz } from "../src/generateQuiz";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { input, language } = body;
    const response = await generateQuiz(input, language);
    return response;
});