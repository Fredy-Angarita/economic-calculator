<script setup lang="ts">
import { VALUE_EQUATION_TEXTS, APP_TEXTS } from '~/constants/texts'

useHead({ title: `${VALUE_EQUATION_TEXTS.title} · ${APP_TEXTS.title}` })
</script>

<template>
  <main class="page">
    <ValueEquationCalculator />
  </main>
</template>

<style scoped>
.page {
  max-width: 820px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
}
</style>
