import { Card, CardContent } from '@/components/ui/card'
import { formatarDuracao, formatarPreco } from '@/lib/format'
import type { Servico } from '@/types/database'

export function ServiceCard({ servico }: { servico: Servico }) {
  return (
    <Card className="group transition-colors hover:border-primary/50">
      <CardContent className="flex flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg">{servico.nome}</h3>
          <span className="whitespace-nowrap font-semibold text-primary">
            {formatarPreco(servico.preco)}
          </span>
        </div>
        {servico.descricao && (
          <p className="text-sm text-muted-foreground">{servico.descricao}</p>
        )}
        <span className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
          {formatarDuracao(servico.duracao_min)}
        </span>
      </CardContent>
    </Card>
  )
}
