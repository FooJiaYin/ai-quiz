<template>
    <v-navigation-drawer class="bg-indigo-darken-1" permanent theme="dark">
        <v-list nav>
            <NavLink link="/" title="+ Add Quiz"></NavLink>
            <NavLink v-if="quiz['mainpoints'].length > 0" link="/main-points" title="Main Points"></NavLink>
            <NavLink v-if="quiz['MC'].length > 0" link="/multiple-choice" title="Multiple Choice Quiz"></NavLink>
        </v-list>
    </v-navigation-drawer>
</template>

<style>
.v-navigation-drawer,
.v-navigation-drawer * {
    transition-duration: 0s !important;
}
</style>

<script setup>
const quiz = useQuiz();
</script>