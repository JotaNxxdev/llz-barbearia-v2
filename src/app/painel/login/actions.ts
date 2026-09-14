'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loginSchema, type LoginInput } from '@/lib/painel-auth-schema'

export async function entrar(
  input: LoginInput
): Promise<{ ok: false; mensagem: string }> {
  const validado = loginSchema.safeParse(input)
  if (!validado.success) {
    return { ok: false, mensagem: 'Preencha e-mail e senha corretamente.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: validado.data.email,
    password: validado.data.senha,
  })

  if (error) {
    return { ok: false, mensagem: 'E-mail ou senha incorretos.' }
  }

  redirect('/painel')
}
