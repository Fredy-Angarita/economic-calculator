<script setup lang="ts">
import { COMPOUND_INTEREST_TEXTS, APP_TEXTS } from '~/constants/texts'

useHead({ title: `${COMPOUND_INTEREST_TEXTS.title} · ${APP_TEXTS.title}` })
</script>

<template>
  <main class="page">
    <header class="page__header">
      <h1>{{ COMPOUND_INTEREST_TEXTS.title }}</h1>
    </header>

    <RateConverter variant="banner" />

    <CompoundInterestCalculator />
  </main>
</template>

<style scoped>
.page {
  max-width: 820px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
}

.page__header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.page__header h1 {
  color: var(--color-text-invert);
  font-size: 2rem;
  letter-spacing: -0.02em;
}
</style>
