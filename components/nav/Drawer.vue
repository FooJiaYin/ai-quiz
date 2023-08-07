<template>
    <v-navigation-drawer class="bg-indigo-darken-1" permanent theme="dark">
        <v-list nav>
            <NavLink link="/" title="+ Add Quiz"></NavLink>
            <NavLink v-if="quiz['mainpoints'].length > 0" link="/mainpoints" title="Main Points"></NavLink>
            <NavLink v-if="quiz['MC'].length > 0" link="/multiple-choice" title="Multiple Choice Quiz"></NavLink>
            <NavLink v-if="quiz['TF'].length > 0" link="/true-false" title="True/False Quiz"></NavLink>
            <NavLink v-if="quiz['definition'].length > 0" link="/keywords" title="Keywords Definition"></NavLink>
            <NavLink v-if="quiz['cloze'].length > 0" link="/cloze" title="Cloze Quiz"></NavLink>
            <NavLink v-if="quiz['clozeParagraph'].answers?.length > 0" link="/cloze-paragraph" title="Cloze Paragraph Quiz"></NavLink>
            <NavLink v-if="quiz['SOP'].length > 0" link="/sop" title="SOP"></NavLink>
            <NavLink v-if="quiz['SOP'].length > 0" link="/sort-sop" title="Sort SOP"></NavLink>
            <NavLink v-if="quiz['diagram']?.question && quiz['diagram'].question.length > 0" link="/sop-diagram" title="SOP Diagram"></NavLink>
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