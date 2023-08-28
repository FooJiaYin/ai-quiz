import { defineStore, acceptHMRUpdate } from 'pinia';

const tasks = [
	'mainpoints',
	'MC',
	// 'TF',
	// 'keywords',
	// 'definition',
	// 'cloze',
	// 'clozeParagraph',
	// 'SOP',
	// 'diagram'
];

export const useQuiz = defineStore('quiz', {
	state: () => {
		return {
			status: '',
			errors: [],
			transcript: '',
			mainpoints: '',
			MC: [],
			TF: [],
			keywords: '',
			definition: [],
			cloze: [],
			clozeParagraph: {},
			SOP: [],
			diagram: "",
			language: 'en-us',
			mainpointsPrompt: '',
			MCPrompt: '',
		};
	},
	actions: {
		async regenerateTask(tasks) {
			if (tasks.includes('mainpoints')) {
				this.messages.mainpoints[1].content = this.mainpoints;
				tasks = tasks.filter(task => task !== 'mainpoints');
			}
			this.generateQuiz(this.transcript, this.language, tasks);
		},

		// TODO: Retry failed requests
		// since we rely on `this`, we cannot use an arrow function
		async generateQuiz(transcript, language = this.language, selectedTask = []) {
			// Prevent resending requests while generating quiz
			if (this.status.includes('...')) return;
			this.status = 'Loading...';
			this.errors = [];

			// Retry failed requests only if the input is the same
			if (selectedTask.length === 0) {
				if (transcript == this.transcript && language == this.language) {
					selectedTask = selectedTask.filter(task => this[task].length === 0);
				} else {
					selectedTask = [...tasks];
					this.messages = {};
				}
			}

			this.transcript = transcript;
			this.language = language;
			for (const task of selectedTask) {
				if (!task.includes('Prompt')) {
					this[task] = [];
				}
			}

			for (let task of selectedTask) {
				this.status = `Generating ${task}...`;

				let input = transcript;
				try {
					// Pre-process messages
					if (task.includes('Prompt')) {
						input = this.messages[task.split('Prompt')[0]].slice();
						input.push({
							role: 'user',
							content: this[task] + "\nRevised output:\n"
						});
					}

					if (task === 'MC' || task === 'TF') {
						input = this.messages.mainpoints;
						if (input == undefined) throw new Error('Main points not generated');
					}
					if (task === 'cloze' || task === 'definition' || task === "clozeParagraph") {
						input = this.messages.keywords;
						if (input == undefined) throw new Error('Keywords not generated');
					}

					if (task === "diagram") {
						input = this.messages.SOP[1].content;
					}

					// Send request
					const res = await $fetch('/api/quiz', {
						method: 'POST', body: { input, language, task }
					});

					// Save messages for later tasks
					this.messages[task] = res.msg;

					if (task.includes('Prompt')) {
						task = task.split('Prompt')[0];
						this.messages[task][this.messages[task].length - 1] = res.msg[res.msg.length - 1];
					}

					// Split cloze questions by '___' to render the inline blank
					if (task == 'cloze') {
						res.result = res.result.map(({ question, answer, difficulty }) => ({
							question: question.split('___'),
							answer, difficulty
						}));
					}

					if (task == 'clozeParagraph') {
						res.result.question = res.result.question.split('___');
					}

					this[task] = res.result;
				} catch (error) {
					let message = error.message;
					if (error.data?.message) message = error.data.message;
					message = `Error generating ${task}: ${message}`;
					this.errors.push(message);
					console.error(message);
				}
			}
			this.status = 'Completed!';
		},
	},
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useQuiz, import.meta.hot));
}