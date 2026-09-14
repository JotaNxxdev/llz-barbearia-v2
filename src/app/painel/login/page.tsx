import { LoginForm } from '@/components/painel/login-form'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl">Painel do dono</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Entre com o e-mail e senha da sua conta.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
