import { defineStore, acceptHMRUpdate } from 'pinia';

const tasks = ['mainpoints', 'MC', 'TF'];

export const useQuiz = defineStore('quiz', {
	state: () => {
		return {
			status: '',
			transcript: '',
			mainpoints: '',
			MC: [],
			TF: []
		};
	},
	actions: {
		// since we rely on `this`, we cannot use an arrow function
		async generateQuiz(input, language) {
			this.transcript = input;
			this['MC'] = [];
			this.mainpoints = [];
			this.messages = [];
			for (let task of tasks) {
				this[task] = [];
			}
			this.status = 'Loading...';
			try {
				for (let task of tasks) {
					let res = await $fetch('/api/quiz', {
						method: 'POST', body: {
							input: task === 'mainpoints' ? input : this.messages,
							language, task
						}
					});
					if (task == 'mainpoints') {
						this.messages = res.msg;
					}
					this[task] = res.result;
				}
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