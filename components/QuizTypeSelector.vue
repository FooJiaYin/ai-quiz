<template>
    <v-select v-model="value" @update:modelValue="emit('update:modelValue', value)"
        class="flex-fill mx-4" multiple label="Select quiz type" :items="[
            { title: 'Multiple Choice', value: 'MC' },
            { title: 'True/False', value: 'TF' },
        ]" :rules="[v => v.length > 0 || 'At least one type must be selected']" />
</template>

<script setup>
const props = defineProps(['modelValue']);
const value = ref(props.modelValue);
const emit = defineEmits(['update:modelValue']);
</script>