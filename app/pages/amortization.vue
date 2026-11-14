<script setup lang="ts">
import { AMORTIZATION_TEXTS, APP_TEXTS } from '~/constants/texts'

useHead({ title: `${AMORTIZATION_TEXTS.title} · ${APP_TEXTS.title}` })
</script>

<template>
  <main class="page">
    <!-- Conversión de tasas compacta, en banner. -->
    <RateConverter variant="banner" />

    <AmortizationCalculator />
  </main>
</template>

<style scoped>
.page {
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
}
</style>
