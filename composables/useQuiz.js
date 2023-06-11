import { defineStore } from 'pinia';

export const useQuiz = defineStore('quiz', {
	state: () => {
		return {
			transcript: '',
			questions: [],
			mainPoints: [],
		};
	},
	actions: {
		// since we rely on `this`, we cannot use an arrow function
		async generateQuiz(input, language) {
			this.transcript = input;
			try {
				const res = await $fetch('/api/quiz', {
					method: 'POST', body: {
						input, language
					}
				});
				this.questions = res.questions;
				this.mainPoints = res.mainPoints;
			} catch (error) {
				console.error(error);
			}
		},
	},
});