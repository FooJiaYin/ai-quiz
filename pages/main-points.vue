<template>
    <h2 class="mt-8 mb-4">What will you learn:</h2>
    <pre>{{ quiz.mainPoints }}</pre>
</template>

<script setup>
const quiz = useQuiz();
</script>