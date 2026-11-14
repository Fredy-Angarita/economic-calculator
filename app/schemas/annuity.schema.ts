// Schema de validación para el módulo de anualidades.
// kind y target se manejan fuera del formulario (refs locales) y se pasan a la
// factory; aquí solo validamos los campos numéricos según esos valores.

import { z } from 'zod'
import { VALIDATION_TEXTS } from '~/constants/texts'
import type { AnnuityKind, AnnuityTarget } from '~/composables/useAnnuity'

const optionalNumber = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
  z.number({ message: VALIDATION_TEXTS.number }).optional()
)

const baseSchema = z.object({
  ratePercent: optionalNumber,
  periods: optionalNumber,
  payment: optionalNumber,
  presentValue: optionalNumber,
  futureValue: optionalNumber,
  deferralPeriods: optionalNumber,
})

type BaseValues = z.infer<typeof baseSchema>

/** Campos siempre requeridos (además de los condicionales por target). */
const ALWAYS_REQUIRED: (keyof BaseValues)[] = ['ratePercent', 'periods']

export function annuitySchema(target: AnnuityTarget, kind: AnnuityKind) {
  return baseSchema.superRefine((values, ctx) => {
    const required: (keyof BaseValues)[] = [...ALWAYS_REQUIRED]

    // Según lo que se calcula, pedimos los datos de entrada necesarios.
    if (target === 'presentValue' || target === 'futureValue') {
      required.push('payment')
    } else if (target === 'payment') {
      // Para hallar el pago se necesita VP o VF (uno de los dos).
      if (values.presentValue == null && values.futureValue == null) {
        ctx.addIssue({
          code: 'custom',
          path: ['presentValue'],
          message: VALIDATION_TEXTS.required,
        })
      }
    }

    // Validación de campos requeridos positivos (> 0).
    for (const field of required) {
      const value = values[field]
      if (value === undefined || Number.isNaN(value as number)) {
        ctx.addIssue({ code: 'custom', path: [field], message: VALIDATION_TEXTS.required })
        continue
      }
      if ((value as number) <= 0) {
        ctx.addIssue({ code: 'custom', path: [field], message: VALIDATION_TEXTS.positive })
      }
    }

    // 'deferred' exige periodos de gracia (k >= 0, puede ser 0).
    if (kind === 'deferred') {
      const k = values.deferralPeriods
      if (k === undefined || Number.isNaN(k as number)) {
        ctx.addIssue({
          code: 'custom',
          path: ['deferralPeriods'],
          message: VALIDATION_TEXTS.required,
        })
      } else if ((k as number) < 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['deferralPeriods'],
          message: VALIDATION_TEXTS.nonNegative,
        })
      }
    }
  })
}

export const annuityModelSchema = baseSchema

export type AnnuityModel = z.infer<typeof baseSchema>
