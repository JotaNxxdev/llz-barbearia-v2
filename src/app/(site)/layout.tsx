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
        <p className="mt-2 max-w-md text-white/60">
          Tente novamente em alguns instantes. Se o problema continuar, avise a
          barbearia pelo WhatsApp.
        </p>
      </main>
    )
  }

  return (
    <>
      <SiteHeader tenant={tenant} />
      <main className="flex-1">{children}</main>
      <SiteFooter tenant={tenant} />
    </>
  )
}
