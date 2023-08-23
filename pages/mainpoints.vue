<template>
    <h2 class="mt-8 mb-4">What will you learn:</h2>
    <div>
        <Markdown :src="quiz.mainpoints"></Markdown>
        <v-row justify="center">
            <v-btn color="primary" class="ma-4">Edit
                <EditDialog title="Edit mainpoints" v-model="quiz.mainpoints" @save="quiz.regenerateTask(['MC'])" />
            </v-btn>
            <v-btn color="primary" class="ma-4">Prompt
                <EditDialog title="Prompt" v-model="quiz.mainpointsPrompt" @save="quiz.generateQuiz()" />
            </v-btn>
        </v-row>
    </div>
</template>

<style>
li {
    margin-bottom: 1em;
}
</style>

<script setup>
const quiz = useQuiz();
</script>