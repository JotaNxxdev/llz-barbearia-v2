import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { Avaliacao, Barbeiro, Servico, Tenant } from '@/types/database'

export const getTenantPorSlug = cache(async (slug: string): Promise<Tenant | null> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error(`[Supabase] Falha ao buscar tenant "${slug}":`, error)
    return null
  }
  return data
})

export async function getBarbeirosAtivos(tenantId: string): Promise<Barbeiro[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('barbeiros')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('ativo', true)
    .order('nome')

  if (error) {
    console.error(`[Supabase] Falha ao buscar barbeiros do tenant "${tenantId}":`, error)
    return []
  }
  return data
}

export async function getServicosAtivos(tenantId: string): Promise<Servico[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('servicos')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('ativo', true)
    .order('nome')

  if (error) {
    console.error(`[Supabase] Falha ao buscar serviços do tenant "${tenantId}":`, error)
    return []
  }
  return data
}

export async function getAvaliacoesRecentes(
  tenantId: string,
  limite = 6
): Promise<Avaliacao[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('avaliacoes')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('criado_em', { ascending: false })
    .limit(limite)

  if (error) {
    console.error(`[Supabase] Falha ao buscar avaliações do tenant "${tenantId}":`, error)
    return []
  }
  return data
}
