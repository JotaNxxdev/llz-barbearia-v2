'use server'

import { createClient } from '@/lib/supabase/server'
import { DEFAULT_TENANT_SLUG } from '@/lib/config'
import { novoAgendamentoSchema, type NovoAgendamentoInput } from '@/lib/agendamento-schema'
import { diaDaSemana, gerarSlots } from '@/lib/horarios'
import { getTenantPorSlug } from '@/lib/tenant'
import { apenasDigitos } from '@/lib/whatsapp'
import type { HorarioDisponivel } from '@/types/database'

export async function buscarHorariosBarbeiro(
  barbeiroId: string
): Promise<HorarioDisponivel[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('horarios_disponiveis')
    .select('*')
    .eq('barbeiro_id', barbeiroId)

  if (error) {
    console.error('[Supabase] Falha ao buscar horários do barbeiro:', error)
    return []
  }
  return data
}

export async function buscarHorariosLivres(
  barbeiroId: string,
  data: string
): Promise<string[]> {
  const supabase = await createClient()
  const diaSemana = diaDaSemana(data)

  const { data: janelas, error: erroJanelas } = await supabase
    .from('horarios_disponiveis')
    .select('*')
    .eq('barbeiro_id', barbeiroId)
    .eq('dia_semana', diaSemana)

  if (erroJanelas) {
    console.error('[Supabase] Falha ao buscar janelas de atendimento:', erroJanelas)
    return []
  }
  if (!janelas || janelas.length === 0) return []

  const todosSlots = new Set<string>()
  for (const janela of janelas) {
    for (const slot of gerarSlots(janela.hora_inicio, janela.hora_fim, janela.intervalo_min)) {
      todosSlots.add(slot)
    }
  }

  const { data: ocupados, error: erroOcupados } = await supabase.rpc('horarios_ocupados', {
    p_barbeiro_id: barbeiroId,
    p_data: data,
  })

  if (erroOcupados) {
    console.error('[Supabase] Falha ao buscar horários ocupados:', erroOcupados)
    return []
  }

  const horasOcupadas = new Set((ocupados ?? []).map((o) => o.hora.slice(0, 5)))

  return Array.from(todosSlots)
    .filter((slot) => !horasOcupadas.has(slot))
    .sort()
}

type ResultadoAgendamento =
  | { ok: true; codigoAcesso: string; pixNecessario: boolean; chavePix: string | null; nomeTitularPix: string | null }
  | { ok: false; motivo: 'horario_ocupado' | 'dados_invalidos' | 'erro_inesperado' }

function gerarCodigoAcesso() {
  const alfabeto = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  let codigo = ''
  for (let i = 0; i < 6; i++) {
    codigo += alfabeto[Math.floor(Math.random() * alfabeto.length)]
  }
  return codigo
}

export async function criarAgendamento(
  input: NovoAgendamentoInput
): Promise<ResultadoAgendamento> {
  const validado = novoAgendamentoSchema.safeParse(input)
  if (!validado.success) {
    return { ok: false, motivo: 'dados_invalidos' }
  }

  const tenant = await getTenantPorSlug(DEFAULT_TENANT_SLUG)
  if (!tenant) return { ok: false, motivo: 'erro_inesperado' }

  const { barbeiroId, servicoId, data, hora, nome, whatsapp, email, observacao } =
    validado.data
  const codigoAcesso = gerarCodigoAcesso()

  const supabase = await createClient()
  const { error } = await supabase.from('agendamentos').insert({
    tenant_id: tenant.id,
    barbeiro_id: barbeiroId,
    servico_id: servicoId,
    data,
    hora,
    cliente_nome: nome,
    cliente_whatsapp: apenasDigitos(whatsapp),
    cliente_email: email || null,
    observacao: observacao || null,
    status: 'pendente',
    pix_status: tenant.chave_pix ? 'aguardando' : 'nao_aplicavel',
    codigo_acesso: codigoAcesso,
  })

  if (error) {
    if (error.code === '23505') {
      return { ok: false, motivo: 'horario_ocupado' }
    }
    console.error('[Supabase] Falha ao criar agendamento:', error)
    return { ok: false, motivo: 'erro_inesperado' }
  }

  return {
    ok: true,
    codigoAcesso,
    pixNecessario: Boolean(tenant.chave_pix),
    chavePix: tenant.chave_pix,
    nomeTitularPix: tenant.nome_titular_pix,
  }
}
