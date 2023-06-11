<template>
    <div v-html="html"></div>
</template>

<script setup>
import showdown from "showdown";
const props = defineProps(['src']);
const converter = new showdown.Converter();
const html = ref("<p></p>");
html.value = converter.makeHtml(props.src);
</script>