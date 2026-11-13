// Preset de tema PrimeVue basado en Aura, con paleta Slate (Tailwind).
// - primary: escala slate (acentos/botones coherentes con el diseño).
// - surface: escala slate (fondos, bordes, tarjetas).

import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'

// Escala Slate de Tailwind.
const slate = {
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
  950: '#020617',
}

export const SlatePreset = definePreset(Aura, {
  semantic: {
    primary: slate,
    colorScheme: {
      light: {
        surface: slate,
      },
      dark: {
        surface: slate,
      },
    },
  },
})

export default SlatePreset
