<script setup lang="ts">
import { NAV_ITEMS } from '~/constants/navigation'
import { APP_TEXTS } from '~/constants/texts'
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__brand">
      <span class="sidebar__brand-icon">🧮</span>
      <div>
        <p class="sidebar__title">{{ APP_TEXTS.title }}</p>
      </div>
    </div>

    <nav class="sidebar__nav">
      <p class="sidebar__section">Módulos</p>
      <ul>
        <LayoutSidebarLink v-for="item in NAV_ITEMS" :key="item.to" :item="item" />
      </ul>
    </nav>

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
  background: var(--color-sidebar-bg);
  border-right: 1px solid var(--color-sidebar-border);
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  overflow-y: auto;
  z-index: 10;
}

/* Efecto glass: solo cuando el navegador soporta backdrop-filter. */
@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .sidebar {
    background: var(--color-sidebar-glass);
    -webkit-backdrop-filter: blur(var(--blur-glass));
    backdrop-filter: blur(var(--blur-glass));
  }
}

.sidebar__brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.25rem 0.5rem 1.25rem;
  border-bottom: 1px solid var(--color-sidebar-border);
}

.sidebar__brand-icon {
  font-size: 1.75rem;
  filter: drop-shadow(0 2px 6px rgba(59, 130, 246, 0.4));
}

.sidebar__title {
  color: var(--color-text-invert);
  font-weight: 700;
  font-size: 1.05rem;
}

.sidebar__nav {
  flex: 1;
}

.sidebar__section {
  padding: 0 0.9rem;
  margin-bottom: 0.5rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-sidebar-label);
}

.sidebar__nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sidebar__footer {
  min-height: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-sidebar-border);
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
