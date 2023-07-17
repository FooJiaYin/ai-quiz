<template>
    <h2 class="mt-8 mb-4">Fill in the blank</h2>
    <vue-mermaid-string :value="diagram" />
    <div v-for="(answer, i) in quiz.diagram.answers" class="mb-5">
        <div class="d-flex">
            {{ i + 1 }}.
            <input variant="outlined" v-model="answers[i]" />
            <!-- TODO: Add difficulty level -->
        </div>
        <p class="text-center text-success" v-if="showAnswers">{{ answer }}</p>
    </div>
    <CenterButton @click="showAnswers = true">Check Answers</CenterButton>
</template>

<style scoped>
input {
    padding: 5px !important;
    flex-grow: 1;
    margin-left: 8px;
    min-height: 1em;
    border: 1px solid #ccc;
    border-radius: 5px;
}
</style>

<script setup>
import VueMermaidString from "vue-mermaid-string";

const quiz = useQuiz();
const blankStyle = "classDef blank fill:#fff,height:36px,stroke:#000,font-weight:bold,text-decoration:underline;"
const diagram = ref(quiz.diagram.question + "\n" + blankStyle);
const answers = ref(Array(quiz.diagram.answers.length).fill(""));
const showAnswers = ref(false);
</script>