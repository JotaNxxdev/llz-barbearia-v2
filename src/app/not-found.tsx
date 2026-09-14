import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-display text-2xl">Página não encontrada</h1>
      <p className="max-w-md text-muted-foreground">
        O endereço que você acessou não existe ou foi removido.
      </p>
      <Button asChild>
        <Link href="/">Voltar para o início</Link>
      </Button>
    </main>
  )
}
