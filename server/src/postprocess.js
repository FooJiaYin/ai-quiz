import XRegExp from "xregexp";

const wordBoundary = "[\\p{Katakana}\\p{Bopomofo}\\p{Hiragana}\\p{Han}\\p{Hangul}\\p{Khmer}\\p{Lao}\\p{Myanmar}\\p{Ogham}\\p{Thai}\\p{Tibetan}\\p{Punctuation}]|\\b|^|$";

/**
 * Shuffle options and insert answerId
 * @param {[{question, answer, ...}]} questions 
 * @param {string} task 
 */
export function processQuestions(questions, task) {
    let result = [];
    for (let q of questions) {
        if (task.includes("MC")) {
            const { question, answer, options, difficulty } = q;
            // Shuffle options
            options.sort(() => Math.random() - 0.5);
            result.push({
                question, options, difficulty,
                "answerId": options.indexOf(answer)
            });
        } else {
            const { true_statement, false_statement, difficulty } = q;
            // randomly select true or false, then output {"statement": "string", "answer": "string, True or false"}
            const question = Math.random() < 0.5 ? true_statement : false_statement;
            result.push({
                question, difficulty,
                "options": ["True", "False"],
                "answerId": question === true_statement ? 0 : 1,
                "reason": true_statement
            });
        }
    }
    return { result };
}

/**
 * Remove keywords from definitions
 * @param {[{keyword, definition}]} definitions
 */
export function processDefinition(definitions) {
    const result = [];
    for (let { keyword, definition, difficulty } of definitions) {
        // Match whole word case insensitively
        const pattern = XRegExp(`(${wordBoundary})${keyword}(${wordBoundary})`, "gi");
        // Remove keyword from definition
        definition = definition.replace(pattern, "$1$2");
        result.push({ keyword, definition, difficulty });
    }
    return { result };
}

/** 
 * Post-process cloze questions
 * 1. Remove duplicate sentences
 * 2. Remove keywords with unified blank format
 * @param {[{keyword, sentence}]} clozeList 
 * @example
 * input = [{keyword: "keyword", sentence: "sentence"}, {keyword: "keyword", sentence: "sentence"}]
 * processCloze(input) // {result: [{question: "sentence", answer: "keyword"}]}
 */
export function processCloze(clozeList) {
    const sentenceList = []; // in lowercase
    const processedClozes = [];
    const result = [];
    for (let { keyword, sentence, difficulty } of clozeList) {
        // Case insensitive match
        if (!sentence.toLowerCase().includes(keyword.toLowerCase()) && !sentence.includes("_")) continue;
        const completeSentence = sentence.replace("_", keyword).toLowerCase();

        // Replace keyword with '___' case insensitively
        // \b: word boundary: match the keyword as a whole word
        const pattern = XRegExp(`(${wordBoundary})${keyword}`, "gi");
        const clozeSentence = sentence.replace(pattern, "$1___");

        // Remove duplicate clozes
        if (!sentenceList.includes(completeSentence) && !processedClozes.includes(clozeSentence.toLowerCase())) {
            sentenceList.push(completeSentence);
            processedClozes.push(clozeSentence.toLowerCase());
            result.push({ question: clozeSentence, answer: keyword, difficulty });
        }
    }
    // Shuffle result
    result.sort(() => Math.random() - 0.5);
    return { result };
}

/**
 * Post-process cloze paragraph
 * 1. Replace keywords with '___'
 * 2. Sort keywords by position
 * @param {keywords, paragraph} 
 * @example
 * input = {keywords: ["keyword2", "keyword1", "keyword3"], paragraph: "sentence1 keyword1 sentence2 keyword2 sentence3"}
 * processClozeParagraph(input) 
 * // {result: {question: "sentence1 ___ sentence2 ___ sentence3", answers: ["keyword1", "keyword2"]}} 
 */
export function processClozeParagraph({ keywords, paragraph }) {
    let answers = [];
    let answersPosition = [];
    console.log(keywords)
    for (let keyword of keywords) {
        // Replace only the first occurrence
        const pattern = new RegExp(keyword, "i");
        // search for the first occurrence of keyword
        const index = paragraph.search(pattern);
        if (index == -1) continue;
        answers.push(keyword);
        answersPosition.push(index);
        paragraph = paragraph.replace(pattern, `___`);
        // paragraph = paragraph.replace(pattern, `___(${keyword})`);
        paragraph = paragraph.replace(/<|>/g, "");
    }
    // Sort answers by position
    answers = answers.sort((a, b) => answersPosition[answers.indexOf(a)] - answersPosition[answers.indexOf(b)]);
    return { result: { question: paragraph, answers } };
}

/**
 * Post-process SOP (convert markdown list to array)
 * @param {string} sop 
 * @returns 
 * @example 
 * input = "<start>\n1.  first line\n2.second line\n3. third line\n<EOF>" 
 * processSOP(input) // {result: ["first line", "second line", "third line"]}
 */
export function processSOP(sop) {
    const regex = /^\d+\.\s*(.*)/gm;
    const matches = sop.matchAll(regex);
    const result = Array.from(matches, (match) => match[1].trim());
    return result;
}

/**
 * 1. Randomly select some steps
 * 2. Replace selected steps with `___(index)___`
 * @param {string} diagram 
 * @example
 * input = "```mermaid\ngraph TD\nA[Christmas] -->|Get money| B(Go shopping)\nB --> C{Let me think}\nC -->|One| D[Laptop]\nC -->|Two| E[iPhone]\nC -->|Three| F[Car]\n```"
 * processDiagram(input) 
 * // {question: "```mermaid\ngraph TD\n["___(1)___"]:::blank -->|Get money| ["___(2)___"]:::blank\n["___(2)___"]:::blank --> ["___(3)___"]:::blank{Let me think}\n["___(3)___"]:::blank -->|One| ["___(4)___"]:::blank[Laptop]\n["___(3)___"]:::blank -->|Two| ["___(5)___"]:::blank[iPhone]\n["___(3)___"]:::blank -->|Three| ["___(6)___"]:::blank[Car]\n```", answers: ["A", "B", "C", "D", "E", "F"]}
 */
export function processDiagram(diagram) {
    // ```mermaid{mermaidCode}```
    let mermaidCode = diagram.match(/```mermaid([\s\S]*?)```/)[1].trim();
    // ["{step}"]
    const steps = mermaidCode.match(/\[([\s\S]*?)\]/g);
    // Random select some steps
    const numSelected = Math.ceil(Math.random() * steps.length / 2);
    let selectedSteps = [];
    for (let i = 0; i < numSelected; i++) {
        const index = Math.floor(Math.random() * steps.length);
        if (!selectedSteps.includes(index)) selectedSteps.push(index);
    }
    selectedSteps.sort((a, b) => a - b);
    // Replace selected steps with ___(index)___
    for (let i = 0; i < selectedSteps.length; i++) {
        const step = steps[selectedSteps[i]];
        mermaidCode = mermaidCode.replace(step, `["___(${i + 1})___"]:::blank`);
        selectedSteps[i] = step.replace(/[\["''"\]]/g, "");
    }
    return { question: mermaidCode, answers: selectedSteps };
}