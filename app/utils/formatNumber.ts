// Utilidades de formateo de números y moneda.

const DEFAULT_LOCALE = 'es-CO'
const DEFAULT_CURRENCY = 'COP'

/** Formatea un valor como moneda (por defecto COP). */
export function formatMoney(
  value: number,
  currency: string = DEFAULT_CURRENCY,
  locale: string = DEFAULT_LOCALE
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value)
}

/** Formatea un número con un máximo de decimales. */
export function formatNumber(
  value: number,
  decimals = 4,
  locale: string = DEFAULT_LOCALE
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value)
}

/** Formatea un porcentaje (recibe el valor ya en %, ej: 2 -> "2 %"). */
export function formatPercent(
  value: number,
  decimals = 4,
  locale: string = DEFAULT_LOCALE
): string {
  return `${formatNumber(value, decimals, locale)} %`
}
