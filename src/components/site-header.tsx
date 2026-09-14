import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Tenant } from '@/types/database'

export function SiteHeader({ tenant }: { tenant: Tenant }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          {tenant.logo_url ? (
            <Image
              src={tenant.logo_url}
              alt={tenant.nome}
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {tenant.nome.charAt(0)}
            </span>
          )}
          <span className="font-display text-lg tracking-wide">{tenant.nome}</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
          <Link href="/#servicos" className="transition hover:text-foreground">
            Serviços
          </Link>
          <Link href="/meus-agendamentos" className="transition hover:text-foreground">
            Meus agendamentos
          </Link>
        </nav>

        <Button asChild size="sm">
          <Link href="/agendar">Agendar</Link>
        </Button>
      </div>
    </header>
  )
}
