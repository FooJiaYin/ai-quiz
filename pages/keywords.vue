<template>
    <v-container>
        <v-row class="my-6">
            <v-col v-for="({ keyword }, index) in quiz['definition']" cols="auto">
                <div class="text-align-center bg-primary rounded-lg px-4 py-2" draggable="true"
                    @dragstart="draggedText = keyword">
                    {{ keyword }}
                </div>
            </v-col>
        </v-row>
        <v-row v-for="({ keyword, definition }, index) in quiz['definition']">
            <v-col cols="4">
                <TextBlank :answer="keyword" :draggedText="draggedText" ref="blanks" />
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
const value = ref({});
const draggedText = ref("");

function reset() {
    for (let i = 0; i < quiz['definition'].length; i++) {
        blanks.value[i].reset();
    }
}
</script>