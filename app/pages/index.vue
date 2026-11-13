<script setup lang="ts">
import { COMPOUND_INTEREST_TEXTS, APP_TEXTS } from '~/constants/texts'

useHead({ title: `${COMPOUND_INTEREST_TEXTS.title} · ${APP_TEXTS.title}` })
</script>

<template>
  <main class="page">
    <header class="page__header">
      <h1>{{ COMPOUND_INTEREST_TEXTS.title }}</h1>
      <p class="page__formula">{{ COMPOUND_INTEREST_TEXTS.formula }}</p>
    </header>

    <CompoundInterestCalculator />
  </main>
</template>

<style scoped>
.page {
  max-width: 760px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
}

.page__header {
  text-align: center;
  margin-bottom: 2.25rem;
}

.page__header h1 {
  color: var(--color-text-invert);
  font-size: 2rem;
  letter-spacing: -0.02em;
}

.page__formula {
  margin-top: 0.6rem;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: 1rem;
}
</style>
