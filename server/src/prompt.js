import schema from "./schema.js";

export function QG_prompt(language) {
    return `
        give me a quiz for this passage in language:${language} 
        the quiz includes one question and 4 answer candidates for each main point above, and these questions should be answerable with this passage instead of the external knowledge. The first candidate must be the correct answer.
        output in json format with the schema: ${schema["QG_list"]}
    `;
}

export function mainpoints_prompt(language, passage, n) {
    return `
        ${passage}

        list ${n ?? ''} main points in this passage in language: ${language} 
    `;
}