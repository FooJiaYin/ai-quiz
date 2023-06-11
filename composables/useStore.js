import { defineStore } from 'pinia';

export const useStore = defineStore('quiz', {
    state: () => {
        return {};
    },
	actions: {
		async getOpenAIResponse(transcript) {
			try {
				const response = await $fetch('/api/chat', { 
					method: 'POST', body: JSON.stringify({ n: 2, prompt: transcript }) 
				})
				return response;
			} catch (error) {
				console.error(error);
			}
		},
	},
});