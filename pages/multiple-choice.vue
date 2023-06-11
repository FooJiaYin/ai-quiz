<template>
    <div v-for="(q, index) in quiz.questions">
        <h3>{{ q.question }}</h3>
        <MultipleChoiceOptions :q="q" :id="index" ref="options" />
    </div>
    <CenterButton @click="reset">Try Again</CenterButton>
</template>

<script setup>
const quiz = useQuiz();
const h3 = ref(null);
const options = ref(null);

function reset() {
    for (let i = 0; i < quiz.questions.length; i++) {
        options.value[i].reset();
    }
}
</script>