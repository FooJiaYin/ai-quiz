<template>
    <EditDialog title="Enter selected text" v-model="selectedText">
        <v-row class="justify-center">
            <v-select class="flex-fill" 
                label="Select quiz topic" 
                v-model="quiz.quizTopic"
                :items="[{ title: 'Any', value: '' }, ...quiz.quizTopics]" />
            <QuizTypeSelector v-model="quizTypes" />
            <v-btn color="primary" @click="generate()">Generate Quiz</v-btn>
        </v-row>
    </EditDialog>
</template>

<script setup>
const quiz = useQuiz();
const selectedText = ref("");
const quizTypes = ref(['MC', 'TF']);

async function generate() {
    for (const type of quizTypes.value) {
        await quiz.generateQuestions(selectedText.value, 10, 'Selection', type);
    }
}
</script>