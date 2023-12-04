<template>
    <div class="mr-4 mb-4">
        <v-menu open-on-hover open-delay="0" close-delay="0">
            <template v-slot:activator="{ props }">
                <v-btn color="primary" variant="outlined" v-bind="props">Edit</v-btn>
            </template>
            <v-list v-on:click:select="quiz.editQuestion(id, $event.id, type)">
                <v-list-item title="Regenerate question" :value="type == 'MC' ? 'Ask differently' : 'Regenerate'" />
                <!-- <v-list-item title="Enhance" value="Enhance" />
                <v-list-item title="Expand" value="Expand" />
                <v-list-item title="Shorten" value="Shorten" /> -->
                <v-menu location="end" open-on-hover open-delay="0" close-delay="0">
                    <template v-slot:activator="{ props }">
                        <v-list-item v-bind="props" title="Ask about ..." value="Topic" />
                    </template>
                    <QuizTopicMenu @select="quiz.editQuestion(id, 'Topic', type)" />
                </v-menu>
                <v-list-item v-if="type == 'MC'" title="Regenerate options" value="Regenerate options" />
                <v-list-item v-if="type == 'TF'" :title="`Use ${['True', 'False'][1 - quiz.TF[id].answerId]} statement`" value="Switch" />
                <!-- <v-list-item title="Delete" class="text-error" value="Delete" /> -->
                <!-- <v-list-item title="Why <-> How" value="Why <-> How" />
                <v-list-item title="Before <-> After" value="Before <-> After" /> -->
            </v-list>
        </v-menu>
    </div>
</template>

<script setup>
const quiz = useQuiz();
const { id, type } = defineProps(['id', 'type']);
</script>