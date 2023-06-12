<template>
    <h3 class="mb-4" ref="form">Input transcript</h3>
    <v-textarea label="Insert transcript here" v-model="input" variant="outlined" rows="20" clearable></v-textarea>
    <v-text-field label="Language" v-model="language" variant="outlined"></v-text-field>
    <CenterButton @click="generateQuiz">Generate Quiz</CenterButton>
    <p :class="`mt-3 text-center `+statusColor">{{ quiz.status }}</p>
</template>

<script setup>
const quiz = useQuiz();
const input = ref(quiz.transcript);
const language = ref("");
const status = ref("");
const statusColor = computed(() =>
    quiz.status === "Completed!" ? "text-success" : 
    quiz.status === "Error" ? "text-error" : 
    "black"
);

async function generateQuiz() {
    await quiz.generateQuiz(input.value, language.value);
}
</script>