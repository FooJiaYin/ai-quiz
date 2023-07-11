<template>
    <h2 class="mt-8 mb-4">SOP</h2>
    <ol>
        <li v-for="step in quiz.SOP" :key="step">{{ step }}</li>
    </ol>
</template>

<style>
li {
    margin-bottom: 1em;
}
</style>

<script setup>
const quiz = useQuiz();
</script>