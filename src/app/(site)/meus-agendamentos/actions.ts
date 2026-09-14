'use server'

import { createClient } from '@/lib/supabase/server'
import { buscaAgendamentosSchema } from '@/lib/meus-agendamentos-schema'
import { apenasDigitos } from '@/lib/whatsapp'
import type { AgendamentoCliente } from '@/types/database'

type ResultadoBusca =
  | { ok: true; agendamentos: AgendamentoCliente[] }
  | { ok: false; motivo: 'dados_invalidos' | 'erro_inesperado' }

export async function buscarAgendamentosCliente(input: {
  whatsapp: string
  codigoAcesso: string
}): Promise<ResultadoBusca> {
  const validado = buscaAgendamentosSchema.safeParse(input)
  if (!validado.success) {
    return { ok: false, motivo: 'dados_invalidos' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('buscar_agendamentos_cliente', {
    p_whatsapp: apenasDigitos(validado.data.whatsapp),
    p_codigo_acesso: validado.data.codigoAcesso,
  })

  if (error) {
    console.error('[Supabase] Falha ao buscar agendamentos do cliente:', error)
    return { ok: false, motivo: 'erro_inesperado' }
  }

  return { ok: true, agendamentos: data ?? [] }
}

export async function cancelarAgendamento(input: {
  id: string
  whatsapp: string
  codigoAcesso: string
}): Promise<{ ok: boolean }> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('cancelar_agendamento', {
    p_id: input.id,
    p_whatsapp: apenasDigitos(input.whatsapp),
    p_codigo_acesso: input.codigoAcesso,
  })

  if (error) {
    console.error('[Supabase] Falha ao cancelar agendamento:', error)
    return { ok: false }
  }

  return { ok: Boolean(data) }
}
