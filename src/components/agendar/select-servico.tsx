'use client'

import { Check } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { formatarDuracao, formatarPreco } from '@/lib/format'
import type { Servico } from '@/types/database'

export function SelectServico({
  servicos,
  selecionado,
  onSelecionar,
}: {
  servicos: Servico[]
  selecionado: Servico | null
  onSelecionar: (servico: Servico) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      {servicos.map((servico) => {
        const ativo = selecionado?.id === servico.id
        return (
          <Card
            key={servico.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelecionar(servico)}
            onKeyDown={(e) => e.key === 'Enter' && onSelecionar(servico)}
            className={cn(
              'cursor-pointer p-4 transition-all hover:border-primary/50',
              ativo && 'border-primary ring-2 ring-ring'
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium">{servico.nome}</p>
                <p className="text-sm text-muted-foreground">
                  {formatarDuracao(servico.duracao_min)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-primary">
                  {formatarPreco(servico.preco)}
                </span>
                <span
                  className={cn(
                    'flex size-6 items-center justify-center rounded-full border transition-colors',
                    ativo ? 'border-primary bg-primary' : 'border-border'
                  )}
                >
                  {ativo && <Check className="size-4 text-primary-foreground" />}
                </span>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
