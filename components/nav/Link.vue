<template>
    <v-list-item :title="title" :value="link" :to="link" class="text-white text-decoration-none">
        <slot></slot>
    </v-list-item>
</template>

<style>
a {
    text-decoration: none;
}
</style>
  
<script setup>
defineProps(['link', 'title']);
</script>