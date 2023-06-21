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
			for (const task of tasks) {
				this[task] = [];
			}
			try {
				for (const task of tasks) {
					const res = await $fetch('/api/quiz', {
						method: 'POST', body: {
							input: task === 'mainpoints' || task === "keywords" ? input : this.messages,
							language, task
						}
					});
					if (task === 'mainpoints' || task === "keywords") {
						this.messages = res.msg;
					}
					if (task == 'cloze') {
						res.result = res.result.map(({ question, answer }) => ({
							question: question.split('___'),
							answer
						}));
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