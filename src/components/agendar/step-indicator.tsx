import { cn } from '@/lib/utils'

const ETAPAS = ['Serviço', 'Barbeiro', 'Data', 'Horário', 'Dados']

export function StepIndicator({ etapaAtual }: { etapaAtual: number }) {
  return (
    <ol className="mb-8 flex items-center gap-2">
      {ETAPAS.map((nome, i) => {
        const numero = i + 1
        const ativa = numero === etapaAtual
        const concluida = numero < etapaAtual

        return (
          <li key={nome} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className={cn(
                'h-1.5 w-full rounded-full transition-colors duration-300',
                concluida || ativa ? 'bg-primary' : 'bg-border'
              )}
            />
            <span
              className={cn(
                'hidden text-[11px] uppercase tracking-wide transition-colors sm:block',
                ativa ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {nome}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
