<script setup lang="ts">
import { computed } from 'vue'
import { useField } from 'vee-validate'

const props = withDefaults(
  defineProps<{
    /** Nombre del campo, debe coincidir con el schema de vee-validate. */
    name: string
    label: string
    placeholder?: string
    /** 'number' usa InputNumber; cualquier otro usa InputText. */
    type?: string
    /** Oculta visualmente el label (se mantiene para accesibilidad). */
    hideLabel?: boolean
    /** Decimales máximos para InputNumber. */
    maxFractionDigits?: number
    /** Formatea como moneda (modo currency de PrimeVue). */
    money?: boolean
    /** Locale para separadores (coma decimal con es-CO). */
    locale?: string
    /** Código ISO de moneda cuando money=true. */
    currency?: string
  }>(),
  {
    placeholder: '',
    type: 'text',
    hideLabel: false,
    maxFractionDigits: 6,
    money: false,
    locale: 'es-CO',
    currency: 'COP',
  }
)

const isNumber = computed(() => props.type === 'number' || props.money)

// useField conecta este input con el useForm del componente padre.
const { value, errorMessage, handleBlur, handleChange } = useField<string | number | null>(
  () => props.name
)
</script>

<template>
  <div class="field" :class="{ 'field--error': errorMessage }">
    <label :for="name" :class="{ 'sr-only': hideLabel }">{{ label }}</label>

    <InputNumber
      v-if="isNumber"
      :input-id="name"
      :model-value="(value as number | null) ?? null"
      :placeholder="placeholder"
      :locale="locale"
      :mode="money ? 'currency' : 'decimal'"
      :currency="money ? currency : undefined"
      :max-fraction-digits="money ? 2 : maxFractionDigits"
      :min-fraction-digits="0"
      :invalid="!!errorMessage"
      :use-grouping="money"
      fluid
      @update:model-value="handleChange"
      @blur="handleBlur"
    />
    <InputText
      v-else
      :id="name"
      :model-value="(value as string | null) ?? ''"
      :placeholder="placeholder"
      :invalid="!!errorMessage"
      fluid
      @update:model-value="handleChange"
      @blur="handleBlur"
    />

    <small v-if="errorMessage" :id="`${name}-error`" class="field__error" role="alert">
      {{ errorMessage }}
    </small>
  </div>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1rem;
}

label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--p-text-color);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.field__error {
  color: var(--p-red-500, #ef4444);
  font-size: 0.8rem;
}
</style>
