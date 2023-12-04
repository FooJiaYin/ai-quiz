<template>
    <!-- run onSelected on selected -->
    <v-list v-on:click:select="onSelected($event.id)">
        <v-list-subheader>Please select ...</v-list-subheader>
        <v-list-item v-if="props.any == false" value="" title="any">
            <v-list-item-title>Any</v-list-item-title>
        </v-list-item>
        <v-list-item v-for="(option, index) in quiz.quizTopics" :key="index" :title="option" :value="option" />
    </v-list>
</template>

<script setup>
const quiz = useQuiz();
const props = defineProps(['any']);
const emit = defineEmits(['select']);

function onSelected(value) {
    quiz.quizTopic = value;
    emit('select', value);
}
</script>