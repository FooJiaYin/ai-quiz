// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { defineNuxtPlugin } from "nuxt/app";

export default defineNuxtPlugin((nuxtApp) => {
    const vuetify = createVuetify({
        ssr: true,
        treeShake: true,
    });

    nuxtApp.vueApp.use(vuetify);
});