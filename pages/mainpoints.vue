<template>
    <h2 class="mt-8 mb-4">What will you learn:</h2>
    <div>
        <Markdown :src="quiz.mainpoints"></Markdown>
        <v-row justify="center">
            <v-btn color="primary" class="ma-4">Edit Manually
                <EditDialog title="Edit mainpoints" v-model="quiz.mainpoints" @save="quiz.regenerateTask(['mainpoints', 'MC'])" />
            </v-btn>
            <v-btn color="primary" class="ma-4">Edit with Prompt
                <EditDialog title="Prompt" v-model="quiz.mainpointsPrompt" @save="quiz.regenerateTask(['mainpointsPrompt', 'MC'])" />
            </v-btn>
        </v-row>
    </div>
    <StatusMessage />
</template>

<style>
li {
    margin-bottom: 1em;
}
</style>

<script setup>
const quiz = useQuiz();
</script>