
<template>
    <v-row class="my-6">
        <v-col v-for="(keyword, index) in shuffledKeywords" cols="auto" class="py-1" :key="index">
            <div class="text-align-center bg-primary rounded-lg px-4 py-2" 
                draggable="true" @dragstart="drag.set(keyword)">
                {{ keyword }}
            </div>
        </v-col>
    </v-row>
</template>

<script setup>
const quiz = useQuiz();
const drag = useDrag();
// Shuffle the keywords
const shuffledKeywords = quiz['definition'].map(({keyword}) => keyword ).sort(() => Math.random() - 0.5);
</script>