<template>
    <v-container>
        <v-row v-for="({keyword, definition}, index) in quiz['definition']">
            <v-col cols="4">
                <v-text-field variant="outlined" :value="keyword" ref="blanks" ></v-text-field>
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

function reset() {
    for (let i = 0; i < quiz['definition'].length; i++) {
        blanks.value[i].reset();
    }
}
</script>