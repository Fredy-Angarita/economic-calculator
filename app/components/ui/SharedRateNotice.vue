<script setup lang="ts">
import { computed } from 'vue'
import { useSharedRate } from '~/composables/useSharedRate'
import { RATE_CONVERSION_TEXTS } from '~/constants/texts'
import { formatPercent } from '~/utils/formatNumber'

const t = RATE_CONVERSION_TEXTS
const { shared } = useSharedRate()

const message = computed(() => {
  if (!shared.value) return ''
  const rate = formatPercent(shared.value.valuePercent, 4)
  const periodicity = t.periodicities[shared.value.periodicity]
  return `${rate} · ${t.sharedEffective} · ${periodicity}`
})
</script>

<template>
  <div v-if="shared" class="shared-rate">
    <span class="pi pi-percentage shared-rate__icon" />
    <p>
      <span>{{ t.sharedNoticePrefix }}</span>
      <strong>{{ message }}</strong>
    </p>
    <NuxtLink to="/rate-conversion" class="shared-rate__link">{{ t.sharedChange }}</NuxtLink>
  </div>
</template>

<style scoped>
.shared-rate {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding: 0.7rem 0.9rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--slate-300);
  background: var(--slate-200);
  font-size: 0.85rem;
}

.shared-rate__icon {
  color: var(--color-accent);
}

.shared-rate p {
  margin: 0;
  flex: 1;
  color: var(--color-text-soft);
}

.shared-rate strong {
  color: var(--color-text-invert);
  font-variant-numeric: tabular-nums;
}

.shared-rate__link {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
  white-space: nowrap;
}

.shared-rate__link:hover {
  text-decoration: underline;
}
</style>
