<template>
    {{ text }}
    <input variant="outlined" readonly v-if="!hideBlank"
        :class="value !== '' ? answer === value ? 'text-success' : 'text-error' : ''" 
        :value="value" @drop="value = drag.text; drag.hide(); $emit('update', value)" 
        @dragover="e => {if (value == '') e.preventDefault()}" />
</template>

<style scoped>
input {
    width: 150px;
    padding: 5px !important;
    min-height: 1em;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 5px;
}
</style>

<script setup>
const props = defineProps(['text', 'answer', 'clozeValue', 'hideBlank']);
const drag = useDrag();
const value = ref("");
defineExpose({ reset });
defineEmits(['update']);

watch(() => props.clozeValue, (newVal) => {
    value.value = newVal;
});

function reset() {
    value.value = "";
}

</script>