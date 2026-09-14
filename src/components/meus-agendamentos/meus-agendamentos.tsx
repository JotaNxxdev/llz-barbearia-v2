'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  buscarAgendamentosCliente,
  cancelarAgendamento,
} from '@/app/(site)/meus-agendamentos/actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatarPreco } from '@/lib/format'
import {
  buscaAgendamentosSchema,
  type BuscaAgendamentos,
} from '@/lib/meus-agendamentos-schema'
import { formatarWhatsapp } from '@/lib/whatsapp'
import type { AgendamentoCliente, StatusAgendamento } from '@/types/database'

const STATUS_LABEL: Record<StatusAgendamento, string> = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  cancelado: 'Cancelado',
  concluido: 'Concluído',
}

const STATUS_VARIANT: Record<
  StatusAgendamento,
  'default' | 'secondary' | 'destructive' | 'success'
> = {
  pendente: 'secondary',
  confirmado: 'default',
  cancelado: 'destructive',
  concluido: 'success',
}

function podeCancelar(agendamento: AgendamentoCliente) {
  if (agendamento.status === 'cancelado' || agendamento.status === 'concluido') {
    return false
  }
  const horario = new Date(`${agendamento.data}T${agendamento.hora}`)
  const duasHorasEmMs = 2 * 60 * 60 * 1000
  return horario.getTime() - Date.now() > duasHorasEmMs
}

export function MeusAgendamentos() {
  const [agendamentos, setAgendamentos] = useState<AgendamentoCliente[] | null>(null)
  const [buscando, setBuscando] = useState(false)
  const [cancelandoId, setCancelandoId] = useState<string | null>(null)
  const [credenciais, setCredenciais] = useState<{ whatsapp: string; codigoAcesso: string } | null>(
    null
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BuscaAgendamentos>({
    resolver: zodResolver(buscaAgendamentosSchema),
    defaultValues: { whatsapp: '', codigoAcesso: '' },
  })

  const whatsappField = register('whatsapp')

  async function buscar(dados: BuscaAgendamentos) {
    setBuscando(true)
    const resposta = await buscarAgendamentosCliente(dados)
    setBuscando(false)

    if (!resposta.ok) {
      toast.error('Não foi possível buscar seus agendamentos agora. Tente novamente.')
      return
    }

    if (resposta.agendamentos.length === 0) {
      toast.error('Nenhum agendamento encontrado com esses dados.')
      setAgendamentos(null)
      return
    }

    setCredenciais(dados)
    setAgendamentos(resposta.agendamentos)
  }

  async function cancelar(id: string) {
    if (!credenciais) return
    setCancelandoId(id)
    const resposta = await cancelarAgendamento({ id, ...credenciais })
    setCancelandoId(null)

    if (!resposta.ok) {
      toast.error('Não foi possível cancelar. Faltam menos de 2 horas para o horário?')
      return
    }

    toast.success('Agendamento cancelado.')
    setAgendamentos(
      (lista) =>
        lista?.map((a) => (a.id === id ? { ...a, status: 'cancelado' } : a)) ?? null
    )
  }

  if (!agendamentos) {
    return (
      <form onSubmit={handleSubmit(buscar)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            inputMode="tel"
            placeholder="(11) 91234-5678"
            aria-invalid={Boolean(errors.whatsapp)}
            {...whatsappField}
            onChange={(e) => {
              e.target.value = formatarWhatsapp(e.target.value)
              whatsappField.onChange(e)
            }}
          />
          {errors.whatsapp && (
            <p className="text-sm text-destructive">{errors.whatsapp.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="codigoAcesso">Código de acesso</Label>
          <Input
            id="codigoAcesso"
            placeholder="A3F9K2"
            className="uppercase"
            aria-invalid={Boolean(errors.codigoAcesso)}
            {...register('codigoAcesso')}
          />
          {errors.codigoAcesso && (
            <p className="text-sm text-destructive">{errors.codigoAcesso.message}</p>
          )}
        </div>

        <Button type="submit" size="lg" disabled={buscando} className="mt-2">
          {buscando ? 'Buscando...' : 'Buscar'}
        </Button>
      </form>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Button variant="ghost" size="sm" className="self-start" onClick={() => setAgendamentos(null)}>
        Buscar outro
      </Button>

      {agendamentos.map((agendamento) => (
        <Card key={agendamento.id}>
          <CardContent className="flex flex-col gap-3 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{agendamento.servico_nome}</p>
                <p className="text-sm text-muted-foreground">
                  com {agendamento.barbeiro_nome}
                </p>
              </div>
              <Badge variant={STATUS_VARIANT[agendamento.status]}>
                {STATUS_LABEL[agendamento.status]}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {format(new Date(`${agendamento.data}T00:00:00`), "d 'de' MMMM", {
                  locale: ptBR,
                })}{' '}
                às {agendamento.hora.slice(0, 5)}
              </span>
              <span className="font-medium text-foreground">
                {formatarPreco(agendamento.servico_preco)}
              </span>
            </div>

            {podeCancelar(agendamento) && (
              <Button
                variant="outline"
                size="sm"
                disabled={cancelandoId === agendamento.id}
                onClick={() => cancelar(agendamento.id)}
                className="self-start"
              >
                {cancelandoId === agendamento.id ? 'Cancelando...' : 'Cancelar agendamento'}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
