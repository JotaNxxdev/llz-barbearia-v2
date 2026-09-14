import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-display text-2xl">Página não encontrada</h1>
      <p className="max-w-md text-white/60">
        O endereço que você acessou não existe ou foi removido.
      </p>
      <Link
        href="/"
        className="rounded-full bg-[var(--accent)] px-6 py-2 text-sm font-semibold text-black"
      >
        Voltar para o início
      </Link>
    </main>
  )
}
