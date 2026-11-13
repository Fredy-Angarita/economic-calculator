<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import {
  useCompoundInterest,
  type CompoundTarget,
  type CompoundInterestResult,
} from '~/composables/useCompoundInterest'
import { compoundInterestSchema, type CompoundInterestModel } from '~/schemas/compoundInterest.schema'
import { COMPOUND_INTEREST_TEXTS, COMMON_TEXTS } from '~/constants/texts'
import { formatMoney, formatPercent, formatNumber } from '~/utils/formatNumber'

const t = COMPOUND_INTEREST_TEXTS
const { solve } = useCompoundInterest()

const targetOptions = (Object.keys(t.targets) as CompoundTarget[]).map((value) => ({
  value,
  label: t.targets[value],
}))

const target = ref<CompoundTarget>('futureValue')
const result = ref<CompoundInterestResult | null>(null)

const validationSchema = computed(() => toTypedSchema(compoundInterestSchema(target.value)))

const { handleSubmit, resetForm, values } = useForm<CompoundInterestModel>({ validationSchema })

const showField = (field: CompoundTarget) => target.value !== field

watch(target, () => {
  resetForm()
  result.value = null
})

const onSubmit = handleSubmit((formValues) => {
  result.value = solve(target.value, {
    presentValue: formValues.presentValue ?? null,
    futureValue: formValues.futureValue ?? null,
    ratePercent: formValues.ratePercent ?? null,
    periods: formValues.periods ?? null,
  })
})

function onReset() {
  resetForm()
  result.value = null
}

const targetLabel = computed(() => t.targets[target.value])

defineExpose({ values })
</script>

<template>
  <section class="card">
    <h2>{{ t.title }}</h2>
    <p class="formula">{{ t.formula }}</p>

    <UiBaseSelect v-model="target" :label="t.targetQuestion" :options="targetOptions" />

    <form novalidate @submit="onSubmit">
      <UiBaseInput
        v-if="showField('presentValue')"
        name="presentValue"
        type="number"
        money
        :label="t.fields.presentValue.label"
        :placeholder="t.fields.presentValue.placeholder"
      />
      <UiBaseInput
        v-if="showField('futureValue')"
        name="futureValue"
        type="number"
        money
        :label="t.fields.futureValue.label"
        :placeholder="t.fields.futureValue.placeholder"
      />
      <UiBaseInput
        v-if="showField('rate')"
        name="ratePercent"
        type="number"
        :label="t.fields.ratePercent.label"
        :placeholder="t.fields.ratePercent.placeholder"
      />
      <UiBaseInput
        v-if="showField('periods')"
        name="periods"
        type="number"
        :label="t.fields.periods.label"
        :placeholder="t.fields.periods.placeholder"
      />

      <div class="actions">
        <button type="button" class="secondary" @click="onReset">
          {{ COMMON_TEXTS.reset }}
        </button>
        <button type="submit">{{ COMMON_TEXTS.calculate }} · {{ targetLabel }}</button>
      </div>
    </form>

    <div v-if="result" class="result">
      <h3>{{ COMMON_TEXTS.result }}</h3>
      <ul>
        <li>
          <span>{{ t.results.presentValue }}:</span>
          <strong>{{ formatMoney(result.presentValue) }}</strong>
        </li>
        <li>
          <span>{{ t.results.futureValue }}:</span>
          <strong>{{ formatMoney(result.futureValue) }}</strong>
        </li>
        <li>
          <span>{{ t.results.ratePercent }}:</span>
          <strong>{{ formatPercent(result.ratePercent) }}</strong>
        </li>
        <li>
          <span>{{ t.results.periods }}:</span>
          <strong>{{ formatNumber(result.periods) }}</strong>
        </li>
        <li>
          <span>{{ t.results.interest }}:</span>
          <strong>{{ formatMoney(result.interest) }}</strong>
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

/* Efecto glass: solo cuando el navegador soporta backdrop-filter. */
@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .card {
    background: var(--color-card-glass);
    -webkit-backdrop-filter: blur(var(--blur-glass));
    backdrop-filter: blur(var(--blur-glass));
  }
}

h2 {
  margin: 0 0 0.25rem;
  color: var(--color-text-invert);
}

.formula {
  margin: 0 0 1.5rem;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
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
  transition: background 0.15s, box-shadow 0.15s, transform 0.05s;
}

button:hover {
  background: var(--color-primary-hover);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.3);
}

button:active {
  transform: translateY(1px);
}

button.secondary {
  background: rgba(148, 163, 184, 0.15);
  color: var(--color-text-soft);
}

button.secondary:hover {
  background: rgba(148, 163, 184, 0.25);
  box-shadow: none;
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

.result ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.result li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.95rem;
  color: var(--color-text-soft);
  padding-bottom: 0.6rem;
  border-bottom: 1px dashed rgba(148, 163, 184, 0.25);
}

.result li:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.result strong {
  color: var(--color-accent);
  font-variant-numeric: tabular-nums;
}
</style>
