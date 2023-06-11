// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { defineNuxtPlugin } from "nuxt/app";

const theme = {
    dark: false,
    colors: {
        background: '#121212',
        surface: '#FFFFFF',
        primary: '#3F51B5',
        'primary-darken-1': '#303F9F',
        secondary: '#03DAC6',
        'secondary-darken-1': '#018786',
        error: '#F44336',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00',
    },
};

export default defineNuxtPlugin((nuxtApp) => {
    const vuetify = createVuetify({
        ssr: true,
        treeShake: true,
        theme: {
            // defaultTheme: 'dark',
            defaultTheme: 'theme',
            themes: {
                theme,
            }
        }
    });

    nuxtApp.vueApp.use(vuetify);
});