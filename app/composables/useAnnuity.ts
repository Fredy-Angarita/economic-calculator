// Composable para anualidades (serie uniforme de pagos A).
//
// Tipos:
//   - ordinary (vencida):   pagos al FINAL de cada periodo.
//   - due (anticipada):      pagos al INICIO de cada periodo.
//   - deferred (diferida):   los pagos comienzan tras un periodo de gracia de
//                            k periodos. Es una anualidad vencida cuyo valor
//                            presente se descuenta k periodos.
//
// Fórmulas (tasa i por periodo, n pagos, pago A):
//   Vencida:
//     VP = A · (1 − (1 + i)^(−n)) / i
//     VF = A · ((1 + i)^n − 1) / i
//   Anticipada: VP y VF de la vencida multiplicados por (1 + i).
//   Diferida (k periodos de gracia):
//     VP = A · (1 − (1 + i)^(−n)) / i · (1 + i)^(−k)
//     VF = A · ((1 + i)^n − 1) / i     (igual que la vencida al final del
//                                       último pago; el diferimiento solo
//                                       afecta al valor presente)

export type AnnuityKind = 'ordinary' | 'due' | 'deferred'
export type AnnuityTarget = 'presentValue' | 'futureValue' | 'payment'

export interface AnnuityInput {
  kind: AnnuityKind
  target: AnnuityTarget
  /** Tasa efectiva por periodo, en porcentaje. */
  ratePercent: number
  /** Número de pagos. */
  periods: number
  /** Pago por periodo (A). */
  payment?: number | null
  presentValue?: number | null
  futureValue?: number | null
  /** Solo 'deferred': periodos de gracia / aplazamiento (k). */
  deferralPeriods?: number | null
}

export interface AnnuityResult {
  presentValue: number
  futureValue: number
  payment: number
  periods: number
  /** Tasa efectiva por periodo (decimal) usada. */
  ratePerPayment: number
  kind: AnnuityKind
}

export function useAnnuity() {
  /** Factor de valor presente de una anualidad vencida: (1 − (1+i)^−n)/i. */
  function pvFactor(i: number, n: number): number {
    return (1 - Math.pow(1 + i, -n)) / i
  }

  /** Factor de valor futuro de una anualidad vencida: ((1+i)^n − 1)/i. */
  function fvFactor(i: number, n: number): number {
    return (Math.pow(1 + i, n) - 1) / i
  }

  function solve(input: AnnuityInput): AnnuityResult {
    const { kind, target, periods: n } = input

    if (!Number.isFinite(n) || n <= 0) {
      throw new Error('El número de pagos debe ser mayor que 0.')
    }

    const i = input.ratePercent / 100
    if (i <= -1) throw new Error('La tasa debe ser mayor que -100%.')
    if (i === 0) throw new Error('La tasa no puede ser 0.')

    let pvAdj = 1
    if (kind === 'due') {
      pvAdj = 1 + i
    } else if (kind === 'deferred') {
      const k = input.deferralPeriods
      if (k == null || !Number.isFinite(k) || k < 0) {
        throw new Error('Indica los periodos de gracia (k) de la anualidad diferida.')
      }
      pvAdj = Math.pow(1 + i, -k)
    }

    // El valor futuro solo se ajusta en la anticipada.
    const fvAdj = kind === 'due' ? 1 + i : 1

    const pvF = pvFactor(i, n) * pvAdj
    const fvF = fvFactor(i, n) * fvAdj

    let payment: number
    let presentValue: number
    let futureValue: number

    switch (target) {
      case 'presentValue':
      case 'futureValue': {
        payment = requirePositive(input.payment, 'pago')
        presentValue = payment * pvF
        futureValue = payment * fvF
        break
      }
      case 'payment': {
        if (input.presentValue != null) {
          presentValue = requirePositive(input.presentValue, 'valor presente')
          payment = presentValue / pvF
          futureValue = payment * fvF
        } else if (input.futureValue != null) {
          futureValue = requirePositive(input.futureValue, 'valor futuro')
          payment = futureValue / fvF
          presentValue = payment * pvF
        } else {
          throw new Error('Ingresa el valor presente o el valor futuro para hallar el pago.')
        }
        break
      }
      default:
        throw new Error('Variable objetivo no válida.')
    }

    return {
      presentValue,
      futureValue,
      payment,
      periods: n,
      ratePerPayment: i,
      kind,
    }
  }

  return { solve, pvFactor, fvFactor }
}

function requirePositive(value: number | null | undefined, label: string): number {
  if (value == null || !Number.isFinite(value) || value <= 0) {
    throw new Error(`Ingresa un ${label} válido (mayor que 0).`)
  }
  return value
}
