import { defineStore, acceptHMRUpdate } from 'pinia';

const tasks = [
	'mainpoints', 
	'MC',
	'TF', 
	'keywords', 
	'definition', 
	'cloze'
];

export const useQuiz = defineStore('quiz', {
	state: () => {
		return {
			status: '',
			transcript: '',
			mainpoints: '',
			MC: [],
			TF: [],
			keywords: '',
			definition: [],
			cloze: []
		};
	},
	actions: {
		// since we rely on `this`, we cannot use an arrow function
		async generateQuiz(input, language) {
			if (this.status === 'Loading...') return;
			this.status = 'Loading...';
			this.transcript = input;
			this['MC'] = [];
			this.mainpoints = [];
			this.messages = [];
			for (let task of tasks) {
				this[task] = [];
			}
			try {
				for (let task of tasks) {
					let res = await $fetch('/api/quiz', {
						method: 'POST', body: {
							input: task === 'mainpoints' || task === "keywords" ? input : this.messages,
							language, task
						}
					});
					if (task === 'mainpoints' || task === "keywords") {
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