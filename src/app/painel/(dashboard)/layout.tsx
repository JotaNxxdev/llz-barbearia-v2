import { redirect } from 'next/navigation'
import { PainelHeader } from '@/components/painel/painel-header'
import { getDonoAtual } from '@/lib/painel'

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const contexto = await getDonoAtual()

  if (!contexto) {
    redirect('/painel/login')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PainelHeader nomeTenant={contexto.tenant.nome} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  )
}
