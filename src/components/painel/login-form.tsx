'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { entrar } from '@/app/painel/login/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginSchema, type LoginInput } from '@/lib/painel-auth-schema'

export function LoginForm() {
  const [entrando, setEntrando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', senha: '' },
  })

  async function onSubmit(dados: LoginInput) {
    setErro(null)
    setEntrando(true)
    const resposta = await entrar(dados)
    setEntrando(false)

    if (resposta && !resposta.ok) {
      setErro(resposta.mensagem)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="voce@email.com"
          aria-invalid={Boolean(errors.email)}
          {...register('email')}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="senha">Senha</Label>
        <Input
          id="senha"
          type="password"
          aria-invalid={Boolean(errors.senha)}
          {...register('senha')}
        />
        {errors.senha && <p className="text-sm text-destructive">{errors.senha.message}</p>}
      </div>

      {erro && <p className="text-sm text-destructive">{erro}</p>}

      <Button type="submit" size="lg" disabled={entrando} className="mt-2">
        {entrando ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  )
}
