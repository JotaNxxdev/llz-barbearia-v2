import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { Tenant } from '@/types/database'

export const getDonoAtual = cache(async (): Promise<{ tenant: Tenant } | null> => {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return null

  const { data: dono, error: erroDono } = await supabase
    .from('donos')
    .select('tenant_id')
    .eq('id', userData.user.id)
    .single()

  if (erroDono || !dono) {
    console.error('[Supabase] Dono autenticado sem registro em donos:', erroDono)
    return null
  }

  const { data: tenant, error: erroTenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', dono.tenant_id)
    .single()

  if (erroTenant || !tenant) {
    console.error('[Supabase] Falha ao buscar tenant do dono:', erroTenant)
    return null
  }

  return { tenant }
})
