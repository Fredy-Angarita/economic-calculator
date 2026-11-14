// Schema de validación para el conversor de tasas.

import { z } from 'zod'
import { VALIDATION_TEXTS } from '~/constants/texts'
import { PERIODICITIES, type RateType, type Periodicity } from '~/composables/useRateConversion'

const periodicityKeys = Object.keys(PERIODICITIES) as [Periodicity, ...Periodicity[]]
const rateTypes: [RateType, ...RateType[]] = ['effective', 'nominal']

export const rateConversionSchema = z.object({
  valuePercent: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number({ message: VALIDATION_TEXTS.number }).positive(VALIDATION_TEXTS.positive)
  ),
  fromType: z.enum(rateTypes),
  fromPeriodicity: z.enum(periodicityKeys),
  toType: z.enum(rateTypes),
  toPeriodicity: z.enum(periodicityKeys),
})

/** Modelo de datos del formulario de conversión de tasas. */
export type RateConversionModel = z.infer<typeof rateConversionSchema>
