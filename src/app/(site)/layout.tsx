import type { CSSProperties } from 'react'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { DEFAULT_TENANT_SLUG } from '@/lib/config'
import { getTenantPorSlug } from '@/lib/tenant'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const tenant = await getTenantPorSlug(DEFAULT_TENANT_SLUG)

  if (!tenant) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="font-display text-2xl">Não conseguimos carregar a barbearia</h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          Tente novamente em alguns instantes. Se o problema continuar, avise a
          barbearia pelo WhatsApp.
        </p>
      </main>
    )
  }

  const temaTenant = {
    '--primary': tenant.cor_destaque || '#c9a24b',
  } as CSSProperties

  return (
    <div className="flex min-h-screen flex-1 flex-col" style={temaTenant}>
      <SiteHeader tenant={tenant} />
      <main className="flex-1">{children}</main>
      <SiteFooter tenant={tenant} />
    </div>
  )
}
