import { NAV_TEXTS } from './texts'

export interface NavItem {
  label: string
  to: string
  icon: string
  disabled?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { label: NAV_TEXTS.compoundInterest, to: '/', icon: '📈' },
  { label: NAV_TEXTS.valueEquations, to: '/ecuaciones-de-valor', icon: '⚖️', disabled: true },
  { label: NAV_TEXTS.annuities, to: '/anualidades', icon: '📅', disabled: true },
  { label: NAV_TEXTS.amortization, to: '/amortizacion', icon: '📊', disabled: true },
]
