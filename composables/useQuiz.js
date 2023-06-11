import { defineStore } from 'pinia';

export const useQuiz = defineStore('quiz', {
	state: () => {
		return {
			transcript: '',
			response: '',
			questions: [],
			mainPoints: [],
		};
	},
	actions: {
		// since we rely on `this`, we cannot use an arrow function
		generateQuiz(transcript) {
			this.transcript = transcript;
			// TODO: Open AI API call, model:gpt-3.5-turbo, prompt:transcript, temperature:0.0, max_tokens:1000
			// this.response = response;
			this.questions = [
				{ question: "1+1=?", options: ["1", "2", "3", "4"], answerId: 1 },
				{ question: "1+2=?", options: ["1", "2", "3", "4"], answerId: 2 }
			];
		},
	},
});