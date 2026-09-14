'use client'

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0b0b0d] px-4 text-center text-[#f2efe9]">
        <h1 className="text-2xl font-semibold">Algo deu errado</h1>
        <p className="max-w-md text-white/60">
          Não foi possível carregar esta página agora. Tente novamente em alguns
          instantes.
        </p>
        <button
          onClick={reset}
          className="rounded-full bg-[#c9a24b] px-6 py-2 text-sm font-semibold text-black"
        >
          Tentar novamente
        </button>
      </body>
    </html>
  )
}
