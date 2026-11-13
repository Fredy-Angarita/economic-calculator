<script setup lang="ts">
import { computed } from 'vue'
import type { MenuItem } from 'primevue/menuitem'
import { NAV_ITEMS } from '~/constants/navigation'
import { APP_TEXTS } from '~/constants/texts'

// Mapea los módulos a items del Menu de PrimeVue.
const menuItems = computed<MenuItem[]>(() => [
  { label: 'Módulos', items: NAV_ITEMS.map(toMenuItem) },
])

function toMenuItem(item: (typeof NAV_ITEMS)[number]): MenuItem {
  return {
    label: item.label,
    icon: item.icon,
    route: item.disabled ? undefined : item.to,
    disabled: item.disabled,
  }
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__brand">
      <span class="sidebar__brand-icon pi pi-calculator" />
      <p class="sidebar__title">{{ APP_TEXTS.title }}</p>
    </div>

    <Menu :model="menuItems" class="sidebar__menu">
      <!-- Render de cada item con NuxtLink para navegación SPA. -->
      <template #item="{ item, props }">
        <NuxtLink
          v-if="item.route"
          v-slot="{ href, navigate, isActive }"
          :to="item.route"
          custom
        >
          <a
            :href="href"
            v-bind="props.action"
            :class="{ 'sidebar__item--active': isActive }"
            @click="navigate"
          >
            <span :class="item.icon" />
            <span class="p-menu-item-label">{{ item.label }}</span>
          </a>
        </NuxtLink>
        <span v-else class="sidebar__item--disabled" v-bind="props.action">
          <span :class="item.icon" />
          <span class="p-menu-item-label">{{ item.label }}</span>
          <span class="sidebar__badge">Pronto</span>
        </span>
      </template>
    </Menu>

    <footer class="sidebar__footer" />
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--p-slate-950);
  border-right: 1px solid var(--p-slate-800);
  padding: 1.25rem 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow-y: auto;
  z-index: 10;
}

.sidebar__brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.25rem 0.5rem 1rem;
  border-bottom: 1px solid var(--p-slate-800);
}

.sidebar__brand-icon {
  font-size: 1.5rem;
  color: var(--p-slate-100);
}

.sidebar__title {
  color: var(--p-slate-50);
  font-weight: 700;
  font-size: 1.05rem;
  margin: 0;
}

.sidebar__menu {
  flex: 1;
  background: transparent;
  border: none;
  width: 100%;
}

/* El Menu de PrimeVue sobre fondo oscuro: ajustamos colores. */
:deep(.p-menu) {
  background: transparent;
  border: none;
  color: var(--p-slate-300);
}

:deep(.p-menu-submenu-label) {
  background: transparent;
  color: var(--p-slate-500);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

:deep(.p-menu-item-link),
.sidebar__item--disabled {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.8rem;
  border-radius: 8px;
  color: var(--p-slate-300);
  text-decoration: none;
  cursor: pointer;
}

/* Neutraliza el hover/focus del tema (que oscurecía el texto hasta hacerlo
   desaparecer sobre el fondo oscuro). Mantenemos un hover sutil legible. */
:deep(.p-menu-item-content:hover),
:deep(.p-menu-item.p-focus > .p-menu-item-content) {
  background: var(--p-slate-800);
  color: var(--p-slate-100);
}

:deep(.p-menu-item-content:hover .p-menu-item-link),
:deep(.p-menu-item-content:hover .p-menu-item-link *),
:deep(.p-menu-item.p-focus .p-menu-item-link),
:deep(.p-menu-item.p-focus .p-menu-item-link *) {
  color: var(--p-slate-100) !important;
  background: transparent;
  box-shadow: none;
}

.sidebar__item--active {
  background: var(--p-slate-800) !important;
  color: var(--p-slate-50) !important;
  box-shadow: inset 3px 0 0 var(--p-slate-400);
}

.sidebar__item--disabled {
  color: var(--p-slate-600);
  cursor: not-allowed;
}

.sidebar__badge {
  margin-left: auto;
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  background: var(--p-slate-800);
  color: var(--p-slate-400);
}

.sidebar__footer {
  min-height: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--p-slate-800);
}

@media (max-width: 768px) {
  .sidebar {
    position: static;
    width: 100%;
    height: auto;
    overflow-y: visible;
  }
}
</style>
