// Constantes de navegación: definen los módulos disponibles en el menú lateral.

import { NAV_TEXTS } from './texts'

export interface NavItem {
  /** Etiqueta visible en el menú. */
  label: string
  /** Ruta de la página. */
  to: string
  /** Clase de icono (primeicons). */
  icon: string
  /** Si el módulo aún no está implementado. */
  disabled?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { label: NAV_TEXTS.rateConversion, to: '/rate-conversion', icon: 'pi pi-percentage' },
  { label: NAV_TEXTS.compoundInterest, to: '/', icon: 'pi pi-chart-line' },
  { label: NAV_TEXTS.valueEquations, to: '/value-equations', icon: 'pi pi-sliders-h' },
  { label: NAV_TEXTS.annuities, to: '/annuities', icon: 'pi pi-calendar' },
  { label: NAV_TEXTS.amortization, to: '/amortization', icon: 'pi pi-chart-bar' },
]
