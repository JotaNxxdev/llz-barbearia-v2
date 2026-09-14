import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl
  const logado = Boolean(data.user)

  const CAMINHOS_PUBLICOS_PAINEL = [
    '/painel/login',
    '/painel/esqueci-senha',
    '/painel/redefinir-senha',
  ]
  const ehPublico = CAMINHOS_PUBLICOS_PAINEL.includes(pathname)
  const ehAreaPainel = pathname.startsWith('/painel')

  if (ehAreaPainel && !ehPublico && !logado) {
    return NextResponse.redirect(new URL('/painel/login', request.url))
  }

  if (pathname === '/painel/login' && logado) {
    return NextResponse.redirect(new URL('/painel', request.url))
  }

  return response
}
