// Utilidades para formateo de fechas.

const DEFAULT_LOCALE = 'es-CO'

export function formatDate(
  date: Date | string | number,
  locale: string = DEFAULT_LOCALE,
  options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }
): string {
  const value = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(value.getTime())) return ''
  return new Intl.DateTimeFormat(locale, options).format(value)
}

export function formatDateTime(
  date: Date | string | number,
  locale: string = DEFAULT_LOCALE
): string {
  return formatDate(date, locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
  
export function toISODate(date: Date | string | number): string {
  const value = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(value.getTime())) return ''
  return value.toISOString().split('T')[0] ?? ''
}
