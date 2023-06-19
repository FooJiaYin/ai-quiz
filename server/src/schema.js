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
          "description": "4 answer candidates for the question, do not contain prefix"
        }
      },
      "answer": {
        "type": "string",
        "description": "the correct answer, must be one of the options",
      }
    },
    "required": ["question", "options", "answer"]
  },
  "TF": {
    "type": "object",
    "properties": {
      "question": {
        "type": "string"
      },
      "answer": {
        "type": "string",
        "enum": ["True", "False"]
      },
      "reason": {
        "type": "string"
      }
    },
    "required": ["question", "answer"],
    "if": {
      "properties": {
        "answer": { "const": "False" }
      }
    },
    "then": {
      "required": ["reason"]
    }
  }
};