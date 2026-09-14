import { z } from 'zod'
import { whatsappValido } from '@/lib/whatsapp'

export const buscaAgendamentosSchema = z.object({
  whatsapp: z.string().refine(whatsappValido, 'WhatsApp inválido'),
  codigoAcesso: z
    .string()
    .trim()
    .min(6, 'O código tem 6 caracteres')
    .max(6, 'O código tem 6 caracteres'),
})

export type BuscaAgendamentos = z.infer<typeof buscaAgendamentosSchema>
