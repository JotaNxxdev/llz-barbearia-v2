'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { novaSenhaSchema, type NovaSenhaInput } from '@/lib/painel-auth-schema'

export function RedefinirSenhaForm() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [estado, setEstado] = useState<'carregando' | 'pronto' | 'erro'>('carregando')
  const [salvando, setSalvando] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NovaSenhaInput>({
    resolver: zodResolver(novaSenhaSchema),
    defaultValues: { senha: '' },
  })

  useEffect(() => {
    // Verifica o link assim que o navegador monta a página (não é possível
    // fazer isso durante a renderização no servidor, já que o token de
    // recuperação só existe na URL do navegador).
    if (window.location.hash.includes('error=')) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- ponte necessária entre a URL do navegador (só existe no cliente) e o estado do React
      setEstado('erro')
      return
    }

    const { data: assinatura } = supabase.auth.onAuthStateChange((evento) => {
      if (evento === 'PASSWORD_RECOVERY') setEstado('pronto')
    })

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setEstado('pronto')
    })

    return () => assinatura.subscription.unsubscribe()
  }, [supabase])

  async function onSubmit(dados: NovaSenhaInput) {
    setSalvando(true)
    const { error } = await supabase.auth.updateUser({ password: dados.senha })
    setSalvando(false)

    if (error) {
      toast.error('Não foi possível salvar a nova senha. Tente pedir o link de novo.')
      return
    }

    toast.success('Senha atualizada!')
    router.push('/painel')
  }

  if (estado === 'erro') {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-sm text-muted-foreground">
          Esse link expirou ou já foi usado. Peça um novo.
        </p>
        <Button asChild>
          <Link href="/painel/esqueci-senha">Pedir novo link</Link>
        </Button>
      </div>
    )
  }

  if (estado === 'carregando') {
    return <p className="text-center text-sm text-muted-foreground">Verificando link...</p>
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="senha">Nova senha</Label>
        <Input
          id="senha"
          type="password"
          aria-invalid={Boolean(errors.senha)}
          {...register('senha')}
        />
        {errors.senha && <p className="text-sm text-destructive">{errors.senha.message}</p>}
      </div>

      <Button type="submit" size="lg" disabled={salvando}>
        {salvando ? 'Salvando...' : 'Salvar nova senha'}
      </Button>
    </form>
  )
}
