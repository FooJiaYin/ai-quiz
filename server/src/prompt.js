import schema from "./schema.js";

const quizDescription = {
    "MC": "the quiz includes one question and 4 answer candidates for each main point above, \
            The first candidate must be the correct answer.",
    "TF": "the quiz includes one Tue or False question for each main point above,\
            Then showing the correct answer after each question \
            If the answer is False, showing the reason after the correct answer"
};

export function QGPrompt(language, task) {
    return `
        give me a quiz for this passage in language:${language} 
        ${quizDescription[task]}
    `;
}

export function mainpointsPrompt(language, passage, n) {
    return `
        '''${passage}'''

        list ${n ?? ''} main points in this passage in language: ${language} 
    `;
}