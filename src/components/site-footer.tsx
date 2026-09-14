import { linkInstagram } from '@/lib/social'
import { linkWhatsapp } from '@/lib/whatsapp'
import type { Tenant } from '@/types/database'

export function SiteFooter({ tenant }: { tenant: Tenant }) {
  const whatsappHref = tenant.whatsapp ? linkWhatsapp(tenant.whatsapp) : null
  const instagramHref = tenant.instagram ? linkInstagram(tenant.instagram) : null

  return (
    <footer className="mt-16 border-t border-border py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 text-center text-sm text-muted-foreground sm:px-6">
        <p className="font-display text-base text-foreground">{tenant.nome}</p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-foreground"
            >
              WhatsApp
            </a>
          )}
          {instagramHref && (
            <a
              href={instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-foreground"
            >
              Instagram
            </a>
          )}
        </div>

        <p className="text-muted-foreground/70">
          &copy; {new Date().getFullYear()} {tenant.nome}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
