import schema from "./schema";

/** The definition of the functions that can be called by the AI */
export function getFunctions(task) {
    return {
        name: (task == "definition" || task == "cloze") ? "display_keywords" : "display_quiz",
        description: (task == "definition") ? `Use this function to display the keywords and definition`
            : "Use this function to display the generated quiz",
        parameters: (task == "clozeParagraph") ? {
            "type": "object",
            "properties": {
                "result": schema[task]
            }
        } : {
            "type": "object",
            "properties": {
                "result": {
                    "type": "array",
                    "items": schema[task]
                }
            }
        }
    };
};