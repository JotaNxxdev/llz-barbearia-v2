'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { atualizarStatusAgendamento } from '@/app/painel/(dashboard)/agendamentos/actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { formatarPreco } from '@/lib/format'
import { formatarWhatsapp } from '@/lib/whatsapp'
import { STATUS_LABEL, STATUS_VARIANT } from '@/lib/status'
import type { AgendamentoPainel } from '@/lib/painel-dados'
import type { StatusAgendamento } from '@/types/database'

const FILTROS_STATUS: Array<{ valor: StatusAgendamento | 'todos'; label: string }> = [
  { valor: 'todos', label: 'Todos' },
  { valor: 'pendente', label: 'Pendente' },
  { valor: 'confirmado', label: 'Confirmado' },
  { valor: 'concluido', label: 'Concluído' },
  { valor: 'cancelado', label: 'Cancelado' },
]

export function AgendamentosLista({
  agendamentosIniciais,
}: {
  agendamentosIniciais: AgendamentoPainel[]
}) {
  const [agendamentos, setAgendamentos] = useState(agendamentosIniciais)
  const [filtroStatus, setFiltroStatus] = useState<StatusAgendamento | 'todos'>('todos')
  const [filtroData, setFiltroData] = useState('')
  const [atualizandoId, setAtualizandoId] = useState<string | null>(null)

  const filtrados = useMemo(() => {
    return agendamentos.filter((a) => {
      if (filtroStatus !== 'todos' && a.status !== filtroStatus) return false
      if (filtroData && a.data !== filtroData) return false
      return true
    })
  }, [agendamentos, filtroStatus, filtroData])

  async function mudarStatus(id: string, novoStatus: StatusAgendamento) {
    setAtualizandoId(id)
    const resposta = await atualizarStatusAgendamento(id, novoStatus)
    setAtualizandoId(null)

    if (!resposta.ok) {
      toast.error('Não foi possível atualizar o status agora.')
      return
    }

    setAgendamentos((lista) =>
      lista.map((a) => (a.id === id ? { ...a, status: novoStatus } : a))
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {FILTROS_STATUS.map((f) => (
          <Button
            key={f.valor}
            size="sm"
            variant={filtroStatus === f.valor ? 'default' : 'secondary'}
            onClick={() => setFiltroStatus(f.valor)}
          >
            {f.label}
          </Button>
        ))}
        <Input
          type="date"
          value={filtroData}
          onChange={(e) => setFiltroData(e.target.value)}
          className="ml-auto w-auto"
        />
      </div>

      {filtrados.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum agendamento encontrado.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtrados.map((a) => (
            <Card key={a.id}>
              <CardContent className="flex flex-col gap-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{a.cliente_nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatarWhatsapp(a.cliente_whatsapp)}
                    </p>
                  </div>
                  <Badge variant={STATUS_VARIANT[a.status]}>{STATUS_LABEL[a.status]}</Badge>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {format(new Date(`${a.data}T00:00:00`), "d 'de' MMM", { locale: ptBR })} às{' '}
                    {a.hora.slice(0, 5)} · {a.servico_nome} · {a.barbeiro_nome}
                  </span>
                  <span className="font-medium text-foreground">
                    {formatarPreco(a.servico_preco)}
                  </span>
                </div>

                {(a.status === 'pendente' || a.status === 'confirmado') && (
                  <div className="flex gap-2">
                    {a.status === 'pendente' && (
                      <Button
                        size="sm"
                        disabled={atualizandoId === a.id}
                        onClick={() => mudarStatus(a.id, 'confirmado')}
                      >
                        Confirmar
                      </Button>
                    )}
                    {a.status === 'confirmado' && (
                      <Button
                        size="sm"
                        disabled={atualizandoId === a.id}
                        onClick={() => mudarStatus(a.id, 'concluido')}
                      >
                        Marcar como concluído
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={atualizandoId === a.id}
                      onClick={() => mudarStatus(a.id, 'cancelado')}
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
