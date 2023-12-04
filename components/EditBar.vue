<template>
    <v-app-bar v-if="quiz['MC'].length + quiz['TF'].length > 0 && !quiz.status.includes('...')" 
        color="primary" location="bottom">
        <v-spacer></v-spacer>
        <v-menu open-on-hover open-delay="0" close-delay="0">
            <template v-slot:activator="{ props }">
                <v-btn variant="outlined" v-bind="props">Regenerate</v-btn>
            </template>
            <v-list v-on:click:select="regenerateQuiz($event.id)">
                <v-list-subheader>Regenerate ...</v-list-subheader>
                <v-list-item :value="['MC', 'TF']" title="All questions" />
                <v-list-item :value="['MC']" title="Multiple Choice questions" />
                <v-list-item :value="['TF']" title="True/False questions" />
            </v-list>
        </v-menu>
        <v-btn variant="outlined">Selection
            <SelectionDialog />
        </v-btn>
        <v-menu open-on-hover :close-on-content-click="false" open-delay="0" close-delay="0" v-model="isTopicMenuActive">
            <template v-slot:activator="{ props }">
                <v-btn variant="outlined" v-bind="props">Add Question</v-btn>
            </template>
            <v-list>
                <QuizTypeSelector v-model="quizTypes" />
                <QuizTopicMenu @select="addQuestions" />
            </v-list>
        </v-menu>
    </v-app-bar>
    <v-progress-linear v-if="quiz.status.includes('...')" indeterminate color="primary" position-y="bottom" />
</template>

<style scoped>
.v-btn {
    margin: 0 0.5rem;
}
</style>

<script setup>
const quiz = useQuiz();
const topicMenu = ref(null);
const quizTypes = ref(['MC', 'TF']);
const isTopicMenuActive = ref(false);

async function regenerateQuiz(types) {
    for (const type of types) {
        quiz.quizTopic = "";
        await quiz.generateQuestions(quiz.transcript, 10, type, type);
    }
}

async function addQuestions() {
    for (const type of quizTypes.value) {
        await quiz.generateQuestions(quiz.transcript, '', 'Add', type);
    }
    isTopicMenuActive.value = false;
}
</script>