<script setup lang="ts" generic="T extends string">
interface Option {
  value: T
  label: string
}

defineProps<{
  label: string
  options: Option[]
}>()

// v-model tipado.
const model = defineModel<T>({ required: true })
</script>

<template>
  <div class="field">
    <label>{{ label }}</label>
    <select v-model="model">
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
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

select {
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--color-input-border);
  border-radius: var(--radius-sm);
  font-size: 1rem;
  background: var(--color-input-bg);
  color: var(--color-text-invert);
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}

select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-input-focus);
}

select option {
  background: var(--color-app-bg);
  color: var(--color-text-invert);
}
</style>
