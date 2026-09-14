import { AgendamentoWizard } from '@/components/agendar/wizard'
import { DEFAULT_TENANT_SLUG } from '@/lib/config'
import { getBarbeirosAtivos, getServicosAtivos, getTenantPorSlug } from '@/lib/tenant'

export default async function AgendarPage() {
  const tenant = await getTenantPorSlug(DEFAULT_TENANT_SLUG)
  if (!tenant) return null

  const [servicos, barbeiros] = await Promise.all([
    getServicosAtivos(tenant.id),
    getBarbeirosAtivos(tenant.id),
  ])

  if (servicos.length === 0 || barbeiros.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <h1 className="font-display text-2xl">Agendamento indisponível</h1>
        <p className="mt-2 text-muted-foreground">
          Ainda não há serviços ou barbeiros cadastrados para agendamento
          online. Fale com a barbearia pelo WhatsApp para agendar.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <AgendamentoWizard servicos={servicos} barbeiros={barbeiros} />
    </div>
  )
}
