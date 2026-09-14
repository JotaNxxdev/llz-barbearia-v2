import { AgendamentosLista } from '@/components/painel/agendamentos-lista'
import { dataParaString } from '@/lib/horarios'
import { getAgendamentosPorPeriodo } from '@/lib/painel-dados'
import { getDonoAtual } from '@/lib/painel'

export default async function PainelAgendamentosPage() {
  const contexto = await getDonoAtual()
  if (!contexto) return null

  const inicio = new Date()
  inicio.setDate(inicio.getDate() - 30)
  const fim = new Date()
  fim.setDate(fim.getDate() + 90)

  const agendamentos = await getAgendamentosPorPeriodo(
    contexto.tenant.id,
    dataParaString(inicio),
    dataParaString(fim)
  )

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl">Agendamentos</h1>
      <AgendamentosLista agendamentosIniciais={agendamentos} />
    </div>
  )
}
