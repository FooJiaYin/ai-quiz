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
      },
      "difficulty": {
        "type": "string",
        "description": "the difficulty of the question in english, must be one of Easy, Medium, Hard",
      },
    },
    "required": ["question", "options", "answer", "difficulty"]
  },
  "TF": {
    "type": "object",
    "properties": {
      "true_statement": {
        "type": "string"
      },
      "false_statement": {
        "type": "string"
      },
      "difficulty": {
        "type": "string",
        "description": "the difficulty to distinguish the true and false statement in english, must be one of Easy, Medium, Hard",
      },
    },
    "required": ["true_statement", "false_statement", "difficulty"],
  },
  "definition": {
    "type": "object",
    "properties": {
      "keyword": {
        "type": "string"
      },
      "definition": {
        "type": "string",
        "description": "the definition of the keyword without the keyword itself"
      },
      "difficulty": {
        "type": "string",
        "description": "the difficulty to match the keyword and definition in english, must be one of Easy, Medium, Hard",
      },
    },
    "required": ["keyword", "definition", "difficulty"]
  },
  "cloze": {
    "type": "object",
    "properties": {
      "keyword": {
        "type": "string",
      },
      "sentence": {
        "type": "string",
        "description": "summary sentence that contain the keyword",
      },
      "difficulty": {
        "type": "string",
        "description": "the difficulty to match the keyword and sentence in english, must be one of Easy, Medium, Hard",
      },
    },
    "required": ["keyword", "sentence", "difficulty"]
  },
  "clozeParagraph": {
    "type": "object",
    "properties": {
      "paragraph": {
        "type": "string"
      },
      "keywords": {
        "type": "array",
        "items": {
          "type": "string"
        }
      }
    },
    "required": ["paragraph", "keywords"]
  }
};