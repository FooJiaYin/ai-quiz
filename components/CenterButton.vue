<template>
    <div class="d-flex">
        <v-btn color="primary" class="mx-auto" @click="$emit('click')" :disabled="props.disabled">
            <slot></slot>
        </v-btn>
    </div>
</template>

<script setup>
const props = defineProps(['disabled']);
</script>