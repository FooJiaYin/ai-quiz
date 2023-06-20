<template>
    <v-text-field variant="outlined" v-model="value"
        @drop="value = drag.text" @dragover.prevent>
    </v-text-field>
</template>

<script setup>
const props = defineProps(['answer']);
const drag = useDrag();
const value = ref("");
defineExpose({ reset });

function reset() {
    value.value = "";
}

</script>