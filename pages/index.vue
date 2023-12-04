<template>
    <div v-if="quiz['MC'].length + quiz['TF'].length > 0">
        <div v-for="(q, index) in [...quiz['MC'], ...quiz['TF']]" class="my-16">
            <div class="d-flex">
                <div>
                    <EditButton :id="q.type == 'MC' ? index : index - quiz['MC'].length" :type="q.type" />  
                    <CitationButton :data="q.inputMatch" :key="q.inputMatch" />
                </div>
                <div class="flex-fill">
                    <div class="mb-4">{{ index + 1 }}. {{ q.question }}
                        <!-- <Difficulty :level="q.difficulty" /> -->
                    </div>
                    <MultipleChoiceOptions :q="q" :id="index" ref="options" />
                    <div v-if="q.inputMatch?.start && q.inputMatch?.end">
                        {{quiz.transcript.slice(q.inputMatch.start, q.inputMatch.end)}} ({{ q.inputMatch.start }}, {{ q.inputMatch.end }})
                    </div>
                    <div v-else>
                        {{ q.context }}
                    </div>
                </div>
            </div>
        </div>
        <!-- <v-row justify="center">
            <v-btn color="primary" class="ma-4" @click="reset">Try Again</v-btn>
            <v-btn color="primary" class="ma-4">Edit with Prompt
                <EditDialog title="Prompt" v-model="quiz.MCPrompt" @save="quiz.regenerateTask(['MCPrompt'])" />
            </v-btn>
        </v-row> -->
    </div>
    <StatusMessage v-else />
</template>

<script setup>
const quiz = useQuiz();
const h3 = ref(null);
const options = ref(null);

function reset() {
    options.value.forEach(option => option.reset());
}
</script>