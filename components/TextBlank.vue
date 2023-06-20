<template>
    <v-text-field variant="outlined" readonly
        :class="value !== '' ? answer === value ? 'text-success' : 'text-error' : ''" 
        v-model="value" @drop="value = drag.text" @dragover.prevent>
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