<template>
    <div v-for="(q, index) in quiz['MC']" class="my-16">
        <div class="mb-4">{{ index + 1 }}. {{ q.question }}</div>
        <MultipleChoiceOptions :q="q" :id="index" ref="options" />
    </div>
    <CenterButton @click="reset">Try Again</CenterButton>
</template>

<script setup>
const quiz = useQuiz();
const h3 = ref(null);
const options = ref(null);

function reset() {
    for (let i = 0; i < quiz['MC'].length; i++) {
        options.value[i].reset();
    }
}
</script>