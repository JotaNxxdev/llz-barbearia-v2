import { RedefinirSenhaForm } from '@/components/painel/redefinir-senha-form'

export default function RedefinirSenhaPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl">Nova senha</h1>
        </div>
        <RedefinirSenhaForm />
      </div>
    </div>
  )
}
