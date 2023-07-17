<template>
    <v-chip class="ml-3" :color="level == 'Easy' ? 'green' : level == 'Hard' ? 'red' : 'amber'">
        {{ level }}
    </v-chip>
</template>

<script setup>
const props = defineProps(['level']);
const level = computed(() => capitalize(props.level));

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
</script>
