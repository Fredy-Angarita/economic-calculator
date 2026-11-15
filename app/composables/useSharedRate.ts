// Tasa compartida entre módulos.
//
// Guarda la última tasa convertida en la sección "Cambio de tasas". Es una tasa
// efectiva por periodo (en porcentaje) de la periodicidad indicada, y todas las
// calculadoras la toman como valor inicial de su campo de tasa.
//
// La tasa se guarda en localStorage para que sobreviva a recargar la página.
// La restauración se hace al montar la app (no durante el render del servidor),
// para evitar diferencias de hidratación.

import { PERIODICITIES, type Periodicity } from './useRateConversion'

export interface SharedRate {
  /** Tasa efectiva por periodo, en porcentaje. */
  valuePercent: number
  /** Periodicidad a la que corresponde la tasa. */
  periodicity: Periodicity
}

const STORAGE_KEY = 'economic-calculator:shared-rate'

function isSharedRate(value: unknown): value is SharedRate {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.valuePercent === 'number' &&
    Number.isFinite(v.valuePercent) &&
    typeof v.periodicity === 'string' &&
    v.periodicity in PERIODICITIES
  )
}

export function useSharedRate() {
  const shared = useState<SharedRate | null>('sharedRate', () => null)

  function set(rate: SharedRate) {
    shared.value = rate
  }

  function clear() {
    shared.value = null
  }

  /** Carga la tasa guardada. Debe llamarse solo en el cliente, tras el montaje. */
  function restore() {
    if (!import.meta.client) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed: unknown = JSON.parse(raw)
      if (isSharedRate(parsed)) shared.value = parsed
    } catch {
      // Dato dañado en localStorage: se ignora.
    }
  }

  /** Guarda (o borra) la tasa en localStorage. */
  function persist(rate: SharedRate | null) {
    if (!import.meta.client) return
    if (rate) localStorage.setItem(STORAGE_KEY, JSON.stringify(rate))
    else localStorage.removeItem(STORAGE_KEY)
  }

  return { shared, set, clear, restore, persist }
}
