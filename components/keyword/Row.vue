<template>
    <div class="fixed pa-4">
        <div v-for="(keyword, index) in keywords" cols="auto" class="py-1" :key="index">
            <KeywordDraggable :keyword="keyword" :index="index" ref="draggables" />
        </div>
    </div>
</template>

<style>
.fixed {
    position: fixed;
}
</style>

<script setup>
const props = defineProps(['data']);
const draggables = ref(null);
// Shuffle the keywords
const keywords = props.data.slice().sort(() => Math.random() - 0.5);

defineExpose({ reset });

function reset() {
    draggables.value.forEach(draggable => draggable.hide(false));
}
</script>