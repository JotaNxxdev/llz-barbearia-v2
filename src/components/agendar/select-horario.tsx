'use client'

import { cn } from '@/lib/utils'

export function SelectHorario({
  horarios,
  carregando,
  selecionado,
  onSelecionar,
}: {
  horarios: string[]
  carregando: boolean
  selecionado: string | null
  onSelecionar: (hora: string) => void
}) {
  if (carregando) {
    return (
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="h-11 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    )
  }

  if (horarios.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Não há horários livres nesse dia. Escolha outra data.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {horarios.map((hora) => {
        const ativo = hora === selecionado
        return (
          <button
            key={hora}
            type="button"
            onClick={() => onSelecionar(hora)}
            className={cn(
              'h-11 rounded-lg border border-border bg-card text-sm font-medium transition-all hover:border-primary/50',
              ativo && 'border-primary bg-primary text-primary-foreground'
            )}
          >
            {hora}
          </button>
        )
      })}
    </div>
  )
}
