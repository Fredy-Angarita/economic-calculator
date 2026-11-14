import { z } from 'zod'
import { VALIDATION_TEXTS } from '~/constants/texts'
import type { CompoundTarget } from '~/composables/useCompoundInterest'

const optionalNumber = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
  z.number({ message: VALIDATION_TEXTS.number }).optional()
)

const baseSchema = z.object({
  presentValue: optionalNumber,
  futureValue: optionalNumber,
  ratePercent: optionalNumber,
  periods: optionalNumber,
})

type BaseValues = z.infer<typeof baseSchema>

const REQUIRED_FIELDS: Record<CompoundTarget, (keyof BaseValues)[]> = {
  futureValue: ['presentValue', 'ratePercent', 'periods'],
  presentValue: ['futureValue', 'ratePercent', 'periods'],
  rate: ['presentValue', 'futureValue', 'periods'],
  periods: ['presentValue', 'futureValue', 'ratePercent'],
}

const POSITIVE_FIELDS: Partial<Record<CompoundTarget, (keyof BaseValues)[]>> = {
  futureValue: ['periods'],
  presentValue: ['periods'],
  rate: ['presentValue', 'periods'],
  periods: ['presentValue'],
}

export function compoundInterestSchema(target: CompoundTarget) {
  return baseSchema.superRefine((values, ctx) => {
    const required = REQUIRED_FIELDS[target]
    const positives = POSITIVE_FIELDS[target] ?? []

    for (const field of required) {
      const value = values[field]

      if (value === undefined || Number.isNaN(value)) {
        ctx.addIssue({
          code: 'custom',
          path: [field],
          message: VALIDATION_TEXTS.required,
        })
        continue
      }

      if (positives.includes(field) && value <= 0) {
        const message =
          field === 'presentValue'
            ? VALIDATION_TEXTS.presentValuePositive
            : VALIDATION_TEXTS.positive
        ctx.addIssue({ code: 'custom', path: [field], message })
      }

      if (target === 'periods' && field === 'ratePercent' && value === 0) {
        ctx.addIssue({
          code: 'custom',
          path: [field],
          message: VALIDATION_TEXTS.rateNonZero,
        })
      }
    }
  })
}

export const compoundInterestModelSchema = baseSchema

export type CompoundInterestModel = z.infer<typeof baseSchema>
