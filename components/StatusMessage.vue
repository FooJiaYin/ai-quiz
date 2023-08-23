<template>
    <div class="mt-3 text-center">
        <p v-for="message in [...quiz.errors, quiz.status]" :class="statusColor(message)">
            {{ message }}
        </p>
    </div>
</template>

<script setup>
const quiz = useQuiz();
const status = ref("");
const statusColor = (message) =>
    message === "Completed!" ? "text-success" :
        message.includes("Error") ? "text-error" :
            "black";
</script>