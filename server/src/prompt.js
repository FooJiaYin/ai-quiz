import schema from "./schema.js";

const quizDescription = {
    "MC": "the quiz includes one question and 4 answer candidates for each main point above, \
            The first candidate must be the correct answer.",
    "TF": "the quiz includes one True or False question for each main point above,\
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

export function keywordsPrompt(language, passage) {
    return `
        '''${passage}'''

        give special and difficult terms in this passage which is highly specific to the topic
        output in language ${language} without explanation
        These keywords must be things or concepts that are indispensable to the understanding of the meaning of this text,
        rather than simply a noun or an action.
        these keywords must appear in the text so we can find out the word directly from the input text instead of synonyms
        must use language ${language}, use the format: word, word, word
    `;
}

export function definitionPrompt(language) {
    return `
        give me the definition of the keywords above based on the contextual meaning in the original text rather than the general meaning
        Must not include the keyword in the definition
        Use language: ${language}
    `;
}

export function clozeParagraphPrompt(language) {
    return `
        with all keywords above, write a short summary paragraph that uses all the keywords. Mark the keyword used with <>. use language ${language}
    `;
}

export function clozePrompt(language) {
    return `
        with each keyword above, write a summary sentence that contains the keyword. Use language: ${language}
    `;
}