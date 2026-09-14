import { PainelHeader } from '@/components/painel/painel-header'
import { getDonoAtual } from '@/lib/painel'

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const contexto = await getDonoAtual()

  if (!contexto) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h1 className="font-display text-2xl">Conta sem barbearia vinculada</h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          Seu login funcionou, mas não encontramos nenhuma barbearia associada a
          essa conta. Verifique se o registro na tabela &quot;donos&quot; foi
          criado com o UID correto do usuário.
        </p>
      </main>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PainelHeader nomeTenant={contexto.tenant.nome} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  )
}
