import { generateQuiz } from "../src/generateQuiz";

// TODO: Add OpenAPI documentation
export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    try {
        const response = await generateQuiz(body);
        return response;
    } catch (error) {
        throw error
    }
});