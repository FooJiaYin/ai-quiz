<template>
    <h2 class="mt-8 mb-4">What will you learn:</h2>
    <div v-if="isEditing">
        <v-textarea v-model="quiz.mainpoints" label="Main Points" variant="outlined" rows="15"></v-textarea>
        <CenterButton @click="isEditing = false; quiz.regenerateTask(['MC'])">Save
        </CenterButton>
        <p>When the "Save" button is clicked, the Multiple-choice and True/False questions will be re-generated.</p>
    </div>
    <div v-else>
        <Markdown :src="quiz.mainpoints"></Markdown>
        <CenterButton @click="isEditing = true">Edit</CenterButton>
    </div>
</template>

<style>
li {
    margin-bottom: 1em;
}
</style>

<script setup>
const quiz = useQuiz();
const isEditing = ref(false);
</script>