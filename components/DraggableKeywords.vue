
<template>
    <v-row class="my-6">
        <v-col v-for="(keyword, index) in keywords" cols="auto" class="py-1" :key="index">
            <Draggable :keyword="keyword" ref="draggables" />
        </v-col>
    </v-row>
</template>

<script setup>
const props = defineProps(['data']);
const draggables = ref(null);
// Shuffle the keywords
const keywords = props.data.sort(() => Math.random() - 0.5);

defineExpose({ reset });

function reset() {
    for (let i = 0; i < keywords.length; i++) {
        draggables.value[i].hide(false);
    }
}
</script>