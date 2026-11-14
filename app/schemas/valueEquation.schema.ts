// Schema de validación para el módulo de ecuaciones de valor.

import { z } from 'zod'
import { VALIDATION_TEXTS } from '~/constants/texts'
import type { UnknownSide } from '~/composables/useValueEquation'

const unknownSides: [UnknownSide, ...UnknownSide[]] = ['payment', 'debt']

/** Número obligatorio (convierte '' / null a undefined). */
const requiredNumber = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
  z.number({ message: VALIDATION_TEXTS.number })
)

/** Número obligatorio y positivo. */
const positiveNumber = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
  z.number({ message: VALIDATION_TEXTS.number }).positive(VALIDATION_TEXTS.positive)
)

/** Periodo: entero >= 0. */
const periodNumber = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
  z.number({ message: VALIDATION_TEXTS.number }).min(0, VALIDATION_TEXTS.nonNegative)
)

/** Un movimiento: valor (positivo) y periodo (>= 0). */
const cashItemSchema = z.object({
  value: positiveNumber,
  period: periodNumber,
})

export const valueEquationSchema = z.object({
  ratePercent: positiveNumber,
  focalPeriod: periodNumber,
  unknownSide: z.enum(unknownSides),
  debts: z.array(cashItemSchema),
  payments: z.array(cashItemSchema),
})

/** Modelo de datos del formulario de ecuaciones de valor. */
export type ValueEquationModel = z.infer<typeof valueEquationSchema>
