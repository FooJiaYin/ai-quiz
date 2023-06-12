import { defineStore, acceptHMRUpdate } from 'pinia';

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
			this.questions = [];
			this.mainPoints = [];
			try {
				let res = await $fetch('/api/quiz', {
					method: 'POST', body: {
						input, language, task: 'mainpoints'
					}
				});
				this.mainPoints = res.mainPoints;
				res = await $fetch('/api/quiz', {
					method: 'POST', body: {
						input: res.msg, language, task: 'MC'
					}
				});
				this.questions = res;
			} catch (error) {
				console.error(error);
			}
		},
	},
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useQuiz, import.meta.hot));
}