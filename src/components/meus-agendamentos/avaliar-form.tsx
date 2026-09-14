'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { StarRatingInput } from '@/components/ui/star-rating-input'
import { Textarea } from '@/components/ui/textarea'

export function AvaliarForm({
  enviando,
  onEnviar,
  onCancelar,
}: {
  enviando: boolean
  onEnviar: (nota: number, comentario: string) => void
  onCancelar: () => void
}) {
  const [nota, setNota] = useState(0)
  const [comentario, setComentario] = useState('')

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/40 p-4">
      <StarRatingInput valor={nota} onChange={setNota} />
      <Textarea
        placeholder="Como foi seu atendimento? (opcional)"
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        maxLength={300}
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          disabled={nota === 0 || enviando}
          onClick={() => onEnviar(nota, comentario)}
        >
          {enviando ? 'Enviando...' : 'Enviar avaliação'}
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancelar} disabled={enviando}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}
