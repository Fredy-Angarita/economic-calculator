// https://nuxt.com/docs/api/configuration/nuxt-config
import { SlatePreset } from './app/themes/slate'

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@primevue/nuxt-module'],
  css: ['primeicons/primeicons.css', '~/assets/css/main.css'],
  primevue: {
    options: {
      theme: {
        preset: SlatePreset,
        options: {
          // Forzamos modo claro (fondo claro slate-100); sin dark automático.
          darkModeSelector: false,
          cssLayer: {
            name: 'primevue',
            order: 'theme, base, primevue',
          },
        },
      },
    },
  },
})
