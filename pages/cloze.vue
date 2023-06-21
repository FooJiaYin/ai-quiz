<template>
    <v-row>
        <v-col>
            <v-container>
                <v-row v-for="({ question, answer }, index) in quiz['cloze']">
                    <v-col cols="3">
                        <TextBlank :answer="answer" ref="blanks" />
                    </v-col>
                    <v-col>
                        <p>{{ question }}</p>
                    </v-col>
                </v-row>
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