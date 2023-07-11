<template>
    <h2 class="mt-8 mb-4">Fill in the blank</h2>
    <vue-mermaid-string :value="quiz.diagram" />
    <CenterButton @click="reset">Try Again</CenterButton>
</template>

<script setup>
import VueMermaidString from "vue-mermaid-string";

const quiz = useQuiz();
</script>