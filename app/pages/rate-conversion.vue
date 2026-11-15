<script setup lang="ts">
import { computed } from 'vue'
import { useSharedRate } from '~/composables/useSharedRate'
import type { Periodicity } from '~/composables/useRateConversion'
import { RATE_CONVERSION_TEXTS, APP_TEXTS } from '~/constants/texts'
import { formatPercent } from '~/utils/formatNumber'

useHead({ title: `${RATE_CONVERSION_TEXTS.title} · ${APP_TEXTS.title}` })

const t = RATE_CONVERSION_TEXTS
const { shared, set, clear } = useSharedRate()

const activeText = computed(() => {
  if (!shared.value) return ''
  return `${formatPercent(shared.value.valuePercent, 4)} · ${t.sharedEffective} · ${t.periodicities[shared.value.periodicity]}`
})

function onConvert(payload: { effectivePeriodPercent: number; toPeriodicity: Periodicity }) {
  set({ valuePercent: payload.effectivePeriodPercent, periodicity: payload.toPeriodicity })
}
</script>

<template>
  <main class="page">
    <div class="page__col">
      <RateConverter @convert="onConvert" />

      <section class="active">
        <div class="active__head">
          <h2>{{ t.activeTitle }}</h2>
          <button v-if="shared" type="button" class="active__clear" @click="clear">
            {{ t.clear }}
          </button>
        </div>

        <template v-if="shared">
          <p class="active__value">{{ activeText }}</p>
          <p class="active__note">{{ t.activeNote }}</p>
          <ul class="active__modules">
            <li><NuxtLink to="/">{{ t.modules.compoundInterest }}</NuxtLink></li>
            <li><NuxtLink to="/value-equations">{{ t.modules.valueEquations }}</NuxtLink></li>
            <li><NuxtLink to="/annuities">{{ t.modules.annuities }}</NuxtLink></li>
            <li><NuxtLink to="/amortization">{{ t.modules.amortization }}</NuxtLink></li>
          </ul>
        </template>
        <p v-else class="active__note">{{ t.activeEmpty }}</p>
      </section>
    </div>
  </main>
</template>

<style scoped>
.page {
  width: 100%;
  padding: clamp(1.25rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem) 4rem;
}

/* Ocupa el ancho disponible hasta un máximo, y se centra en pantallas grandes. */
.page__col {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* El convertidor ocupa todo el ancho de la columna (su estilo base limita a 480px). */
.page__col :deep(.converter) {
  max-width: none;
  width: 100%;
  padding: clamp(1.25rem, 2.5vw, 2rem);
}

.page__col :deep(.converter__header h3) {
  font-size: clamp(1.05rem, 1.6vw, 1.25rem);
}

.page__col :deep(.converter__grid) {
  gap: clamp(0.75rem, 2vw, 1.5rem);
}

.page__col :deep(.converter button[type='submit']) {
  max-width: 360px;
  margin-left: auto;
  margin-right: auto;
  display: block;
  width: 100%;
}

.active {
  width: 100%;
  padding: clamp(1.1rem, 2.5vw, 1.75rem);
  border: 1px solid var(--color-card-border);
  border-radius: var(--radius);
  background: var(--color-card);
  box-shadow: var(--shadow-card);
}

.active__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.active__head h2 {
  margin: 0;
  font-size: 1rem;
  color: var(--color-text-invert);
}

.active__clear {
  padding: 0.4rem 0.9rem;
  border: none;
  border-radius: var(--radius-sm);
  background: rgba(148, 163, 184, 0.15);
  color: var(--color-text-soft);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.active__clear:hover {
  background: rgba(148, 163, 184, 0.25);
}

.active__value {
  margin: 0 0 0.4rem;
  font-size: clamp(1rem, 2vw, 1.2rem);
  font-weight: 700;
  color: var(--color-accent);
  font-variant-numeric: tabular-nums;
  overflow-wrap: anywhere;
}

.active__note {
  margin: 0 0 0.9rem;
  font-size: 0.88rem;
  color: var(--color-text-muted);
}

.active__modules {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.5rem;
}

.active__modules a {
  display: block;
  padding: 0.6rem 0.8rem;
  border-radius: var(--radius-sm);
  background: var(--slate-200);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-primary);
}

.active__modules a:hover {
  background: var(--slate-300);
}
</style>
