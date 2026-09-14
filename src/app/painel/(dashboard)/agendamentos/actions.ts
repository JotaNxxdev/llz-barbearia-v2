'use server'

import { createClient } from '@/lib/supabase/server'
import type { StatusAgendamento } from '@/types/database'

export async function atualizarStatusAgendamento(
  id: string,
  novoStatus: StatusAgendamento
): Promise<{ ok: boolean }> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('agendamentos')
    .update({ status: novoStatus })
    .eq('id', id)

  if (error) {
    console.error('[Supabase] Falha ao atualizar status do agendamento:', error)
    return { ok: false }
  }

  return { ok: true }
}
