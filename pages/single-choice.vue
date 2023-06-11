<template>
    <div v-for="(q, index) in quiz.questions">
        <h3>{{ q.question }}</h3>
        <SingleChoiceOptions :q="q" :id="index" />
    </div>
</template>

<script setup>
const quiz = useQuiz();
</script>