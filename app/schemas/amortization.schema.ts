// Schema de validación para el módulo de amortización.

import { z } from 'zod'
import { VALIDATION_TEXTS } from '~/constants/texts'

const positiveNumber = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
  z.number({ message: VALIDATION_TEXTS.number }).positive(VALIDATION_TEXTS.positive)
)

const periodNumber = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
  z.number({ message: VALIDATION_TEXTS.number }).min(1, VALIDATION_TEXTS.positive)
)

/** Un abono extraordinario: valor (positivo) y periodo (>= 1). */
const extraPaymentSchema = z.object({
  value: positiveNumber,
  period: periodNumber,
})

export const amortizationSchema = z.object({
  principal: positiveNumber,
  ratePercent: positiveNumber,
  periods: periodNumber,
  extraPayments: z.array(extraPaymentSchema),
})

/** Modelo de datos del formulario de amortización. */
export type AmortizationModel = z.infer<typeof amortizationSchema>
