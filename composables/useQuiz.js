import { defineStore, acceptHMRUpdate } from 'pinia';

const tasks = [
	'mainpoints',
	'MC',
	'TF',
	'keywords',
	'definition',
	'cloze',
	'SOP'
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
			SOP: [],
			diagram: `
	graph TD
	1["Insert tension wrench into the lock"]-->2["Turn tension wrench in likely direction"]
	2-->3["Insert rake into the lock"]
	3-->4["Push and pull the rake, twisting and working by feel"]
	4-->5["Feel for key pin to reach shear line"]
	5-->6["Twist tension wrench in correct direction to open lock"]
	1-->7["Use paper clips"]
	classDef answer fill:#fff,height:36px,stroke:#000,font-weight:bold,text-decoration:underline;
					  `
		};
	},
	actions: {
		// since we rely on `this`, we cannot use an arrow function
		async generateQuiz(transcript, language) {
			// Prevent resending requests while generating quiz
			if (this.status.includes('...')) return;
			this.status = 'Loading...';
			this.errors = [];

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
						if (input == undefined) throw new Error('Main points not generated');
					}
					if (task === 'cloze' || task === 'definition') {
						input = this.messages.keywords;
						if (input == undefined) throw new Error('Keywords not generated');
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