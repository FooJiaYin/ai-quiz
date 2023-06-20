<template>
    <v-container>
        <DraggableKeywords ref="keywords" />
        <v-row v-for="({ question, answer }, index) in quiz['cloze']">
            <v-col cols="4">
                <TextBlank :answer="answer" ref="blanks" />
            </v-col>
            <v-col>
                <p>{{ question }}</p>
            </v-col>
        </v-row>
        <CenterButton class="mt-10" @click="reset">Try Again</CenterButton>
    </v-container>
</template>

<script setup>
const quiz = useQuiz();
const blanks = ref(null);
const keywords = ref(null);

function reset() {
    for (let i = 0; i < quiz['cloze'].length; i++) {
        blanks.value[i].reset();
    }
    keywords.value.reset();
}
</script>