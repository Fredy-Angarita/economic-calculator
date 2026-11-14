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

const props = withDefaults(
  defineProps<{
    variant?: 'card' | 'banner'
  }>(),
  { variant: 'card' }
)

const emit = defineEmits<{ convert: [valuePercent: number] }>()

const { convert } = useRateConversion()

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
  <section class="converter" :class="`converter--${props.variant}`">
    <header v-if="props.variant === 'card'" class="converter__header">
      <h3>{{ t.title }}</h3>
      <p>{{ t.subtitle }}</p>
    </header>

    <p v-if="props.variant === 'banner'" class="converter__note">{{ t.subtitle }}</p>

    <form novalidate class="converter__form" @submit="onSubmit">
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
  background: var(--slate-200);
  border: 1px solid var(--slate-200);
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
  border-top: 1px dashed var(--slate-300);
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

/* ---- Variante banner: compacta, en una fila ---- */
.converter--banner {
  max-width: none;
  margin: 0 0 1.5rem;
  padding: 0.85rem 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}

.converter--banner .converter__note {
  flex: 1 1 100%;
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.82rem;
}

.converter--banner .converter__form {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.75rem;
  flex: 1 1 auto;
  min-width: 0;
}

/* El input de valor ocupa toda la fila. */
.converter--banner .converter__form > :deep(.field) {
  flex: 1 1 100%;
  margin-bottom: 0;
}

/* Las dos cajas origen/destino se reparten el espacio restante. */
.converter--banner .converter__grid {
  flex: 1 1 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.converter--banner .converter__group {
  flex: 1 1 220px;
  min-width: 0;
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem 0.6rem;
}

/* Selects en fila dentro de cada caja, sin margen inferior. */
.converter--banner .converter__group :deep(.field) {
  flex: 1;
  min-width: 0;
  margin-bottom: 0;
}

/* Labels más pequeñas para ahorrar altura. */
.converter--banner :deep(.field label) {
  font-size: 0.72rem;
}

.converter--banner .converter__group legend {
  font-size: 0.68rem;
}

.converter--banner button {
  width: 100%;
  flex: 1 1 100%;
  margin-top: 0;
  padding: 0.6rem 1.25rem;
}

/* Resultado inline a la derecha del banner. */
.converter--banner .converter__result {
  flex: 1 1 100%;
  margin-top: 0;
  padding: 0.6rem 0.9rem;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}

.converter--banner .converter__result-row {
  padding-top: 0;
  border-top: none;
  border-left: 1px dashed var(--slate-300);
  padding-left: 1rem;
}

/* Pantallas pequeñas: cada caja y su contenido se apilan. */
@media (max-width: 560px) {
  .converter--banner .converter__group {
    flex-direction: column;
    gap: 0.5rem;
  }

  .converter--banner .converter__result-row {
    border-left: none;
    padding-left: 0;
  }
}
</style>
