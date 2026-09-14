import type { Tenant } from '@/types/database'

function apenasDigitos(valor: string) {
  return valor.replace(/\D/g, '')
}

export function SiteFooter({ tenant }: { tenant: Tenant }) {
  const whatsappHref = tenant.whatsapp
    ? `https://wa.me/55${apenasDigitos(tenant.whatsapp)}`
    : null
  const instagramHref = tenant.instagram
    ? `https://instagram.com/${tenant.instagram.replace(/^@/, '')}`
    : null

  return (
    <footer className="mt-16 border-t border-white/10 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 text-center text-sm text-white/60 sm:px-6">
        <p className="font-display text-base text-white/90">{tenant.nome}</p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {whatsappHref && (
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              WhatsApp
            </a>
          )}
          {instagramHref && (
            <a href={instagramHref} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              Instagram
            </a>
          )}
        </div>

        <p className="text-white/40">
          &copy; {new Date().getFullYear()} {tenant.nome}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
