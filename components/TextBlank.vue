<template>
    {{ text }}
    <input variant="outlined" readonly v-if="!hideBlank"
        :class="value !== '' ? answer === value ? 'text-success' : 'text-error' : ''" 
        v-model="value" @drop="value = drag.text; drag.hide()" 
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
const props = defineProps(['text', 'answer', "hideBlank"]);
const drag = useDrag();
const value = ref("");
defineExpose({ reset });

function reset() {
    value.value = "";
}

</script>