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
			// Prevent resending requests while generating quiz
			if (this.status.includes('...')) return;
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
			for (const task of selectedTask) {
				this.status = `Generating ${task}...`;

				let input = transcript;
				try {
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
				} catch (error) {
					let message = error.message;
					if (error.data?.message) message = error.data.message;
					this.status = `Error generating ${task}: ${message}`;
					console.error(this.status);
					throw error;
				}
			}
			this.status = 'Completed!';
		},
	},
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useQuiz, import.meta.hot));
}