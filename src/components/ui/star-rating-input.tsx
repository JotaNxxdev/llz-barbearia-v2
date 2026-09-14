'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StarRatingInput({
  valor,
  onChange,
}: {
  valor: number
  onChange: (nota: number) => void
}) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Nota de 1 a 5">
      {[1, 2, 3, 4, 5].map((nota) => (
        <button
          key={nota}
          type="button"
          role="radio"
          aria-checked={valor === nota}
          aria-label={`${nota} estrela${nota > 1 ? 's' : ''}`}
          onClick={() => onChange(nota)}
          className="p-0.5"
        >
          <Star
            className={cn(
              'size-7 transition-colors',
              nota <= valor ? 'fill-primary text-primary' : 'fill-none text-muted-foreground'
            )}
          />
        </button>
      ))}
    </div>
  )
}
