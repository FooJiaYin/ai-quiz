<template>
    <h3 class="mb-4" ref="form">Input transcript</h3>
    <v-textarea label="Insert transcript here" v-model="input" variant="outlined" rows="20" clearable
        :readonly="quiz.status.includes('...')"></v-textarea>
    <v-text-field label="Language" v-model="language" variant="outlined"></v-text-field>
    <CenterButton @click="generateQuiz">Generate Quiz</CenterButton>
    <div class="mt-3 text-center">
        <p v-for="message in [...quiz.errors, quiz.status]" :class="statusColor(message)">
            {{ message }}
        </p>
    </div>
</template>

<script setup>
const quiz = useQuiz();
const input = ref(quiz.transcript);
const language = ref("");
const status = ref("");
const statusColor = (message) => 
    message === "Completed!" ? "text-success" :
    message.includes("Error") ? "text-error" :
    "black";

async function generateQuiz() {
    await quiz.generateQuiz(input.value, language.value == "" ? "en-us" : language.value);
}
</script>