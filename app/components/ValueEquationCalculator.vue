<script setup lang="ts">
import { computed, ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import {
  useValueEquation,
  type UnknownSide,
  type ValueEquationResult,
} from '~/composables/useValueEquation'
import { valueEquationSchema, type ValueEquationModel } from '~/schemas/valueEquation.schema'
import { VALUE_EQUATION_TEXTS, COMMON_TEXTS } from '~/constants/texts'
import { formatMoney, formatNumber } from '~/utils/formatNumber'

const t = VALUE_EQUATION_TEXTS
const { solve } = useValueEquation()

const unknownOptions = (Object.keys(t.unknownSides) as UnknownSide[]).map((value) => ({
  value,
  label: t.unknownSides[value],
}))

const result = ref<ValueEquationResult | null>(null)

const { handleSubmit, defineField, resetForm } = useForm<ValueEquationModel>({
  validationSchema: toTypedSchema(valueEquationSchema),
  initialValues: {
    ratePercent: undefined,
    focalPeriod: undefined,
    unknownSide: 'payment',
    debts: [],
    payments: [],
  },
})

const [unknownSide] = defineField('unknownSide')

const onSubmit = handleSubmit((values) => {
  result.value = solve({
    ratePercent: values.ratePercent,
    focalPeriod: values.focalPeriod,
    unknownSide: values.unknownSide,
    debts: values.debts,
    payments: values.payments,
  })
})

function onReset() {
  resetForm()
  result.value = null
}

const unknownLabel = computed(() => t.unknownSides[unknownSide.value as UnknownSide])
</script>

<template>
  <section class="card">
    <h2>{{ t.title }}</h2>
    <p class="card__subtitle">{{ t.subtitle }}</p>

    <form novalidate @submit="onSubmit">
      <!-- Datos generales: tasa + incógnita + fecha focal -->
      <fieldset class="group">
        <legend>{{ t.setup }}</legend>
        <UiBaseInput
          name="ratePercent"
          type="number"
          :label="t.rateLabel"
          :placeholder="t.ratePlaceholder"
        />
        <UiBaseSelect v-model="unknownSide" :label="t.unknownLabel" :options="unknownOptions" />
        <UiBaseInput
          name="focalPeriod"
          type="number"
          :label="t.focalLabel"
          :placeholder="t.focalPlaceholder"
        />
        <p class="group__note">{{ t.focalNote }}</p>
      </fieldset>

      <!-- Deudas -->
      <UiCashItemsTable
        name="debts"
        :title="t.debts"
        :value-label="t.itemValue"
        :value-placeholder="t.itemValuePlaceholder"
        :period-label="t.itemPeriod"
        :period-placeholder="t.itemPeriodPlaceholder"
        :add-label="t.addDebt"
        :remove-label="t.remove"
        :hint="t.itemHint"
        :empty-label="t.empty"
      />

      <!-- Pagos -->
      <UiCashItemsTable
        name="payments"
        :title="t.payments"
        :value-label="t.itemValue"
        :value-placeholder="t.itemValuePlaceholder"
        :period-label="t.itemPeriod"
        :period-placeholder="t.itemPeriodPlaceholder"
        :add-label="t.addPayment"
        :remove-label="t.remove"
        :hint="t.itemHint"
        :empty-label="t.empty"
      />

      <div class="actions">
        <button type="button" class="reset" @click="onReset">{{ COMMON_TEXTS.reset }}</button>
        <button type="submit" class="submit">{{ t.calculate }}</button>
      </div>
    </form>

    <div v-if="result" class="result">
      <h3>{{ COMMON_TEXTS.result }}</h3>
      <div class="result__main">
        <span>{{ t.results.unknown }} ({{ unknownLabel }})</span>
        <strong>{{ formatMoney(result.unknownValue) }}</strong>
      </div>
      <ul>
        <li>
          <span>{{ t.results.debtsAtFocal }}:</span>
          <strong>{{ formatNumber(result.debtsAtFocal, 2) }}</strong>
        </li>
        <li>
          <span>{{ t.results.paymentsAtFocal }}:</span>
          <strong>{{ formatNumber(result.paymentsAtFocal, 2) }}</strong>
        </li>
      </ul>
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

@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .card {
    background: var(--color-card-glass);
    -webkit-backdrop-filter: blur(var(--blur-glass));
    backdrop-filter: blur(var(--blur-glass));
  }
}

h2 {
  color: var(--color-text-invert);
}

.card__subtitle {
  margin: 0.25rem 0 1.5rem;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.group {
  margin: 0 0 1.25rem;
  padding: 1rem;
  border: 1px solid var(--color-card-border);
  border-radius: var(--radius-sm);
}

.group legend {
  padding: 0 0.4rem;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
}

.group__note {
  margin: 0.25rem 0 0;
  font-size: 0.78rem;
  color: var(--color-text-muted);
}

.actions {
  display: flex;
  gap: 0.75rem;
}

.submit {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.submit:hover {
  background: var(--color-primary-hover);
}

.reset {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: var(--radius-sm);
  background: rgba(148, 163, 184, 0.15);
  color: var(--color-text-soft);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.reset:hover {
  background: rgba(148, 163, 184, 0.25);
}

.result {
  margin-top: 1.75rem;
  padding: 1.25rem;
  border-radius: var(--radius-sm);
  background: var(--slate-200);
  border: 1px solid var(--slate-200);
}

.result h3 {
  margin: 0 0 0.75rem;
  color: var(--color-text-invert);
}

.result__main {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px dashed var(--slate-300);
}

.result__main strong {
  color: var(--color-accent);
  font-size: 1.25rem;
  font-variant-numeric: tabular-nums;
}

.result ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.result li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.9rem;
  color: var(--color-text-soft);
}

.result li strong {
  color: var(--color-text-invert);
  font-variant-numeric: tabular-nums;
}
</style>
