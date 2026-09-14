'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { solicitarRedefinicao } from '@/app/painel/esqueci-senha/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { esqueciSenhaSchema, type EsqueciSenhaInput } from '@/lib/painel-auth-schema'

export function EsqueciSenhaForm() {
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EsqueciSenhaInput>({
    resolver: zodResolver(esqueciSenhaSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit(dados: EsqueciSenhaInput) {
    setEnviando(true)
    await solicitarRedefinicao(dados)
    setEnviando(false)
    setEnviado(true)
  }

  if (enviado) {
    return (
      <p className="text-sm text-muted-foreground">
        Se esse e-mail tiver uma conta, enviamos um link para redefinir a senha.
        Abra o e-mail e clique no link em até alguns minutos — ele expira rápido.
      </p>
    )
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

      <Button type="submit" size="lg" disabled={enviando}>
        {enviando ? 'Enviando...' : 'Enviar link de redefinição'}
      </Button>
    </form>
  )
}
