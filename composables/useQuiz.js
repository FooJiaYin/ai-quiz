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
		async generateQuiz(transcript, language) {
			if (this.status === 'Loading...') return;
			this.status = 'Loading...';

			// Retry failed requests only if the input is the same
			let selectedTask = [...tasks];
			if (transcript == this.transcript && language == this.language) {
				selectedTask = selectedTask.filter(task => this[task].length === 0);
			} else {
				this.messages = {};
			}

			this.transcript = transcript;
			this.language = language;
			for (const task of selectedTask) {
				this[task] = [];
			}
			try {
				for (const task of selectedTask) {
					let input = transcript;
					if (task === 'MC' || task === 'TF') {
						input = this.messages.mainpoints;
					}
					if (task === 'cloze' || task === 'definition') {
						input = this.messages.keywords;
					}

					const res = await $fetch('/api/quiz', {
						method: 'POST', body: { input, language, task }
					});

					// Save messages for later tasks
					if (task === 'mainpoints' || task === "keywords") {
						this.messages[task] = res.msg;
					}
					// Split cloze questions by '___' to render the inline blank
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