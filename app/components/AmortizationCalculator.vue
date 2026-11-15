<script setup lang="ts">
import { ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import {
  useAmortization,
  type AmortizationResult,
  type AmortizationMode,
} from '~/composables/useAmortization'
import { amortizationSchema, type AmortizationModel } from '~/schemas/amortization.schema'
import { useSharedRate } from '~/composables/useSharedRate'
import { AMORTIZATION_TEXTS, COMMON_TEXTS } from '~/constants/texts'
import { formatMoney } from '~/utils/formatNumber'

const t = AMORTIZATION_TEXTS
const { build } = useAmortization()

const result = ref<AmortizationResult | null>(null)

const mode = ref<AmortizationMode>('reducePayment')
const modeOptions = (Object.keys(t.modes) as AmortizationMode[]).map((value) => ({
  value,
  label: t.modes[value],
}))

let lastInput: Omit<AmortizationModel, 'extraPayments'> & {
  extraPayments: { value: number; period: number }[]
} | null = null

const { handleSubmit, resetForm, setFieldValue } = useForm<AmortizationModel>({
  validationSchema: toTypedSchema(amortizationSchema),
  initialValues: {
    principal: undefined,
    ratePercent: undefined,
    periods: undefined,
    extraPayments: [],
  },
})

function compute() {
  if (!lastInput) return
  result.value = build({ ...lastInput, mode: mode.value })
}

const onSubmit = handleSubmit((v) => {
  lastInput = {
    principal: v.principal,
    ratePercent: v.ratePercent,
    periods: v.periods,
    extraPayments: v.extraPayments ?? [],
  }
  compute()
})

// Al cambiar el modo, recalcular si ya hay un resultado.
watch(mode, () => {
  if (result.value) compute()
})

// Tasa compartida: al haber una tasa convertida, se usa como valor inicial.
const { shared } = useSharedRate()

function applySharedRate() {
  if (shared.value) setFieldValue('ratePercent', shared.value.valuePercent)
}

watch(shared, applySharedRate, { immediate: true })

function onReset() {
  resetForm()
  result.value = null
  lastInput = null
  applySharedRate()
}
</script>

<template>
  <section class="card">
    <h2>{{ t.title }}</h2>
    <p class="subtitle">{{ t.subtitle }}</p>

    <UiSharedRateNotice />

    <form novalidate @submit="onSubmit">
      <UiBaseInput
        name="principal"
        type="number"
        money
        :label="t.fields.principal.label"
        :placeholder="t.fields.principal.placeholder"
      />
      <UiBaseInput
        name="ratePercent"
        type="number"
        :label="t.fields.ratePercent.label"
        :placeholder="t.fields.ratePercent.placeholder"
      />
      <UiBaseInput
        name="periods"
        type="number"
        :label="t.fields.periods.label"
        :placeholder="t.fields.periods.placeholder"
      />

      <UiCashItemsTable
        name="extraPayments"
        :title="t.extras.title"
        :value-label="t.extras.value"
        :value-placeholder="t.extras.valuePlaceholder"
        :period-label="t.extras.period"
        :period-placeholder="t.extras.periodPlaceholder"
        :add-label="t.extras.add"
        :remove-label="t.extras.remove"
        :hint="t.extras.hint"
        :empty-label="t.extras.empty"
      />

      <div class="actions">
        <button type="button" class="secondary" @click="onReset">{{ COMMON_TEXTS.reset }}</button>
        <button type="submit">{{ t.calculate }}</button>
      </div>
    </form>

    <div v-if="result" class="result">
      <UiBaseSelect v-model="mode" :label="t.modeLabel" :options="modeOptions" />

      <div class="summary">
        <div class="summary__item">
          <span>{{ t.summary.initialPayment }}</span>
          <strong>{{ formatMoney(result.initialPayment) }}</strong>
        </div>
        <div class="summary__item">
          <span>{{ t.summary.periodsCount }}</span>
          <strong>{{ result.rows.length }}</strong>
        </div>
        <div class="summary__item">
          <span>{{ t.summary.totalInterest }}</span>
          <strong>{{ formatMoney(result.totalInterest) }}</strong>
        </div>
        <div class="summary__item">
          <span>{{ t.summary.totalExtra }}</span>
          <strong>{{ formatMoney(result.totalExtra) }}</strong>
        </div>
        <div class="summary__item">
          <span>{{ t.summary.totalPaid }}</span>
          <strong>{{ formatMoney(result.totalPaid) }}</strong>
        </div>
      </div>

      <DataTable :value="result.rows" size="small" scrollable scroll-height="420px" class="plan">
        <Column :header="t.table.period" field="period" />
        <Column :header="t.table.payment">
          <template #body="{ data }">{{ formatMoney(data.payment) }}</template>
        </Column>
        <Column :header="t.table.interest">
          <template #body="{ data }">{{ formatMoney(data.interest) }}</template>
        </Column>
        <Column :header="t.table.principalPaid">
          <template #body="{ data }">{{ formatMoney(data.principalPaid) }}</template>
        </Column>
        <Column :header="t.table.extra">
          <template #body="{ data }">{{ data.extra > 0 ? formatMoney(data.extra) : '—' }}</template>
        </Column>
        <Column :header="t.table.balance">
          <template #body="{ data }">{{ formatMoney(data.balance) }}</template>
        </Column>
      </DataTable>
    </div>
  </section>
</template>

<style scoped>
.card {
  width: 100%;
  padding: 1.75rem;
  border: 1px solid var(--color-card-border);
  border-radius: var(--radius);
  background: var(--color-card);
  box-shadow: var(--shadow-card);
}

h2 {
  margin: 0 0 0.25rem;
  color: var(--color-text-invert);
}

.subtitle {
  margin: 0 0 1.25rem;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

button {
  flex: 1;
  padding: 0.7rem 1rem;
  border: none;
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

button:hover {
  background: var(--color-primary-hover);
}

button.secondary {
  background: rgba(148, 163, 184, 0.15);
  color: var(--color-text-soft);
}

button.secondary:hover {
  background: rgba(148, 163, 184, 0.25);
}

.result {
  margin-top: 1.75rem;
}

.summary {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

/* Fila 1: 3 tarjetas (cada una ocupa 2 de 6 columnas). */
.summary__item:nth-child(1),
.summary__item:nth-child(2),
.summary__item:nth-child(3) {
  grid-column: span 2;
}

/* Fila 2: 2 tarjetas (cada una ocupa 3 de 6 columnas). */
.summary__item:nth-child(4),
.summary__item:nth-child(5) {
  grid-column: span 3;
}

.summary__item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  background: var(--slate-200);
  border: 1px solid var(--slate-200);
}

.summary__item span {
  font-size: 0.78rem;
  color: var(--color-text-muted);
}

.summary__item strong {
  color: var(--color-accent);
  font-variant-numeric: tabular-nums;
  font-size: 0.95rem;
  overflow-wrap: anywhere;
}

@media (max-width: 600px) {
  .summary {
    grid-template-columns: repeat(2, 1fr);
  }
  .summary__item:nth-child(n) {
    grid-column: span 1;
  }
}

.plan {
  font-variant-numeric: tabular-nums;
}
</style>
