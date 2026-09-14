import { z } from 'zod'

export const servicoSchema = z.object({
  nome: z.string().trim().min(2, 'Informe o nome do serviço'),
  descricao: z.string().trim().max(300).optional().or(z.literal('')),
  preco: z.number().positive('O preço precisa ser maior que zero'),
  duracaoMin: z.number().int().positive('A duração precisa ser maior que zero'),
})

export type ServicoInput = z.infer<typeof servicoSchema>
