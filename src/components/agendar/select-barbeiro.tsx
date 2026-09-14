'use client'

import Image from 'next/image'
import { Check } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Barbeiro } from '@/types/database'

export function SelectBarbeiro({
  barbeiros,
  selecionado,
  onSelecionar,
}: {
  barbeiros: Barbeiro[]
  selecionado: Barbeiro | null
  onSelecionar: (barbeiro: Barbeiro) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {barbeiros.map((barbeiro) => {
        const ativo = selecionado?.id === barbeiro.id
        return (
          <Card
            key={barbeiro.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelecionar(barbeiro)}
            onKeyDown={(e) => e.key === 'Enter' && onSelecionar(barbeiro)}
            className={cn(
              'relative flex cursor-pointer flex-col items-center gap-3 p-4 text-center transition-all hover:border-primary/50',
              ativo && 'border-primary ring-2 ring-ring'
            )}
          >
            {ativo && (
              <span className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary">
                <Check className="size-3.5 text-primary-foreground" />
              </span>
            )}

            {barbeiro.foto_url ? (
              <Image
                src={barbeiro.foto_url}
                alt={barbeiro.nome}
                width={72}
                height={72}
                className="size-[72px] rounded-full object-cover"
              />
            ) : (
              <span className="flex size-[72px] items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-primary/10 font-display text-xl text-primary">
                {barbeiro.nome.charAt(0)}
              </span>
            )}

            <p className="font-medium">{barbeiro.nome}</p>
          </Card>
        )
      })}
    </div>
  )
}
