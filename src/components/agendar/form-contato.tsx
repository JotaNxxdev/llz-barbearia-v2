'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { dadosContatoSchema, type DadosContato } from '@/lib/agendamento-schema'
import { formatarWhatsapp } from '@/lib/whatsapp'

export function FormContato({
  valoresIniciais,
  enviando,
  onEnviar,
}: {
  valoresIniciais: DadosContato
  enviando: boolean
  onEnviar: (dados: DadosContato) => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DadosContato>({
    resolver: zodResolver(dadosContatoSchema),
    defaultValues: valoresIniciais,
  })

  const whatsappField = register('whatsapp')

  return (
    <form onSubmit={handleSubmit(onEnviar)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="nome">Nome completo</Label>
        <Input
          id="nome"
          placeholder="Seu nome"
          aria-invalid={Boolean(errors.nome)}
          {...register('nome')}
        />
        {errors.nome && <p className="text-sm text-destructive">{errors.nome.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="whatsapp">WhatsApp</Label>
        <Input
          id="whatsapp"
          inputMode="tel"
          placeholder="(11) 91234-5678"
          aria-invalid={Boolean(errors.whatsapp)}
          {...whatsappField}
          onChange={(e) => {
            e.target.value = formatarWhatsapp(e.target.value)
            whatsappField.onChange(e)
          }}
        />
        {errors.whatsapp && (
          <p className="text-sm text-destructive">{errors.whatsapp.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">E-mail (opcional)</Label>
        <Input
          id="email"
          type="email"
          placeholder="voce@email.com"
          aria-invalid={Boolean(errors.email)}
          {...register('email')}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="observacao">Observação (opcional)</Label>
        <Textarea
          id="observacao"
          placeholder="Alguma preferência ou detalhe para o barbeiro?"
          aria-invalid={Boolean(errors.observacao)}
          {...register('observacao')}
        />
        {errors.observacao && (
          <p className="text-sm text-destructive">{errors.observacao.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" disabled={enviando} className="mt-2">
        {enviando ? 'Confirmando...' : 'Confirmar agendamento'}
      </Button>
    </form>
  )
}
