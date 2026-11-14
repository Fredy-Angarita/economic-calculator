/** Qué lado contiene la incógnita a calcular. */
export type UnknownSide = 'payment' | 'debt'

/** Un movimiento: un valor ubicado en un periodo. */
export interface CashItem {
  /** Monto del movimiento. */
  value: number
  /** Periodo en el que ocurre. */
  period: number
}

export interface ValueEquationInput {
  /** Tasa efectiva por periodo, en porcentaje (ej: 2 para 2%). */
  ratePercent: number
  /** Periodo de la fecha focal (= periodo de la incógnita). */
  focalPeriod: number
  /** Lado donde está la incógnita. */
  unknownSide: UnknownSide
  /** Deudas conocidas. */
  debts: CashItem[]
  /** Pagos conocidos. */
  payments: CashItem[]
}

export interface ValueEquationResult {
  /** Valor de la incógnita (en la fecha focal). */
  unknownValue: number
  /** Total de deudas llevado a la focal. */
  debtsAtFocal: number
  /** Total de pagos llevado a la focal. */
  paymentsAtFocal: number
  /** Tasa efectiva usada (decimal). */
  rate: number
  focalPeriod: number
  unknownSide: UnknownSide
}

export function useValueEquation() {
  /** Lleva un monto desde su periodo hasta la fecha focal. */
  function toFocal(value: number, period: number, focal: number, rate: number): number {
    return value * Math.pow(1 + rate, focal - period)
  }

  /** Suma una lista de movimientos ya trasladados a la fecha focal. */
  function sumAtFocal(items: CashItem[], focal: number, rate: number): number {
    return items.reduce((acc, item) => acc + toFocal(item.value, item.period, focal, rate), 0)
  }


  function solve(input: ValueEquationInput): ValueEquationResult {
    const { ratePercent, focalPeriod, unknownSide, debts, payments } = input
    const rate = ratePercent / 100

    const debtsAtFocal = sumAtFocal(debts, focalPeriod, rate)
    const paymentsAtFocal = sumAtFocal(payments, focalPeriod, rate)

    const unknownValue =
      unknownSide === 'payment'
        ? debtsAtFocal - paymentsAtFocal
        : paymentsAtFocal - debtsAtFocal

    return {
      unknownValue,
      debtsAtFocal,
      paymentsAtFocal,
      rate,
      focalPeriod,
      unknownSide,
    }
  }

  return { solve, toFocal, sumAtFocal }
}
