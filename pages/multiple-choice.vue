<template>
    <div v-for="(q, index) in quiz['MC']" class="my-16">
        <div class="mb-4">{{ index + 1 }}. {{ q.question }}
            <Difficulty :level="q.difficulty" />
        </div>
        <MultipleChoiceOptions :q="q" :id="index" ref="options" />
    </div>
    <v-row justify="center">
        <v-btn color="primary" class="ma-4" @click="reset">Try Again</v-btn>
        <v-btn color="primary" class="ma-4">Edit with Prompt
            <EditDialog title="Prompt" v-model="quiz.MCPrompt" @save="quiz.regenerateTask(['MCPrompt'])" />
        </v-btn>
    </v-row>
    <StatusMessage />
</template>

<script setup>
const quiz = useQuiz();
const h3 = ref(null);
const options = ref(null);

function reset() {
    options.value.forEach(option => option.reset());
}
</script>