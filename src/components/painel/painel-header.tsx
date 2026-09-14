import Link from 'next/link'
import { LogOut } from 'lucide-react'
import { sair } from '@/app/painel/(dashboard)/actions'
import { Button } from '@/components/ui/button'

const LINKS = [
  { href: '/painel', label: 'Início' },
  { href: '/painel/agendamentos', label: 'Agendamentos' },
  { href: '/painel/servicos', label: 'Serviços' },
]

export function PainelHeader({ nomeTenant }: { nomeTenant: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="font-display text-lg tracking-wide">{nomeTenant}</span>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
            painel
          </span>
        </div>

        <form action={sair}>
          <Button variant="ghost" size="sm" type="submit">
            <LogOut className="size-4" />
            Sair
          </Button>
        </form>
      </div>

      <nav className="mx-auto flex max-w-5xl gap-4 overflow-x-auto px-4 pb-2 text-sm text-muted-foreground sm:px-6">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="shrink-0 whitespace-nowrap transition hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
