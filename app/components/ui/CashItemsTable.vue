<script setup lang="ts">
// Lista de movimientos (valor + periodo) con captura mediante DOS inputs
// y un botón "Agregar". La tabla únicamente MUESTRA lo agregado y permite
// quitar filas. Se conecta al formulario de vee-validate del padre por `name`.

import { ref } from 'vue'
import { useFieldArray } from 'vee-validate'
import { formatNumber } from '~/utils/formatNumber'

const props = defineProps<{
  /** Título de la sección (ej: "Deudas"). */
  title: string
  /** Nombre del array en el formulario (ej: "debts"). */
  name: string
  /** Encabezado/label de la columna de valor. */
  valueLabel: string
  valuePlaceholder?: string
  /** Encabezado/label de la columna de periodo. */
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

  // Validación mínima: valor > 0 y periodo >= 0.
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
</script>

<template>
  <fieldset class="items">
    <legend>{{ title }}</legend>

    <!-- Captura: dos inputs + botón agregar -->
    <div class="items__form">
      <div class="items__field">
        <label :for="`${name}-value`">{{ valueLabel }}</label>
        <input
          :id="`${name}-value`"
          v-model.number="draftValue"
          type="number"
          step="any"
          :placeholder="valuePlaceholder"
          @keydown.enter.prevent="add"
        />
      </div>
      <div class="items__field">
        <label :for="`${name}-period`">{{ periodLabel }}</label>
        <input
          :id="`${name}-period`"
          v-model.number="draftPeriod"
          type="number"
          step="any"
          :placeholder="periodPlaceholder"
          @keydown.enter.prevent="add"
        />
      </div>
      <button type="button" class="items__add" @click="add">+ {{ addLabel }}</button>
    </div>

    <p v-if="hint" class="items__hint" :class="{ 'items__hint--error': error }">
      {{ hint }}
    </p>

    <!-- Tabla de solo visualización -->
    <table class="items__table">
      <thead>
        <tr>
          <th class="items__num">#</th>
          <th>{{ valueLabel }}</th>
          <th>{{ periodLabel }}</th>
          <th class="items__actions-col"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="fields.length === 0" class="items__empty">
          <td colspan="4">{{ emptyLabel ?? '—' }}</td>
        </tr>
        <tr v-for="(field, idx) in fields" :key="field.key">
          <td class="items__num">{{ idx + 1 }}</td>
          <td>{{ formatNumber(field.value.value, 2) }}</td>
          <td>{{ field.value.period }}</td>
          <td class="items__actions-col">
            <button
              type="button"
              class="items__remove"
              :aria-label="removeLabel"
              @click="remove(idx)"
            >
              ✕
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </fieldset>
</template>

<style scoped>
.items {
  margin: 0 0 1.25rem;
  padding: 1rem;
  border: 1px solid var(--color-card-border);
  border-radius: var(--radius-sm);
}

.items legend {
  padding: 0 0.4rem;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
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
  color: var(--color-text-soft);
}

.items__field input {
  padding: 0.55rem 0.7rem;
  border: 1px solid var(--color-input-border);
  border-radius: var(--radius-sm);
  background: var(--color-input-bg);
  color: var(--color-text-invert);
  font-size: 1rem;
}

.items__field input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-input-focus);
}

.items__add {
  flex: 0 0 auto;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.items__add:hover {
  background: var(--color-primary-hover);
}

.items__hint {
  margin: 0.5rem 0 0;
  font-size: 0.78rem;
  color: var(--color-text-muted);
}

.items__hint--error {
  color: #fca5a5;
}

.items__table {
  width: 100%;
  margin-top: 0.9rem;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.items__table th {
  text-align: left;
  padding: 0.4rem 0.5rem;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-card-border);
}

.items__table td {
  padding: 0.45rem 0.5rem;
  color: var(--color-text-soft);
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  font-variant-numeric: tabular-nums;
}

.items__num {
  width: 2rem;
  color: var(--color-text-muted);
}

.items__actions-col {
  width: 2.4rem;
  text-align: right;
}

.items__empty td {
  text-align: center;
  color: var(--color-text-muted);
  font-style: italic;
  padding: 0.75rem;
}

.items__remove {
  width: 1.9rem;
  height: 1.9rem;
  border: 1px solid var(--color-input-border);
  border-radius: var(--radius-sm);
  background: rgba(239, 68, 68, 0.12);
  color: #fca5a5;
  cursor: pointer;
  font-size: 0.8rem;
}

.items__remove:hover {
  background: rgba(239, 68, 68, 0.22);
}
</style>
