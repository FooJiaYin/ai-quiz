import { defineStore, acceptHMRUpdate } from 'pinia';

export const useQuiz = defineStore('quiz', {
	state: () => {
		return {
			status: '',
			transcript: '',
			mainpoints: '',
			MC: []
		};
	},
	actions: {
		// since we rely on `this`, we cannot use an arrow function
		async generateQuiz(input, language) {
			this.transcript = input;
			this['MC'] = [];
			this.mainpoints = [];
			this.status = 'Loading...';
			try {
				let res = await $fetch('/api/quiz', {
					method: 'POST', body: {
						input, language, task: 'mainpoints'
					}
				});
				this.mainpoints = res.mainpoints;
				res = await $fetch('/api/quiz', {
					method: 'POST', body: {
						input: res.msg, language, task: 'MC'
					}
				});
				this['MC'] = res;
				this.status = 'Completed!';
			} catch (error) {
				console.error(error);
				this.status = 'Error';
			}
		},
	},
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useQuiz, import.meta.hot));
}