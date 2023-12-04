<template>
    <v-navigation-drawer permanent class="pa-5" width="500">
        <h3 class="mb-4" ref="form">Input transcript</h3>
        <v-textarea label="Insert transcript here" v-model="input" variant="outlined" rows="20" clearable class="mb-4"
            :maxlength="8000" counter persistent-counter :readonly="quiz.status.includes('...')"></v-textarea>
        <v-row>
            <v-col>
                <v-text-field label="Language of the transcript" v-model="quiz.language" variant="outlined"></v-text-field>
            </v-col>
            <v-col cols="auto">
                <QuizTypeSelector v-model="quizTypes" />
            </v-col>
        </v-row>
        <CenterButton :disabled="quiz.status.includes('...') || (input === quiz.transcript && quiz['MC'].length > 0)"
            @click="generateQuiz">Generate Quiz</CenterButton>
        <StatusMessage />
    </v-navigation-drawer>
</template>

<script setup>
const quiz = useQuiz();
const input = ref(quiz.transcript);
const quizTypes = ref(['MC', 'TF']);
const status = ref("");
const statusColor = (message) =>
    message === "Completed!" ? "text-success" :
        message.includes("Error") ? "text-error" :
            "black";

async function generateQuiz() {
    quiz["MC"] = [];
    quiz["TF"] = [];
    quiz.transcript = input.value;
    for (const type of quizTypes.value) {
        await quiz.generateQuestions(quiz.transcript, 10, type, type);
    }
}
</script>