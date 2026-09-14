'use server'

import { createClient } from '@/lib/supabase/server'
import { getDonoAtual } from '@/lib/painel'
import { servicoSchema, type ServicoInput } from '@/lib/servico-schema'

export async function criarServico(input: ServicoInput): Promise<{ ok: boolean }> {
  const validado = servicoSchema.safeParse(input)
  if (!validado.success) return { ok: false }

  const contexto = await getDonoAtual()
  if (!contexto) return { ok: false }

  const supabase = await createClient()
  const { error } = await supabase.from('servicos').insert({
    tenant_id: contexto.tenant.id,
    nome: validado.data.nome,
    descricao: validado.data.descricao || null,
    preco: validado.data.preco,
    duracao_min: validado.data.duracaoMin,
    ativo: true,
  })

  if (error) {
    console.error('[Supabase] Falha ao criar serviço:', error)
    return { ok: false }
  }

  return { ok: true }
}

export async function atualizarServico(
  id: string,
  input: ServicoInput
): Promise<{ ok: boolean }> {
  const validado = servicoSchema.safeParse(input)
  if (!validado.success) return { ok: false }

  const supabase = await createClient()
  const { error } = await supabase
    .from('servicos')
    .update({
      nome: validado.data.nome,
      descricao: validado.data.descricao || null,
      preco: validado.data.preco,
      duracao_min: validado.data.duracaoMin,
    })
    .eq('id', id)

  if (error) {
    console.error('[Supabase] Falha ao atualizar serviço:', error)
    return { ok: false }
  }

  return { ok: true }
}

export async function alternarAtivoServico(
  id: string,
  ativo: boolean
): Promise<{ ok: boolean }> {
  const supabase = await createClient()
  const { error } = await supabase.from('servicos').update({ ativo }).eq('id', id)

  if (error) {
    console.error('[Supabase] Falha ao alternar serviço:', error)
    return { ok: false }
  }

  return { ok: true }
}

export async function excluirServico(
  id: string
): Promise<{ ok: true } | { ok: false; motivo: 'em_uso' | 'erro_inesperado' }> {
  const supabase = await createClient()
  const { error } = await supabase.from('servicos').delete().eq('id', id)

  if (error) {
    if (error.code === '23503') {
      return { ok: false, motivo: 'em_uso' }
    }
    console.error('[Supabase] Falha ao excluir serviço:', error)
    return { ok: false, motivo: 'erro_inesperado' }
  }

  return { ok: true }
}
