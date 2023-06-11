// https://v3.nuxtjs.org/api/configuration/nuxt.config
import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
	devtools: { enabled: true },
	build: {
		transpile: ['vuetify'],
	},
	modules: [
		'@pinia/nuxt',
		async (options, nuxt) => {
			nuxt.hooks.hook('vite:extendConfig', config => config.plugins.push(
				vuetify()
			))
		},
	],
	runtimeConfig: {
		// The private keys which are only available within server-side
		openaiApiKey: process.env.OPENAI_API_KEY,
		openaiOrgId: process.env.OPENAI_ORG_ID,
		// Keys within public, will be also exposed to the client-side
		public: {
			// apiBase: '/api'
		}
	}
})
