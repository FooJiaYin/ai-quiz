<template>
    <v-dialog v-model="isOpen" activator="parent" width="80%">
        <v-card>
            <v-card-title>{{ title }}</v-card-title>
            <v-card-text>
                <v-textarea v-model="value" variant="outlined"></v-textarea>
                <CenterButton @click="onSave()">Save</CenterButton>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
const props = defineProps(['title', 'modelValue']);
const emit = defineEmits(['update:modelValue', 'save']);
const value = ref(props.modelValue ?? "");
const isOpen = ref(false);

function onSave() {
    isOpen.value = false;
    emit('update:modelValue', value.value)
    emit('save', value.value);
}
</script>
