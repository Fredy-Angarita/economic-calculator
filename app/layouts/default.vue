<script setup lang="ts">
</script>

<template>
  <div class="layout">
    <LayoutTheSidebar />
    <div class="layout__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  background: var(--color-app-bg);
}

.layout__content {
  margin-left: var(--sidebar-width);
  min-height: 100vh;
  min-width: 0;
  background:
    radial-gradient(1200px 400px at 100% -10%, rgba(59, 130, 246, 0.12), transparent),
    var(--color-app-bg);
}

@media (max-width: 768px) {
  .layout__content {
    margin-left: 0;
  }
}
</style>
