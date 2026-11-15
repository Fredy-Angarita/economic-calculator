<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import {
  useAnnuity,
  type AnnuityKind,
  type AnnuityTarget,
  type AnnuityResult,
} from '~/composables/useAnnuity'
import { annuitySchema, type AnnuityModel } from '~/schemas/annuity.schema'
import { useSharedRate } from '~/composables/useSharedRate'
import { ANNUITY_TEXTS, COMMON_TEXTS } from '~/constants/texts'
import { formatMoney, formatPercent, formatNumber } from '~/utils/formatNumber'

const t = ANNUITY_TEXTS
const { solve } = useAnnuity()

const kindOptions = (Object.keys(t.kinds) as AnnuityKind[]).map((value) => ({
  value,
  label: t.kinds[value],
}))
const targetOptions = (Object.keys(t.targets) as AnnuityTarget[]).map((value) => ({
  value,
  label: t.targets[value],
}))

// kind y target son refs locales (controlan el schema y los campos visibles).
// Deben declararse ANTES del useForm, porque validationSchema usa target.value.
const kind = ref<AnnuityKind>('ordinary')
const target = ref<AnnuityTarget>('presentValue')

const result = ref<AnnuityResult | null>(null)

const validationSchema = computed(() => toTypedSchema(annuitySchema(target.value, kind.value)))

const { handleSubmit, resetForm, values, setFieldValue } = useForm<AnnuityModel>({
  validationSchema,
  initialValues: {
    ratePercent: undefined,
    periods: undefined,
    payment: undefined,
    presentValue: undefined,
    futureValue: undefined,
    deferralPeriods: undefined,
  },
})

const isDeferred = computed(() => kind.value === 'deferred')
const needsPayment = computed(() => target.value === 'presentValue' || target.value === 'futureValue')
const needsPvFv = computed(() => target.value === 'payment')

watch(target, () => {
  result.value = null
})

const onSubmit = handleSubmit((v) => {
  result.value = solve({
    kind: kind.value,
    target: target.value,
    ratePercent: v.ratePercent as number,
    periods: v.periods as number,
    payment: v.payment ?? null,
    presentValue: v.presentValue ?? null,
    futureValue: v.futureValue ?? null,
    deferralPeriods: v.deferralPeriods ?? null,
  })
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
  applySharedRate()
}

defineExpose({ values })
</script>

<template>
  <section class="card">
    <h2>{{ t.title }}</h2>
    <p class="subtitle">{{ t.subtitle }}</p>

    <UiBaseSelect v-model="kind" :label="t.kindLabel" :options="kindOptions" />
    <UiBaseSelect v-model="target" :label="t.targetLabel" :options="targetOptions" />

    <UiSharedRateNotice />

    <form novalidate @submit="onSubmit">
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

      <UiBaseInput
        v-if="isDeferred"
        name="deferralPeriods"
        type="number"
        :label="t.fields.deferralPeriods.label"
        :placeholder="t.fields.deferralPeriods.placeholder"
      />

      <UiBaseInput
        v-if="needsPayment"
        name="payment"
        type="number"
        money
        :label="t.fields.payment.label"
        :placeholder="t.fields.payment.placeholder"
      />

      <template v-if="needsPvFv">
        <p class="hint">{{ t.paymentNote }}</p>
        <UiBaseInput
          name="presentValue"
          type="number"
          money
          :label="t.fields.presentValue.label"
          :placeholder="t.fields.presentValue.placeholder"
        />
        <UiBaseInput
          name="futureValue"
          type="number"
          money
          :label="t.fields.futureValue.label"
          :placeholder="t.fields.futureValue.placeholder"
        />
      </template>

      <div class="actions">
        <button type="button" class="secondary" @click="onReset">{{ COMMON_TEXTS.reset }}</button>
        <button type="submit">{{ COMMON_TEXTS.calculate }}</button>
      </div>
    </form>

    <div v-if="result" class="result">
      <h3>{{ COMMON_TEXTS.result }}</h3>
      <ul>
        <li>
          <span>{{ t.results.payment }}:</span>
          <strong>{{ formatMoney(result.payment) }}</strong>
        </li>
        <li>
          <span>{{ t.results.presentValue }}:</span>
          <strong>{{ formatMoney(result.presentValue) }}</strong>
        </li>
        <li>
          <span>{{ t.results.futureValue }}:</span>
          <strong>{{ formatMoney(result.futureValue) }}</strong>
        </li>
        <li>
          <span>{{ t.results.periods }}:</span>
          <strong>{{ formatNumber(result.periods) }}</strong>
        </li>
        <li>
          <span>{{ t.results.ratePerPayment }}:</span>
          <strong>{{ formatPercent(result.ratePerPayment * 100) }}</strong>
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

h2 {
  margin: 0 0 0.25rem;
  color: var(--color-text-invert);
}

.subtitle {
  margin: 0 0 1.25rem;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.hint {
  margin: 0 0 1rem;
  font-size: 0.82rem;
  color: var(--color-text-muted);
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
