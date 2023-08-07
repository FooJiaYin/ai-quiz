<template>
    <KeywordBlank v-for="(part, i) in q.question" :text="part" :answer="q.answer ?? q.answers[i]"
        @update="(val) => value=val" :clozeValue="q.answer ? value : ''" 
        :hideBlank="i == q.question.length - 1" :key="i" ref="blanks" />
</template>

<script setup>
const props = defineProps(['q']);
const blanks = ref(null);
const value = ref("");
defineExpose({ reset });

function reset() {
    for (let i = 0; i < props.q.question.length; i++) {
        value.value = "";
    }
}
</script>
