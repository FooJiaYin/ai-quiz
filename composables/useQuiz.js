import { defineStore, acceptHMRUpdate } from 'pinia';

const tasks = [
	'mainpoints', 
	'MC',
	'TF', 
	'keywords', 
	'definition', 
	// 'cloze'
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
			cloze: [
				{'question': '___是咖啡的原材料，从咖啡树上结出来的小果子，经过烘焙和研磨后制成咖啡。', 'answer': '咖啡豆'},
				{'question': '___是一种高质量的咖啡豆，与罗布斯塔相比更优质，口感更高级。', 'answer': '阿拉比卡'},
				{'question': '___是一种咖啡豆，含有较高的咖啡因，适合制作浓郁的咖啡。', 'answer': '罗布斯塔'},
				{'question': '___是将咖啡豆加热处理，使其水分蒸发、油份释放，颜色变深，味道更浓郁。', 'answer': '烘焙'},
				{'question': '___的咖啡豆颜色较浅，味道带有草本的酸涩感。', 'answer': '轻度烘焙'},
				{'question': '___的咖啡豆颜色较深，味道更丰富，焦糖化程度适中。', 'answer': '中度烘焙'},
				{'question': '___的咖啡豆颜色深黑发亮，味道浓郁，油份较多。', 'answer': '重度烘焙'},
				{'question': '重度烘焙的咖啡豆含有较多的___，使咖啡口感更丰富和滑润。', 'answer': '油份'}
			]
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