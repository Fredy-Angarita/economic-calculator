<script setup lang="ts">
import { ANNUITY_TEXTS, APP_TEXTS } from '~/constants/texts'

useHead({ title: `${ANNUITY_TEXTS.title} · ${APP_TEXTS.title}` })
</script>

<template>
  <main class="page">
    <AnnuityCalculator />
  </main>
</template>

<style scoped>
.page {
  max-width: 820px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
}
</style>
