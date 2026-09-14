'use client'

import { ptBR } from 'date-fns/locale'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { dataParaString } from '@/lib/horarios'

const DIAS_A_MOSTRAR = 45

export function SelectData({
  diasSemanaDisponiveis,
  selecionada,
  onSelecionar,
}: {
  diasSemanaDisponiveis: Set<number>
  selecionada: string | null
  onSelecionar: (data: string) => void
}) {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  const dias = Array.from({ length: DIAS_A_MOSTRAR }, (_, i) => {
    const data = new Date(hoje)
    data.setDate(hoje.getDate() + i)
    return data
  }).filter((data) => diasSemanaDisponiveis.has(data.getDay()))

  if (dias.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Esse barbeiro não tem dias de atendimento configurados. Escolha outro
        barbeiro ou fale com a barbearia pelo WhatsApp.
      </p>
    )
  }

  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
      {dias.map((data) => {
        const valor = dataParaString(data)
        const ativo = valor === selecionada

        return (
          <button
            key={valor}
            type="button"
            onClick={() => onSelecionar(valor)}
            className={cn(
              'flex shrink-0 flex-col items-center gap-0.5 rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm transition-all hover:border-primary/50',
              ativo && 'border-primary bg-primary text-primary-foreground'
            )}
          >
            <span className="text-[11px] uppercase tracking-wide opacity-80">
              {format(data, 'EEEEEE', { locale: ptBR })}
            </span>
            <span className="text-base font-semibold">{format(data, 'd')}</span>
            <span className="text-[11px] opacity-80">{format(data, 'MMM', { locale: ptBR })}</span>
          </button>
        )
      })}
    </div>
  )
}
