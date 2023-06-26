<template>
    <v-item-group v-model="selectedOption">
        <v-item v-for="(option, index) in q.options" :key="index">
            <v-card :class="['d-flex align-center mb-3 pa-3', isSelected(index)]" dark max-width="500"
                @click="selectOption(index)">
                <div class="flex-grow-1">
                    {{ option }}
                </div>
            </v-card>
        </v-item>
    </v-item-group>
    <div v-if="selectedOption != null && q.reason && q.answerId == 1">
        <i>Reason: {{ q.reason }}</i>
    </div>
</template>

<script setup>
const props = defineProps(['id', 'q']);
defineExpose({ reset });
const selectedOption = ref(null);

function indexToLetter(index) {
    return String.fromCharCode(65 + index);
}

function reset() {
    selectedOption.value = null;
}

function isSelected(index) {
    if (selectedOption.value === index) return index === props.q.answerId ? "bg-success" : "bg-error";
    else if (selectedOption.value != null && index === props.q.answerId) return "text-success font-weight-bold";
    else return "";
}

function selectOption(index) {
    if (selectedOption.value != null) return;
    selectedOption.value = index;
}
</script>