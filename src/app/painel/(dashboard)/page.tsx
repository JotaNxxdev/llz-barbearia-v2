import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ReviewStars } from '@/components/review-stars'
import { dataParaString } from '@/lib/horarios'
import { getAgendamentosPorPeriodo, getUltimasAvaliacoes } from '@/lib/painel-dados'
import { getDonoAtual } from '@/lib/painel'
import { STATUS_LABEL, STATUS_VARIANT } from '@/lib/status'

export default async function PainelDashboardPage() {
  const contexto = await getDonoAtual()
  if (!contexto) return null

  const hoje = new Date()
  const emSeteDias = new Date(hoje)
  emSeteDias.setDate(hoje.getDate() + 7)

  const [agendamentosHoje, agendamentosSemana, avaliacoes] = await Promise.all([
    getAgendamentosPorPeriodo(contexto.tenant.id, dataParaString(hoje), dataParaString(hoje)),
    getAgendamentosPorPeriodo(
      contexto.tenant.id,
      dataParaString(hoje),
      dataParaString(emSeteDias)
    ),
    getUltimasAvaliacoes(contexto.tenant.id, 5),
  ])

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl">Olá!</h1>
        <p className="text-muted-foreground">Visão rápida da {contexto.tenant.nome}.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Agendamentos hoje</p>
            <p className="mt-1 font-display text-3xl">{agendamentosHoje.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Próximos 7 dias</p>
            <p className="mt-1 font-display text-3xl">{agendamentosSemana.length}</p>
          </CardContent>
        </Card>
      </div>

      <section>
        <h2 className="mb-3 font-display text-lg">Hoje</h2>

        {agendamentosHoje.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum agendamento para hoje.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {agendamentosHoje.map((a) => (
              <Card key={a.id}>
                <CardContent className="flex items-center justify-between gap-3 p-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-muted-foreground">
                      {a.hora.slice(0, 5)}
                    </span>
                    <div>
                      <p className="font-medium">{a.cliente_nome}</p>
                      <p className="text-sm text-muted-foreground">
                        {a.servico_nome} · {a.barbeiro_nome}
                      </p>
                    </div>
                  </div>
                  <Badge variant={STATUS_VARIANT[a.status]}>{STATUS_LABEL[a.status]}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {avaliacoes.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-lg">Últimas avaliações</h2>
          <div className="flex flex-col gap-2">
            {avaliacoes.map((av) => (
              <Card key={av.id}>
                <CardContent className="p-4">
                  <ReviewStars nota={av.nota} />
                  {av.comentario && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      &ldquo;{av.comentario}&rdquo;
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
