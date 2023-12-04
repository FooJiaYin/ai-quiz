<template>
    <div class="mr-4">
        <v-btn color="primary" variant="outlined" v-bind="props">Source
            <!-- Citation Dialog -->
            <v-dialog v-model="isOpen" activator="parent" width="80%">
                <v-card>
                    <v-card-text>
                        <pre>{{ before }}<span class="text-highlight">{{ citation }}</span>{{ after }}</pre>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-btn>
    </div>
</template>

<script setup>
const quiz = useQuiz();
const { data } = defineProps(['data']);
const isOpen = ref(false);

// const before = "..." + quiz.transcript.slice(Math.max(data.start - 1000, 0), data.start);
const before = quiz.transcript.slice(0, data.start);
const citation = quiz.transcript.slice(data.start, data.end);
// const after = quiz.transcript.slice(data.end, Math.min(data.end + 1000, quiz.transcript.length)) + "...";
const after = quiz.transcript.slice(data.end, quiz.transcript.length);
</script>

<style scoped>
pre {
    white-space: pre-wrap;
}

.text-highlight {
    background-color: yellow;
}
</style>