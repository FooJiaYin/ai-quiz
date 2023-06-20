<template>
    <h2 class="mt-8 mb-4">What will you learn:</h2>
    <Markdown :src="quiz.mainpoints"></Markdown>
</template>

<style>
li {
    margin-bottom: 1em;
}
</style>

<script setup>
const quiz = useQuiz();
</script>