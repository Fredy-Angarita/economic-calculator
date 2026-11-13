<script setup lang="ts">
import { computed, ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import {
  useRateConversion,
  PERIODICITIES,
  type RateType,
  type Periodicity,
  type RateConversionResult,
} from '~/composables/useRateConversion'
import { rateConversionSchema, type RateConversionModel } from '~/schemas/rateConversion.schema'
import { RATE_CONVERSION_TEXTS, COMMON_TEXTS } from '~/constants/texts'
import { formatPercent, formatNumber } from '~/utils/formatNumber'

const t = RATE_CONVERSION_TEXTS

// Permite que un módulo padre reciba la tasa convertida (en %) al calcularla.
const emit = defineEmits<{ convert: [valuePercent: number] }>()

const { convert } = useRateConversion()

// Opciones para los selects, resueltas desde los textos.
const typeOptions = (Object.keys(t.types) as RateType[]).map((value) => ({
  value,
  label: t.types[value],
}))

const periodicityOptions = (Object.keys(PERIODICITIES) as Periodicity[]).map((value) => ({
  value,
  label: t.periodicities[value],
}))

const result = ref<RateConversionResult | null>(null)

const { handleSubmit, defineField } = useForm<RateConversionModel>({
  validationSchema: toTypedSchema(rateConversionSchema),
  initialValues: {
    valuePercent: undefined,
    fromType: 'effective',
    fromPeriodicity: 'monthly',
    toType: 'nominal',
    toPeriodicity: 'bimonthly',
  },
})

// Campos de select vinculados al formulario.
const [fromType] = defineField('fromType')
const [fromPeriodicity] = defineField('fromPeriodicity')
const [toType] = defineField('toType')
const [toPeriodicity] = defineField('toPeriodicity')

const onSubmit = handleSubmit((values) => {
  result.value = convert({
    valuePercent: values.valuePercent,
    fromType: values.fromType,
    fromPeriodicity: values.fromPeriodicity,
    toType: values.toType,
    toPeriodicity: values.toPeriodicity,
  })
  emit('convert', result.value.valuePercent)
})

const resultText = computed(() =>
  result.value ? formatPercent(result.value.valuePercent, 4) : null
)

const resultDecimalText = computed(() =>
  result.value ? formatNumber(result.value.value, 6) : null
)
</script>

<template>
  <section class="converter">
    <header class="converter__header">
      <h3>{{ t.title }}</h3>
      <p>{{ t.subtitle }}</p>
    </header>

    <form novalidate @submit="onSubmit">
      <UiBaseInput
        name="valuePercent"
        type="number"
        :label="t.valueLabel"
        :placeholder="t.valuePlaceholder"
      />

      <div class="converter__grid">
        <fieldset class="converter__group">
          <legend>{{ t.from }}</legend>
          <UiBaseSelect v-model="fromType" :label="t.typeLabel" :options="typeOptions" />
          <UiBaseSelect
            v-model="fromPeriodicity"
            :label="t.periodicityLabel"
            :options="periodicityOptions"
          />
        </fieldset>

        <fieldset class="converter__group">
          <legend>{{ t.to }}</legend>
          <UiBaseSelect v-model="toType" :label="t.typeLabel" :options="typeOptions" />
          <UiBaseSelect
            v-model="toPeriodicity"
            :label="t.periodicityLabel"
            :options="periodicityOptions"
          />
        </fieldset>
      </div>

      <button type="submit">{{ t.convert }}</button>
    </form>

    <div v-if="result" class="converter__result">
      <div class="converter__result-main">
        <span>{{ t.resultLabel }}</span>
        <strong>{{ resultText }}</strong>
      </div>
      <div class="converter__result-row">
        <span>{{ t.resultDecimalLabel }}</span>
        <strong>{{ resultDecimalText }}</strong>
      </div>
    </div>
  </section>
</template>

<style scoped>
.converter {
  max-width: 480px;
  margin: 0 auto;
  padding: 1.5rem;
  border: 1px solid var(--color-card-border);
  border-radius: var(--radius);
  background: var(--color-card);
}

@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .converter {
    background: var(--color-card-glass);
    -webkit-backdrop-filter: blur(var(--blur-glass));
    backdrop-filter: blur(var(--blur-glass));
  }
}

.converter__header {
  margin-bottom: 1.25rem;
}

.converter__header h3 {
  color: var(--color-text-invert);
  font-size: 1.1rem;
}

.converter__header p {
  margin-top: 0.25rem;
  color: var(--color-text-muted);
  font-size: 0.85rem;
}

.converter__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.converter__group {
  margin: 0;
  padding: 0.9rem;
  border: 1px solid var(--color-card-border);
  border-radius: var(--radius-sm);
}

.converter__group legend {
  padding: 0 0.4rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
}

button {
  width: 100%;
  margin-top: 0.5rem;
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

.converter__result {
  margin-top: 1.25rem;
  padding: 1rem 1.25rem;
  border-radius: var(--radius-sm);
  background: rgba(45, 212, 191, 0.1);
  border: 1px solid rgba(45, 212, 191, 0.3);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.converter__result span {
  color: var(--color-text-soft);
  font-size: 0.9rem;
}

.converter__result strong {
  color: var(--color-accent);
  font-variant-numeric: tabular-nums;
}

.converter__result-main {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.converter__result-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 0.5rem;
  border-top: 1px dashed rgba(45, 212, 191, 0.25);
}

.converter__result-row strong {
  font-size: 0.95rem;
}

.converter__result-main strong {
  font-size: 1.1rem;
}

@media (max-width: 520px) {
  .converter__grid {
    grid-template-columns: 1fr;
  }
}
</style>
