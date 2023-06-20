<template>
    <v-text-field variant="outlined" readonly hide-details
        :class="value !== '' ? answer === value ? 'text-success' : 'text-error' : ''" 
        v-model="value" @drop="value = drag.text" @dragover.prevent>
    </v-text-field>
</template>

<style scoped>
.v-text-field >>> input {
    padding: 5px !important;
    min-height: 1em;
    text-align: center;
}
</style>

<script setup>
const props = defineProps(['answer']);
const drag = useDrag();
const value = ref("");
defineExpose({ reset });

function reset() {
    value.value = "";
}

</script>