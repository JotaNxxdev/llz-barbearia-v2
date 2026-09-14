import { ServicosLista } from '@/components/painel/servicos-lista'
import { createClient } from '@/lib/supabase/server'
import { getDonoAtual } from '@/lib/painel'

export default async function PainelServicosPage() {
  const contexto = await getDonoAtual()
  if (!contexto) return null

  const supabase = await createClient()
  const { data: servicos, error } = await supabase
    .from('servicos')
    .select('*')
    .eq('tenant_id', contexto.tenant.id)
    .order('nome')

  if (error) {
    console.error('[Supabase] Falha ao buscar serviços do painel:', error)
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl">Serviços</h1>
      <ServicosLista servicosIniciais={servicos ?? []} />
    </div>
  )
}
