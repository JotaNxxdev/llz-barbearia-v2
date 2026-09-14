import { MeusAgendamentos } from '@/components/meus-agendamentos/meus-agendamentos'

export default function MeusAgendamentosPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl">Meus agendamentos</h1>
      <p className="mt-1 text-muted-foreground">
        Informe o WhatsApp e o código de acesso que você recebeu ao agendar.
      </p>

      <div className="mt-6">
        <MeusAgendamentos />
      </div>
    </div>
  )
}
