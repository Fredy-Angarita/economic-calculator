<script setup lang="ts">
import type { NavItem } from '~/constants/navigation'

defineProps<{ item: NavItem }>()
</script>

<template>
  <li class="sidebar-link">
    <span v-if="item.disabled" class="sidebar-link__content sidebar-link__content--disabled">
      <span class="sidebar-link__icon">{{ item.icon }}</span>
      <span class="sidebar-link__label">{{ item.label }}</span>
      <span class="sidebar-link__badge">Pronto</span>
    </span>
    <NuxtLink
      v-else
      :to="item.to"
      class="sidebar-link__content"
      active-class="sidebar-link__content--active"
    >
      <span class="sidebar-link__icon">{{ item.icon }}</span>
      <span class="sidebar-link__label">{{ item.label }}</span>
    </NuxtLink>
  </li>
</template>

<style scoped>
.sidebar-link {
  list-style: none;
}

.sidebar-link__content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.9rem;
  border-radius: var(--radius-sm);
  color: var(--color-sidebar-item);
  text-decoration: none;
  font-size: 0.95rem;
  transition: background 0.15s, color 0.15s, box-shadow 0.15s;
}

.sidebar-link__content:hover {
  background: var(--color-sidebar-item-hover-bg);
  color: var(--color-text-soft);
}

.sidebar-link__content--active {
  background: var(--color-sidebar-item-active-bg);
  color: var(--color-sidebar-item-active-text);
  box-shadow: inset 3px 0 0 var(--color-primary);
}

.sidebar-link__content--disabled {
  color: var(--color-text-muted);
  cursor: not-allowed;
}

.sidebar-link__content--disabled:hover {
  background: transparent;
  color: var(--color-text-muted);
}

.sidebar-link__icon {
  font-size: 1.1rem;
}

.sidebar-link__label {
  flex: 1;
}

.sidebar-link__badge {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.1rem 0.4rem;
  border-radius: 999px;
  background: #334155;
  color: #94a3b8;
}
</style>
