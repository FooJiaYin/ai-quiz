import { defineStore, acceptHMRUpdate } from 'pinia';

export const useDrag = defineStore('drag', {
	state: () => {
		return {
			text: '',
			hide: null
		};
	},
	actions: {
		set(text, hide) {
			this.text = text;
			this.hide = hide;
		}
	}
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useDrag, import.meta.hot));
}