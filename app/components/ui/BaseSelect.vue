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
    <Select
      v-model="model"
      :options="options"
      option-label="label"
      option-value="value"
      fluid
    />
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
</style>
