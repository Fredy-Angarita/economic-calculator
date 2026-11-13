<script setup lang="ts">
import { useField } from 'vee-validate'

const props = withDefaults(
  defineProps<{
    /** Nombre del campo, debe coincidir con el schema de vee-validate. */
    name: string
    label: string
    placeholder?: string
    type?: string
    /** step para inputs numéricos. */
    step?: string
  }>(),
  {
    placeholder: '',
    type: 'text',
    step: 'any',
  }
)

// useField conecta este input con el useForm del componente padre.
const { value, errorMessage, handleBlur, handleChange } = useField<string | number | null>(
  () => props.name
)
</script>

<template>
  <div class="field" :class="{ 'field--error': errorMessage }">
    <label :for="name">{{ label }}</label>
    <input
      :id="name"
      :name="name"
      :type="type"
      :step="type === 'number' ? step : undefined"
      :placeholder="placeholder"
      :value="value"
      :aria-invalid="!!errorMessage"
      :aria-describedby="errorMessage ? `${name}-error` : undefined"
      @input="handleChange"
      @blur="handleBlur"
    />
    <p v-if="errorMessage" :id="`${name}-error`" class="field__error" role="alert">
      {{ errorMessage }}
    </p>
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
  color: var(--color-text-soft);
}

input {
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--color-input-border);
  border-radius: var(--radius-sm);
  font-size: 1rem;
  background: var(--color-input-bg);
  color: var(--color-text-invert);
  transition: border-color 0.15s, box-shadow 0.15s;
}

input::placeholder {
  color: var(--color-text-muted);
}

input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-input-focus);
}

.field--error input {
  border-color: var(--color-danger);
}

.field--error input:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

.field__error {
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-danger-text);
}
</style>
