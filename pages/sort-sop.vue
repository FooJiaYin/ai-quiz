<template>
    <h2 class="mt-8 mb-4">Sort the steps below by dragging:</h2>
    <draggable v-model="shuffledSOP" handle=".drag-item">
        <template #item="{ element, index }">
            <v-card :class="['d-flex align-center mb-3 pa-3', state[index]]">
                {{ element }}
            </v-card>
        </template>
    </draggable>
    <div class="d-flex mt-8">
        <v-btn color="primary" class="ml-auto mr-10" @click="submit">Submit</v-btn>
        <v-btn color="primary" class="mr-auto" @click="reset">
            Try Again
        </v-btn>
    </div>
</template>

<style>
li {
    margin-bottom: 1em;
}

.drag-item:hover {
    cursor: move;
    background-color: #eee;
}
</style>

<script setup>
import draggable from "vuedraggable";

const quiz = useQuiz();
// Copy quiz.SOP and shuffle it
const shuffledSOP = ref(quiz.SOP.slice().sort(() => Math.random() - 0.5));
const state = ref(Array(quiz.SOP.length).fill("drag-item"));

function submit() {
    // Compare the shuffledSOP with the original quiz.SOP
    for (let i = 0; i < quiz.SOP.length; i++) {
        if (shuffledSOP.value[i] === quiz.SOP[i]) {
            state.value[i] = "text-success";
        } else {
            state.value[i] = "text-error";
        }
    }
}

function reset() {
    // Reset the state
    state.value.fill("drag-item");
    // Shuffle the SOP again
    shuffledSOP.value.sort(() => Math.random() - 0.5);
}
</script>