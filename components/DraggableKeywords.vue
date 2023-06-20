
<template>
    <v-row class="my-6">
        <v-col v-for="(keyword, index) in shuffledKeywords" cols="auto" class="py-1" :key="index">
            <Draggable :keyword="keyword" ref="draggables" />
        </v-col>
    </v-row>
</template>

<script setup>
const quiz = useQuiz();
const drag = useDrag();
const draggables = ref(null);
// Shuffle the keywords
const shuffledKeywords = quiz['definition'].map(({keyword}) => keyword ).sort(() => Math.random() - 0.5);

defineExpose({ reset });

function reset() {
    for (let i = 0; i < quiz['definition'].length; i++) {
        draggables.value[i].hide(false);
    }
}
</script>