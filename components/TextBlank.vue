<template>
    <v-text-field variant="outlined" v-model="value"
        @drop="value = draggedText" @dragover.prevent>
    </v-text-field>
</template>

<script setup>
const props = defineProps(['answer', 'draggedText']);
const value = ref("");
defineExpose({ reset });

function reset() {
    value.value = "";
}

</script>