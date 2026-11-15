<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useSharedRate } from '~/composables/useSharedRate'

// Restaura la tasa compartida guardada y la mantiene sincronizada con localStorage.
const { shared, restore, persist } = useSharedRate()

onMounted(() => {
  restore()
  watch(shared, (rate) => persist(rate), { deep: true })
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
