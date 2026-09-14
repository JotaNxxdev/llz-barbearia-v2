import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().email('E-mail inválido'),
  senha: z.string().min(6, 'A senha precisa ter no mínimo 6 caracteres'),
})

export type LoginInput = z.infer<typeof loginSchema>
