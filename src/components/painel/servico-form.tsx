'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { servicoSchema, type ServicoInput } from '@/lib/servico-schema'

export function ServicoForm({
  valoresIniciais,
  salvando,
  onSalvar,
  onCancelar,
}: {
  valoresIniciais?: ServicoInput
  salvando: boolean
  onSalvar: (dados: ServicoInput) => void
  onCancelar?: () => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServicoInput>({
    resolver: zodResolver(servicoSchema),
    defaultValues: valoresIniciais ?? { nome: '', descricao: '', preco: 0, duracaoMin: 30 },
  })

  return (
    <form onSubmit={handleSubmit(onSalvar)} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="nome">Nome</Label>
        <Input id="nome" aria-invalid={Boolean(errors.nome)} {...register('nome')} />
        {errors.nome && <p className="text-sm text-destructive">{errors.nome.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="descricao">Descrição (opcional)</Label>
        <Textarea id="descricao" {...register('descricao')} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="preco">Preço (R$)</Label>
          <Input
            id="preco"
            type="number"
            step="0.01"
            min="0"
            aria-invalid={Boolean(errors.preco)}
            {...register('preco', { valueAsNumber: true })}
          />
          {errors.preco && <p className="text-sm text-destructive">{errors.preco.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="duracaoMin">Duração (min)</Label>
          <Input
            id="duracaoMin"
            type="number"
            step="5"
            min="0"
            aria-invalid={Boolean(errors.duracaoMin)}
            {...register('duracaoMin', { valueAsNumber: true })}
          />
          {errors.duracaoMin && (
            <p className="text-sm text-destructive">{errors.duracaoMin.message}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar'}
        </Button>
        {onCancelar && (
          <Button type="button" size="sm" variant="ghost" onClick={onCancelar} disabled={salvando}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  )
}
