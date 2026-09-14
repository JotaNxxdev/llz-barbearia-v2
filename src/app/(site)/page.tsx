import Image from 'next/image'
import Link from 'next/link'
import { Scissors } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ReviewStars } from '@/components/review-stars'
import { ServiceCard } from '@/components/service-card'
import { DEFAULT_TENANT_SLUG } from '@/lib/config'
import { formatarNota } from '@/lib/format'
import {
  getAvaliacoesRecentes,
  getBarbeirosAtivos,
  getServicosAtivos,
  getTenantPorSlug,
} from '@/lib/tenant'

export default async function HomePage() {
  const tenant = await getTenantPorSlug(DEFAULT_TENANT_SLUG)

  if (!tenant) return null

  const [servicos, barbeiros, avaliacoes] = await Promise.all([
    getServicosAtivos(tenant.id),
    getBarbeirosAtivos(tenant.id),
    getAvaliacoesRecentes(tenant.id),
  ])

  const mediaAvaliacoes =
    avaliacoes.length > 0
      ? avaliacoes.reduce((soma, a) => soma + a.nota, 0) / avaliacoes.length
      : null

  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,color-mix(in_srgb,var(--primary)_18%,transparent),transparent)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(color-mix(in_srgb,var(--foreground)_4%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--foreground)_4%,transparent)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]"
        />

        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 sm:py-24">
          <span className="flex size-14 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
            <Scissors className="size-6" />
          </span>

          <Badge variant="outline" className="border-primary/40 text-primary">
            Agendamento online
          </Badge>

          <h1 className="font-display text-4xl leading-tight sm:text-5xl">
            {tenant.nome}
          </h1>
          <p className="max-w-xl text-muted-foreground">
            Escolha o serviço, o horário e garanta seu lugar sem precisar
            ligar. Rápido, simples e sem complicação.
          </p>

          <Button asChild size="lg" className="mt-2">
            <Link href="/agendar">Agendar horário</Link>
          </Button>

          {mediaAvaliacoes && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ReviewStars nota={mediaAvaliacoes} />
              <span>{formatarNota(mediaAvaliacoes)} de 5</span>
              <span className="text-muted-foreground/50">·</span>
              <span>{avaliacoes.length} avaliações</span>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <section id="servicos" className="py-12 sm:py-16">
          <h2 className="font-display text-2xl">Serviços</h2>
          {servicos.length === 0 ? (
            <p className="mt-4 text-muted-foreground">
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

        {barbeiros.length > 0 && (
          <section className="py-12 sm:py-16">
            <h2 className="font-display text-2xl">Nossa equipe</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {barbeiros.map((barbeiro) => (
                <Card key={barbeiro.id} className="flex flex-col items-center gap-3 p-5 text-center">
                  {barbeiro.foto_url ? (
                    <Image
                      src={barbeiro.foto_url}
                      alt={barbeiro.nome}
                      width={80}
                      height={80}
                      className="size-20 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-primary/10 font-display text-2xl text-primary">
                      {barbeiro.nome.charAt(0)}
                    </span>
                  )}
                  <p className="font-medium">{barbeiro.nome}</p>
                </Card>
              ))}
            </div>
          </section>
        )}

        {avaliacoes.length > 0 && (
          <section className="py-12 sm:py-16">
            <h2 className="font-display text-2xl">O que os clientes dizem</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {avaliacoes.map((avaliacao) => (
                <Card key={avaliacao.id}>
                  <CardContent className="p-5">
                    <ReviewStars nota={avaliacao.nota} />
                    {avaliacao.comentario && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        &ldquo;{avaliacao.comentario}&rdquo;
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
