<template>
    <v-row>
        <v-col>
            <v-container>
                <KeywordCloze :q="quiz['clozeParagraph']" class="my-5" ref="clozes" />
                <CenterButton class="mt-10" @click="reset">Try Again</CenterButton>
            </v-container>
        </v-col>
        <v-col cols="1">
            <KeywordRow :data="quiz['clozeParagraph'].answers" ref="keywords" />
        </v-col>
    </v-row>
</template>

<script setup>
const quiz = useQuiz();
const clozes = ref(null);
const keywords = ref(null);

function reset() {
    clozes.value.reset();
    keywords.value.reset();
}
</script>