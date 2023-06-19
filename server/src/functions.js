import schema from "./schema";

/** The definition of the functions that can be called by the AI */
export function getFunctions(task) {
    return {
        name: (task == "keywords") ? "display_keywords" : "display_quiz",
        description: (task == "keywords") ? "Use this function to display the keywords and definitions"
            : "Use this function to display the generated quiz",
        parameters: {
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