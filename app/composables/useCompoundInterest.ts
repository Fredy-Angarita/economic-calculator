export type CompoundTarget = 'futureValue' | 'presentValue' | 'rate' | 'periods'

export interface CompoundInterestInput {
  /** Valor presente (VP). */
  presentValue?: number | null
  /** Valor futuro (VF). */
  futureValue?: number | null
  /** Tasa de interés efectiva por periodo, en porcentaje (ej: 2 para 2%). */
  ratePercent?: number | null
  /** Número de periodos (n). */
  periods?: number | null
}

export interface CompoundInterestResult {
  presentValue: number
  futureValue: number
  rate: number
  ratePercent: number
  periods: number
  interest: number
}

export function useCompoundInterest() {
  function solve(
    target: CompoundTarget,
    input: CompoundInterestInput
  ): CompoundInterestResult {
    const vp = toNumber(input.presentValue)
    const vf = toNumber(input.futureValue)
    const ratePercent = toNumber(input.ratePercent)
    const i = ratePercent != null ? ratePercent / 100 : null
    const n = toNumber(input.periods)

    let presentValue: number
    let futureValue: number
    let rate: number
    let periods: number

    switch (target) {
      case 'futureValue': {
        requireValues({ vp, i, n })
        presentValue = vp!
        rate = i!
        periods = n!
        futureValue = presentValue * Math.pow(1 + rate, periods)
        break
      }
      case 'presentValue': {
        requireValues({ vf, i, n })
        futureValue = vf!
        rate = i!
        periods = n!
        presentValue = futureValue / Math.pow(1 + rate, periods)
        break
      }
      case 'rate': {
        requireValues({ vp, vf, n })
        if (vp! <= 0) throw new Error('El valor presente debe ser mayor que 0.')
        presentValue = vp!
        futureValue = vf!
        periods = n!
        rate = Math.pow(futureValue / presentValue, 1 / periods) - 1
        break
      }
      case 'periods': {
        requireValues({ vp, vf, i })
        if (vp! <= 0) throw new Error('El valor presente debe ser mayor que 0.')
        if (i! <= -1) throw new Error('La tasa debe ser mayor que -100%.')
        if (i! === 0) throw new Error('La tasa no puede ser 0 para calcular periodos.')
        presentValue = vp!
        futureValue = vf!
        rate = i!
        periods = Math.log(futureValue / presentValue) / Math.log(1 + rate)
        break
      }
      default:
        throw new Error('Variable objetivo no válida.')
    }

    return {
      presentValue,
      futureValue,
      rate,
      ratePercent: rate * 100,
      periods,
      interest: futureValue - presentValue,
    }
  }

  return { solve }
}

/** Convierte a número o null si no es un valor numérico válido. */
function toNumber(value: number | null | undefined): number | null {
  if (value == null) return null
  return Number.isFinite(value) ? value : null
}

/** Verifica que todos los valores requeridos estén presentes. */
function requireValues(values: Record<string, number | null | undefined>): void {
  for (const [key, value] of Object.entries(values)) {
    if (value == null) {
      throw new Error(`Falta el valor requerido: ${labelFor(key)}.`)
    }
  }
}

function labelFor(key: string): string {
  const labels: Record<string, string> = {
    vp: 'valor presente',
    vf: 'valor futuro',
    i: 'tasa de interés',
    n: 'número de periodos',
  }
  return labels[key] ?? key
}
