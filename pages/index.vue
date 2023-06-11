<template>
    <h3 class="mb-4" ref="form">Input transcript</h3>
    <v-textarea label="Insert trancript here" v-model="input" variant="outlined" auto-grow clearable></v-textarea>
    <v-text-field label="Language" v-model="language" variant="outlined"></v-text-field>
    <CenterButton @click="generateQuiz">Generate Quiz</CenterButton>
    <p>{{ status }}</p>
</template>

<script setup>
const quiz = useQuiz();
const input = ref("");
const language = ref("");
const status = ref("");

async function generateQuiz() {
    status.value = "Loading...";
    await quiz.generateQuiz(input.value, language.value);
    status.value = "Complete!";
}
</script>