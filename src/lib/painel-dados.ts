import { createClient } from '@/lib/supabase/server'
import type { Agendamento, Avaliacao } from '@/types/database'

export type AgendamentoPainel = Agendamento & {
  servico_nome: string
  servico_preco: number
  barbeiro_nome: string
}

async function mapaServicosEBarbeiros(tenantId: string) {
  const supabase = await createClient()

  const [{ data: servicos }, { data: barbeiros }] = await Promise.all([
    supabase.from('servicos').select('id, nome, preco').eq('tenant_id', tenantId),
    supabase.from('barbeiros').select('id, nome').eq('tenant_id', tenantId),
  ])

  const mapaServicos = new Map((servicos ?? []).map((s) => [s.id, s]))
  const mapaBarbeiros = new Map((barbeiros ?? []).map((b) => [b.id, b]))

  return { mapaServicos, mapaBarbeiros }
}

function enriquecer(
  agendamentos: Agendamento[],
  mapaServicos: Map<string, { nome: string; preco: number }>,
  mapaBarbeiros: Map<string, { nome: string }>
): AgendamentoPainel[] {
  return agendamentos.map((a) => ({
    ...a,
    servico_nome: mapaServicos.get(a.servico_id)?.nome ?? 'Serviço removido',
    servico_preco: mapaServicos.get(a.servico_id)?.preco ?? 0,
    barbeiro_nome: mapaBarbeiros.get(a.barbeiro_id)?.nome ?? 'Barbeiro removido',
  }))
}

export async function getAgendamentosPorPeriodo(
  tenantId: string,
  dataInicio: string,
  dataFim: string
): Promise<AgendamentoPainel[]> {
  const supabase = await createClient()
  const [{ data, error }, { mapaServicos, mapaBarbeiros }] = await Promise.all([
    supabase
      .from('agendamentos')
      .select('*')
      .eq('tenant_id', tenantId)
      .gte('data', dataInicio)
      .lte('data', dataFim)
      .order('data')
      .order('hora'),
    mapaServicosEBarbeiros(tenantId),
  ])

  if (error) {
    console.error('[Supabase] Falha ao buscar agendamentos do período:', error)
    return []
  }

  return enriquecer(data, mapaServicos, mapaBarbeiros)
}

export async function getUltimasAvaliacoes(
  tenantId: string,
  limite = 5
): Promise<Avaliacao[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('avaliacoes')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('criado_em', { ascending: false })
    .limit(limite)

  if (error) {
    console.error('[Supabase] Falha ao buscar avaliações recentes:', error)
    return []
  }

  return data
}
