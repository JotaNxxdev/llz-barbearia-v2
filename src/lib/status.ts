import type { StatusAgendamento } from '@/types/database'

export const STATUS_LABEL: Record<StatusAgendamento, string> = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  cancelado: 'Cancelado',
  concluido: 'Concluído',
}

export const STATUS_VARIANT: Record<
  StatusAgendamento,
  'default' | 'secondary' | 'destructive' | 'success'
> = {
  pendente: 'secondary',
  confirmado: 'default',
  cancelado: 'destructive',
  concluido: 'success',
}
