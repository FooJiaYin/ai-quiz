<template>
    <v-item-group v-model="selectedOption">
        <v-item v-for="(option, index) in options" :key="index">
            <v-card :class="['d-flex align-center mb-3 pa-3', isSelected(index)]" dark max-width="400"
                @click="selectOption(index)">
                <div class="flex-grow-1">
                    {{ option }}
                </div>
            </v-card>
        </v-item>
    </v-item-group>
</template>

<script setup>
const selectedOption = ref(null);
const options = ["Option 1", "Option 2", "Option 3"];
const answerId = 0;

function indexToLetter(index) {
    return String.fromCharCode(65 + index);
}

function isSelected(index) {
    if (selectedOption.value === index) return index === answerId ? "bg-success" : "bg-error";
    else if (selectedOption.value != null && index === answerId) return "text-success font-weight-bold";
    else return "";
}

function selectOption(index) {
    if (selectedOption.value != null) return;
    selectedOption.value = index;
    console.log(selectedOption.value);
}
</script>

