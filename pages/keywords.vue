<template>
    <v-container>
        <DraggableKeywords :data="quiz['definition'].map(({ keyword }) => keyword)" ref="keywords" />
        <v-row v-for="({ keyword, definition }, index) in quiz['definition']">
            <v-col cols="4">
                <TextBlank :answer="keyword" ref="blanks" />
            </v-col>
            <v-col>
                <p>{{ definition }}</p>
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
    for (let i = 0; i < quiz['definition'].length; i++) {
        blanks.value[i].reset();
    }
    keywords.value.reset();
}
</script>