<template>
    <v-row>
        <v-col>
            <v-container>
                <ol>
                    <li v-for="({ question, answer }, index) in quiz['cloze']" class="my-5">
                        <!-- TODO: Do not hide keywords for multiple blanks in 1 question -->
                        <TextBlank v-for="(part, i) in question" :text="part" :answer="answer"
                            :hideBlank="i == question.length - 1" :key="i" />
                    </li>
                </ol>
                <CenterButton class="mt-10" @click="reset">Try Again</CenterButton>
            </v-container>
        </v-col>
        <v-col cols="1">
            <DraggableKeywords :data="quiz['cloze'].map(({ answer }) => answer)" ref="keywords" />
        </v-col>
    </v-row>
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