<template>
    <v-row>
        <v-col>
            <v-container>
                <ol>
                    <li v-for="q in quiz['cloze']">
                        <KeywordCloze :q="q" class="my-5" ref="clozes" />
                        <Difficulty :level="q.difficulty" />
                    </li>
                </ol>
                <CenterButton class="mt-10" @click="reset">Try Again</CenterButton>
            </v-container>
        </v-col>
        <v-col cols="1">
            <KeywordRow :data="quiz['cloze'].map(({ answer }) => answer)" ref="keywords" />
        </v-col>
    </v-row>
</template>

<script setup>
const quiz = useQuiz();
const clozes = ref(null);
const keywords = ref(null);

function reset() {
    clozes.value.forEach(cloze => cloze.reset());
    keywords.value.reset();
}
</script>