import { EsqueciSenhaForm } from '@/components/painel/esqueci-senha-form'

export default function EsqueciSenhaPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl">Esqueci minha senha</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Informe seu e-mail para receber o link de redefinição.
          </p>
        </div>
        <EsqueciSenhaForm />
      </div>
    </div>
  )
}
