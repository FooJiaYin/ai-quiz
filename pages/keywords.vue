<template>
    <v-row>
        <v-col>
            <v-container>
                <v-row v-for="({ keyword, definition, difficulty }, index) in quiz['definition']">
                    <v-col cols="auto">
                        <KeywordBlank :answer="keyword" ref="blanks" />
                    </v-col>
                    <v-col>
                        <p>{{ definition }}
                            <Difficulty :level="difficulty" />
                        </p>
                    </v-col>
                </v-row>
                <CenterButton class="mt-10" @click="reset">Try Again</CenterButton>
            </v-container>
        </v-col>
        <v-col cols="1">
            <KeywordRow :data="quiz['definition'].map(({ keyword }) => keyword)" ref="keywords" />
        </v-col>
    </v-row>
</template>

<script setup>
const quiz = useQuiz();
const blanks = ref(null);
const keywords = ref(null);

function reset() {
    blanks.value.forEach(blank => blank.reset());
    keywords.value.reset();
}
</script>