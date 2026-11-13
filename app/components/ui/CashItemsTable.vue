<script setup lang="ts">
// Lista de movimientos (valor + periodo) con captura mediante DOS inputs
// (InputNumber de PrimeVue) y un botón "Agregar". La tabla (DataTable de
// PrimeVue) únicamente MUESTRA lo agregado y permite quitar filas.
// Se conecta al formulario de vee-validate del padre por `name`.

import { ref } from 'vue'
import { useFieldArray } from 'vee-validate'
import { formatMoney } from '~/utils/formatNumber'

const props = defineProps<{
  /** Título de la sección (ej: "Deudas"). */
  title: string
  /** Nombre del array en el formulario (ej: "debts"). */
  name: string
  /** Label de la columna/campo de valor. */
  valueLabel: string
  valuePlaceholder?: string
  /** Label de la columna/campo de periodo. */
  periodLabel: string
  periodPlaceholder?: string
  /** Texto del botón de agregar. */
  addLabel: string
  /** Texto accesible del botón de quitar. */
  removeLabel: string
  /** Aviso de uso bajo los inputs. */
  hint?: string
  /** Texto cuando la lista está vacía. */
  emptyLabel?: string
}>()

interface CashItemValue {
  value: number
  period: number
}

const { fields, push, remove } = useFieldArray<CashItemValue>(() => props.name)

// Inputs locales de captura (no forman parte del schema del formulario).
const draftValue = ref<number | null>(null)
const draftPeriod = ref<number | null>(null)
const error = ref(false)

function add() {
  const value = Number(draftValue.value)
  const period = Number(draftPeriod.value)

  if (
    draftValue.value === null ||
    draftPeriod.value === null ||
    !Number.isFinite(value) ||
    !Number.isFinite(period) ||
    value <= 0 ||
    period < 0
  ) {
    error.value = true
    return
  }

  push({ value, period })
  draftValue.value = null
  draftPeriod.value = null
  error.value = false
}

// Filas para el DataTable (desempaqueta el value del FieldEntry).
function rows() {
  return fields.value.map((f, index) => ({
    index,
    key: f.key,
    value: f.value.value,
    period: f.value.period,
  }))
}
</script>

<template>
  <fieldset class="items">
    <legend>{{ title }}</legend>

    <!-- Captura: dos inputs + botón agregar -->
    <div class="items__form">
      <div class="items__field">
        <label :for="`${name}-value`">{{ valueLabel }}</label>
        <InputNumber
          :input-id="`${name}-value`"
          v-model="draftValue"
          :placeholder="valuePlaceholder"
          locale="es-CO"
          mode="currency"
          currency="COP"
          :max-fraction-digits="2"
          :min-fraction-digits="0"
          fluid
          @keydown.enter.prevent="add"
        />
      </div>
      <div class="items__field">
        <label :for="`${name}-period`">{{ periodLabel }}</label>
        <InputNumber
          :input-id="`${name}-period`"
          v-model="draftPeriod"
          :placeholder="periodPlaceholder"
          locale="es-CO"
          :max-fraction-digits="6"
          :min-fraction-digits="0"
          :use-grouping="false"
          fluid
          @keydown.enter.prevent="add"
        />
      </div>
      <Button
        type="button"
        class="items__add"
        icon="pi pi-plus"
        :label="addLabel"
        severity="secondary"
        @click="add"
      />
    </div>

    <small v-if="hint" class="items__hint" :class="{ 'items__hint--error': error }">
      {{ hint }}
    </small>

    <!-- Tabla de solo visualización -->
    <DataTable :value="rows()" size="small" class="items__table" data-key="key">
      <template #empty>
        <span class="items__empty">{{ emptyLabel ?? '—' }}</span>
      </template>

      <Column header="#" class="items__num">
        <template #body="{ index }">{{ index + 1 }}</template>
      </Column>
      <Column :header="valueLabel">
        <template #body="{ data }">{{ formatMoney(data.value) }}</template>
      </Column>
      <Column :header="periodLabel" field="period" />
      <Column class="items__actions-col">
        <template #body="{ data }">
          <Button
            type="button"
            icon="pi pi-times"
            severity="danger"
            text
            rounded
            size="small"
            :aria-label="removeLabel"
            @click="remove(data.index)"
          />
        </template>
      </Column>
    </DataTable>
  </fieldset>
</template>

<style scoped>
.items {
  margin: 0 0 1.25rem;
  padding: 1rem;
  border: 1px solid var(--p-content-border-color);
  border-radius: var(--p-content-border-radius, 8px);
}

.items legend {
  padding: 0 0.4rem;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--p-text-muted-color);
}

.items__form {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.75rem;
}

.items__field {
  flex: 1 1 120px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.items__field label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--p-text-color);
}

.items__add {
  flex: 0 0 auto;
}

.items__hint {
  display: block;
  margin: 0.5rem 0 0;
  font-size: 0.78rem;
  color: var(--p-text-muted-color);
}

.items__hint--error {
  color: var(--p-red-500, #ef4444);
}

.items__table {
  margin-top: 0.9rem;
}

.items__empty {
  color: var(--p-text-muted-color);
  font-style: italic;
}

:deep(.items__num) {
  width: 3rem;
}

:deep(.items__actions-col) {
  width: 3.5rem;
  text-align: right;
}
</style>
