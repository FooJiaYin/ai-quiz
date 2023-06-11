<template>
    <v-navigation-drawer class="bg-indigo-darken-1" permanent theme="dark">
        <v-list nav>
            <NavLink link="/" title="+ Add Quiz"></NavLink>
            <NavLink link="/main-points" title="Main Points"></NavLink>
            <NavLink link="/single-choice" title="Single Choice Quiz"></NavLink>
        </v-list>
    </v-navigation-drawer>
</template>

<style>
.v-navigation-drawer,
.v-navigation-drawer * {
    transition-duration: 0s !important;
}
</style>