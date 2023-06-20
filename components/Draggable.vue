<template>
    <div class="text-align-center bg-primary rounded-lg px-4 py-2" 
        draggable="true" @dragstart="drag.set(keyword)">
        {{ keyword }}
    </div>
</template>

<script setup>
const props = defineProps(['keyword']);
const drag = useDrag();
</script>