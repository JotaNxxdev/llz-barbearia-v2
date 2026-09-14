import { z } from 'zod'
import { whatsappValido } from '@/lib/whatsapp'

export const dadosContatoSchema = z.object({
  nome: z.string().trim().min(2, 'Informe seu nome completo'),
  whatsapp: z.string().refine(whatsappValido, 'WhatsApp inválido'),
  email: z.string().trim().email('E-mail inválido').optional().or(z.literal('')),
  observacao: z.string().trim().max(300, 'Máximo de 300 caracteres').optional().or(z.literal('')),
})

export type DadosContato = z.infer<typeof dadosContatoSchema>

export const novoAgendamentoSchema = dadosContatoSchema.extend({
  barbeiroId: z.string().uuid(),
  servicoId: z.string().uuid(),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  hora: z.string().regex(/^\d{2}:\d{2}$/),
})

export type NovoAgendamentoInput = z.infer<typeof novoAgendamentoSchema>
