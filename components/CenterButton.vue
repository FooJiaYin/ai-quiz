<template>
    <div class="d-flex">
        <v-btn color="primary" class="mx-auto" @click="$emit('click')">
            <slot></slot>
        </v-btn>
    </div>
</template>