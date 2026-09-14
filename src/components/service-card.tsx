import { formatarDuracao, formatarPreco } from '@/lib/format'
import type { Servico } from '@/types/database'

export function ServiceCard({ servico }: { servico: Servico }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-[var(--accent)]/50">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg text-white">{servico.nome}</h3>
        <span className="whitespace-nowrap font-semibold text-[var(--accent)]">
          {formatarPreco(servico.preco)}
        </span>
      </div>
      {servico.descricao && (
        <p className="text-sm text-white/60">{servico.descricao}</p>
      )}
      <span className="mt-1 text-xs uppercase tracking-wide text-white/40">
        {formatarDuracao(servico.duracao_min)}
      </span>
    </div>
  )
}
