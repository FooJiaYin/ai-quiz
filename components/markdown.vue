<template>
    <div v-html="html"></div>
</template>

<script setup>
import showdown from "showdown";
const props = defineProps(['src']);
const converter = new showdown.Converter();
const html = ref(converter.makeHtml(props.src));

watch(() => props.src, () => {
    html.value = converter.makeHtml(props.src);
});
</script>