import { generateQuiz } from "../src/generateQuiz";

// TODO: Add OpenAPI documentation
export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { input, language, task } = body;

    try {
        const response = await generateQuiz(input, language, task);
        return response;
    } catch (error) {
        throw error
    }
});