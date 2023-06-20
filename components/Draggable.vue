<template>
    <div :class="`text-align-center bg-primary rounded-lg px-4 py-2 ${hidden ? 'd-none' : ''}`" 
        draggable="true" @dragstart="drag.set(keyword, hide)">
        {{ keyword }}
    </div>
</template>

<script setup>
const props = defineProps(['keyword']);
const drag = useDrag();
const hidden = ref(false);

function hide() {
    hidden.value = true;
}
</script>