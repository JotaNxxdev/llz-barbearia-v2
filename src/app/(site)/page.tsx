import Link from 'next/link'
import { ReviewStars } from '@/components/review-stars'
import { ServiceCard } from '@/components/service-card'
import { DEFAULT_TENANT_SLUG } from '@/lib/config'
import { formatarNota } from '@/lib/format'
import {
  getAvaliacoesRecentes,
  getServicosAtivos,
  getTenantPorSlug,
} from '@/lib/tenant'

export default async function HomePage() {
  const tenant = await getTenantPorSlug(DEFAULT_TENANT_SLUG)

  if (!tenant) return null

  const [servicos, avaliacoes] = await Promise.all([
    getServicosAtivos(tenant.id),
    getAvaliacoesRecentes(tenant.id),
  ])

  const mediaAvaliacoes =
    avaliacoes.length > 0
      ? avaliacoes.reduce((soma, a) => soma + a.nota, 0) / avaliacoes.length
      : null

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <section className="flex flex-col items-center gap-6 py-16 text-center sm:py-24">
        <span className="rounded-full border border-[var(--accent)]/40 px-4 py-1 text-xs uppercase tracking-widest text-[var(--accent)]">
          Agendamento online
        </span>
        <h1 className="font-display text-4xl leading-tight sm:text-5xl">
          {tenant.nome}
        </h1>
        <p className="max-w-xl text-white/70">
          Escolha o serviço, o horário e garanta seu lugar sem precisar ligar.
          Rápido, simples e sem complicação.
        </p>
        <Link
          href="/agendar"
          className="mt-2 rounded-full bg-[var(--accent)] px-8 py-3 text-sm font-semibold text-black transition hover:brightness-110"
        >
          Agendar horário
        </Link>

        {mediaAvaliacoes && (
          <div className="flex items-center gap-2 text-sm text-white/60">
            <ReviewStars nota={mediaAvaliacoes} />
            <span>{formatarNota(mediaAvaliacoes)} de 5</span>
            <span className="text-white/30">·</span>
            <span>{avaliacoes.length} avaliações</span>
          </div>
        )}
      </section>

      <section id="servicos" className="py-12 sm:py-16">
        <h2 className="font-display text-2xl">Serviços</h2>
        {servicos.length === 0 ? (
          <p className="mt-4 text-white/60">
            Nenhum serviço disponível no momento. Volte em breve.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {servicos.map((servico) => (
              <ServiceCard key={servico.id} servico={servico} />
            ))}
          </div>
        )}
      </section>

      {avaliacoes.length > 0 && (
        <section className="py-12 sm:py-16">
          <h2 className="font-display text-2xl">O que os clientes dizem</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {avaliacoes.map((avaliacao) => (
              <div
                key={avaliacao.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <ReviewStars nota={avaliacao.nota} />
                {avaliacao.comentario && (
                  <p className="mt-2 text-sm text-white/70">
                    &ldquo;{avaliacao.comentario}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
