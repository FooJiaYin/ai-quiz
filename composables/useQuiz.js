import { defineStore, acceptHMRUpdate } from 'pinia';
import { fuzzySearch } from 'levenshtein-search';

const tasks = [
	// 'mainpoints',
	'MC',
	'TF',
	// 'keywords',
	// 'definition',
	// 'cloze',
	// 'clozeParagraph',
	// 'SOP',
	// 'diagram'
];

function getNearestDist(arr) {
    if (!arr || arr.length === 0) {
        return null;
    }

    let nearestMatch = arr[0];

    for (let i = 1; i < arr.length; i++) {
        if (arr[i].dist < nearestMatch.dist) {
            nearestMatch = arr[i];
        }
    }

    return nearestMatch;
}

function reverseProcessing(q, type) {
	if (type == "MC") {
		const { question, options, difficulty, context, answerId } = q;
		return {
			question, options, difficulty, context, 
			answer: options[answerId],
		}
	} else if (type == "TF") {
		const { true_statement, false_statement, difficulty, context } = q;
		return {
			true_statement, false_statement, difficulty, context 
		}
	}
}

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
			messages: {
				MC: [],
				TF: [],
			},
			language: 'en-us',
			mainpointsPrompt: '',
			MCPrompt: '',
			quizTopic: "",
			quizTopics: [
				"numbers, time or duration",
				"tools & materials, for example: which / what is used to ...",
				"status (for example, color, shape, positions or readings, that are mentioned) of tools, materials, machine",
				"order of the procedures, for example: which should be done before ... or after ...",
				"operation details and precautions",
				"safety precautions",
				"theory & reason"
			],
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
					selectedTask = tasks.filter(task => this[task].length === 0);
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

					// if (task === 'MC' || task === 'TF') {
					// 	input = this.messages.mainpoints;
					// 	if (input == undefined) throw new Error('Main points not generated');
					// }
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

		async generateQuestions(input = this.transcript, n = "10", task = "MC", quizType = "MC") {
			console.log(n, task, quizType);
			if (this.status.includes('...')) return;
			this.status = `Generating ${quizType} Questions...`;
			// this.status = 'Loading...';
			this.errors = [];
			if (task == quizType) this[quizType] = [];

			try {
				console.log(this.messages[quizType])
				const res = await $fetch('/api/quiz', {
					method: 'POST', body: {
						input, n, task,
						type: quizType,
						msg: this.messages[quizType] ?? [],
						language: this.language,
						topic: this.quizTopic
					}
				});
				task = quizType;
				this.messages[quizType] = [];
				// console.log

				res.result.forEach((q, i) => {
					const contextCandidates = [...fuzzySearch(q.context, this.transcript, Math.min(Math.floor(q.context.length / 2), 10))];
					res.result[i].inputMatch = getNearestDist(contextCandidates);
					console.log(q.context, res.result[i].inputMatch)
				});

				this[task] = this[task].concat(res.result);
				console.log(task, this[task])
				console.log(this.messages)

				// Remove duplicate questions
				this[task] = this[task].filter(({ question }, index, self) => index === self.findIndex(
					q => q.question === question
				));
				console.log(task, this[task])

				this.messages[task] = [
					res.msg[0],
					{ role: "assistant", content: JSON.stringify(this[task].map(q => reverseProcessing(q, quizType))) }
				];

				this.status = 'Completed!';
			} catch (error) {
				this.logError(error);
			}
		},

		async selection(input = this.transcript, quizType = "MC") {
			try {
				this.messages[quizType] = [
					this.messages[quizType][0],
					{ role: "assistant", content: JSON.stringify(this[quizType].map(q => reverseProcessing(q, quizType))) }
				];
				const res = await $fetch('/api/quiz', {
					method: 'POST', body: {
						input, 
						type: quizType,
						n: "", 
						task: "selection",
						msg: this.messages[quizType] ?? [],
						language: this.language,
						topic: this.quizTopic
					}
				});
				task = quizType;
				this.messages[quizType] = [];

				this[task] = this[task].concat(res.result);

				// Remove duplicate questions
				this[task] = this[task].filter(({ question }, index, self) => index === self.findIndex(
					q => q.question === question
				));

				this.status = 'Completed!';
			} catch (error) {
				this.logError(error);
			}
		},

		async editQuestion(id, task, quizType = "MC") {
			console.log(id, task, quizType)
			// return;
			if (this.status.includes('...')) return;
			this.status = `Editing ${quizType} Questions...`;
			// this.status = 'Loading...';
			this.errors = [];
			console.log(task)

			if (task == "Switch") {
				this[quizType][id].answerId = 1 - this[quizType][id].answerId;
				if (this[quizType][id].answerId == 0) { // True
					this[quizType][id].question = this[quizType][id].true_statement;
				} else {
					this[quizType][id].question = this[quizType][id].false_statement;
				}
				this.status = 'Completed!';
				return;
			}

			let msg = [
				this.messages[quizType][0],
				{
					role: "assistant", content: JSON.stringify(
						task == "Regenerate options" || task == "Expand" ? `question: ${this[quizType][id].question}`
							: reverseProcessing(this[quizType][id], quizType)
					)
				}
			];


			try {
				const res = await $fetch('/api/quiz', {
					method: 'POST', body: {
						task, msg,
						input: this.transcript,
						type: quizType,
						topic: this.quizTopic
					}
				});
				task = quizType;

				this[task][id] = res.result[res.result.length - 1];

				this.status = 'Completed!';
			} catch (error) {
				this.logError(error);
			}
		},

		logError(error) {
			let message = error.message;
			if (error.data?.message) message = error.data.message;
			this.errors = [message];
			console.error(message);
			this.status = `Error generating question: ${message}`;
		}
	},
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useQuiz, import.meta.hot));
}