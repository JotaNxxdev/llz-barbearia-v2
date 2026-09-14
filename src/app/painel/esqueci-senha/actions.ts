'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { esqueciSenhaSchema, type EsqueciSenhaInput } from '@/lib/painel-auth-schema'

export async function solicitarRedefinicao(
  input: EsqueciSenhaInput
): Promise<{ ok: boolean }> {
  const validado = esqueciSenhaSchema.safeParse(input)
  if (!validado.success) return { ok: false }

  const cabecalhos = await headers()
  const host = cabecalhos.get('host')
  const protocolo = cabecalhos.get('x-forwarded-proto') ?? 'https'

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(validado.data.email, {
    redirectTo: `${protocolo}://${host}/painel/redefinir-senha`,
  })

  if (error) {
    console.error('[Supabase] Falha ao solicitar redefinição de senha:', error)
  }

  // Sempre retorna ok, mesmo se o e-mail não existir — evita que alguém
  // descubra quais e-mails têm conta testando esse formulário.
  return { ok: true }
}
