<script setup lang="ts">
import { VALUE_EQUATION_TEXTS, APP_TEXTS } from '~/constants/texts'

useHead({ title: `${VALUE_EQUATION_TEXTS.title} · ${APP_TEXTS.title}` })
</script>

<template>
  <main class="page">
    <header class="page__header">
      <h1>{{ VALUE_EQUATION_TEXTS.title }}</h1>
    </header>

    <!-- Conversión de tasas compacta, en banner, debajo del título. -->
    <RateConverter variant="banner" />

    <ValueEquationCalculator />
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
