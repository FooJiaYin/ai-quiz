import { defineStore, acceptHMRUpdate } from 'pinia';

export const useDrag = defineStore('drag', {
	state: () => {
		return {
			text: '',
		};
	},
	actions: {
		set(text) {
			this.text = text;
		}
	}
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useDrag, import.meta.hot));
}