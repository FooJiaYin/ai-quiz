/** NOTE: JSON schema are generated bt ChatGPT; */
export default {
  "MC": {
    "type": "object",
    "properties": {
      "question": {
        "type": "string"
      },
      "options": {
        "type": "array",
        "maxItems": 4,
        "minItems": 4,
        "items": {
          "type": "string",
          "description": "answer candidates for the question, do not contain prefix"
        }
      },
      "answer": {
        "type": "string",
        "description": "the correct answer, must be one of the options",
      }
    },
    "required": ["question", "options", "answer"]
  }
};