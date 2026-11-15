export type RateType = 'effective' | 'nominal'
/** Periodicidades soportadas, con sus periodos por año. */
export const PERIODICITIES = {
  monthly: 12,
  bimonthly: 6, // bimestral
  quarterly: 4, // trimestral
  quarterly4: 3, // cuatrimestral (cada 4 meses -> 3 por año)
  semiannual: 2,
  annual: 1,
} as const

export type Periodicity = keyof typeof PERIODICITIES

export interface RateConversionInput {
  valuePercent: number
  fromType: RateType
  fromPeriodicity: Periodicity
  toType: RateType
  toPeriodicity: Periodicity
}

export interface RateConversionResult {
  /** Tasa convertida al tipo de destino (efectiva o nominal), en porcentaje. */
  valuePercent: number
  /** Tasa convertida en decimal. */
  value: number
  /** Tasa efectiva anual, en porcentaje. */
  effectiveAnnualPercent: number
  /** Tasa efectiva por periodo del destino, en porcentaje (la que usan las calculadoras). */
  effectivePeriodPercent: number
}

export function useRateConversion() {
  function periodsPerYear(p: Periodicity): number {
    return PERIODICITIES[p]
  }

  function convert(input: RateConversionInput): RateConversionResult {
    const { valuePercent, fromType, fromPeriodicity, toType, toPeriodicity } = input

    const mFrom = periodsPerYear(fromPeriodicity)
    const mTo = periodsPerYear(toPeriodicity)
    const rate = valuePercent / 100
    const effectivePeriodFrom = fromType === 'nominal' ? rate / mFrom : rate

    const ea = Math.pow(1 + effectivePeriodFrom, mFrom) - 1
    const effectivePeriodTo = Math.pow(1 + ea, 1 / mTo) - 1
    const result = toType === 'nominal' ? effectivePeriodTo * mTo : effectivePeriodTo

    return {
      value: result,
      valuePercent: result * 100,
      effectiveAnnualPercent: ea * 100,
      effectivePeriodPercent: effectivePeriodTo * 100,
    }
  }

  return { convert, periodsPerYear }
}
