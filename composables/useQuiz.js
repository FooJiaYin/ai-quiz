import { defineStore } from 'pinia';

export const useQuiz = defineStore('quiz', {
  state: () => {
    return {
      transcript: '',
      response: '',
      questions: [
        { question: "1+1=?", options: ["1", "2", "3", "4"], answerId: 1 },
        { question: "1+2=?", options: ["1", "2", "3", "4"], answerId: 2 }],
      mainPoints: [],
    };
  },
});