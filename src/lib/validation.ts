import { z } from 'zod'

export const userCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Wachtwoord moet minimaal 8 tekens zijn'),
  naam: z.string().optional(),
  rol: z.enum(['redacteur', 'beheerder']),
})

export const userUpdateSchema = z.object({
  email: z.string().email().optional(),
  naam: z.string().optional(),
  rol: z.enum(['redacteur', 'beheerder']).optional(),
  actief: z.boolean().optional(),
})

export const email2faSchema = z.object({
  action: z.enum(['send', 'verify', 'check', 'toggle']),
  email: z.string().email().optional(),
  code: z.string().length(6).regex(/^\d{6}$/).optional(),
})
