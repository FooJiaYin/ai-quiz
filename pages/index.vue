<template>
    <h3 class="mb-4" ref="form">Input transcript</h3>
    <v-textarea label="Insert transcript here" v-model="input" variant="outlined" rows="20" clearable
        class="mb-4" :maxlength="8000" counter persistent-counter 
        :readonly="quiz.status.includes('...')"></v-textarea>
    <v-text-field label="Language" v-model="quiz.language" variant="outlined"></v-text-field>
    <CenterButton @click="generateQuiz">Generate Quiz</CenterButton>
    <StatusMessage />
</template>

<script setup>
const quiz = useQuiz();
const input = ref(quiz.transcript);
const status = ref("");
const statusColor = (message) => 
    message === "Completed!" ? "text-success" :
    message.includes("Error") ? "text-error" :
    "black";

async function generateQuiz() {
    await quiz.generateQuiz(input.value);
}
</script>