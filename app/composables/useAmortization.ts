export interface ExtraPayment {
  period: number
  value: number
}

export interface AmortizationInput {
  /** Monto del préstamo (principal). */
  principal: number
  /** Tasa efectiva por periodo, en porcentaje. */
  ratePercent: number
  /** Número de periodos. */
  periods: number
  /** Abonos extraordinarios a capital. */
  extraPayments?: ExtraPayment[]
  /**
   * Efecto de los abonos extra:
   *  - 'reducePayment': se mantiene el plazo y se RECALCULA (baja) la cuota.
   *  - 'reduceTerm':    se mantiene la cuota y se acorta el PLAZO.
   */
  mode?: AmortizationMode
}

export type AmortizationMode = 'reducePayment' | 'reduceTerm'

export interface AmortizationRow {
  period: number
  /** Cuota del periodo (fija entre recálculos). */
  payment: number
  interest: number
  /** Abono a capital por la cuota. */
  principalPaid: number
  /** Abono extraordinario aplicado en este periodo (0 si no hay). */
  extra: number
  /** Saldo tras el periodo. */
  balance: number
}

export interface AmortizationResult {
  /** Cuota inicial. */
  initialPayment: number
  rows: AmortizationRow[]
  /** Suma de intereses pagados. */
  totalInterest: number
  /** Suma de abonos extraordinarios. */
  totalExtra: number
  /** Total pagado (cuotas + abonos extra). */
  totalPaid: number
}

export function useAmortization() {
  /** Cuota de un préstamo: saldo·i / (1 − (1+i)^−m). */
  function payment(balance: number, i: number, m: number): number {
    if (m <= 0) return balance
    if (i === 0) return balance / m
    return (balance * i) / (1 - Math.pow(1 + i, -m))
  }

  function build(input: AmortizationInput): AmortizationResult {
    const P = input.principal
    const i = input.ratePercent / 100
    const n = input.periods
    const mode: AmortizationMode = input.mode ?? 'reducePayment'

    if (!Number.isFinite(P) || P <= 0) throw new Error('El préstamo debe ser mayor que 0.')
    if (i <= -1) throw new Error('La tasa debe ser mayor que -100%.')
    if (!Number.isFinite(n) || n <= 0) throw new Error('El número de periodos debe ser mayor que 0.')

    // Mapa periodo -> suma de abonos extra en ese periodo.
    const extraByPeriod = new Map<number, number>()
    for (const e of input.extraPayments ?? []) {
      const p = Math.round(e.period)
      extraByPeriod.set(p, (extraByPeriod.get(p) ?? 0) + e.value)
    }

    const rows: AmortizationRow[] = []
    let balance = P
    let currentPayment = payment(balance, i, n)
    const initialPayment = currentPayment
    let totalInterest = 0
    let totalExtra = 0
    let totalPaid = 0

    const EPS = 1e-6

    for (let period = 1; period <= n && balance > EPS; period++) {
      const interest = balance * i
      let principalPaid = currentPayment - interest

      // No amortizar más que el saldo con la cuota.
      if (principalPaid > balance) {
        principalPaid = balance
        currentPayment = interest + principalPaid
      }

      balance -= principalPaid

      // Abono extraordinario de este periodo.
      const extra = extraByPeriod.get(period) ?? 0
      let appliedExtra = 0
      if (extra > 0 && balance > EPS) {
        appliedExtra = Math.min(extra, balance)
        balance -= appliedExtra
      }

      totalInterest += interest
      totalExtra += appliedExtra
      totalPaid += currentPayment + appliedExtra

      rows.push({
        period,
        payment: currentPayment,
        interest,
        principalPaid,
        extra: appliedExtra,
        balance: balance < EPS ? 0 : balance,
      })
      const periodsLeft = n - period
      if (mode === 'reducePayment' && appliedExtra > 0 && balance > EPS && periodsLeft > 0) {
        currentPayment = payment(balance, i, periodsLeft)
      }
    }

    return {
      initialPayment,
      rows,
      totalInterest,
      totalExtra,
      totalPaid,
    }
  }

  return { build, payment }
}
