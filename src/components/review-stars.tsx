import { cn } from '@/lib/utils'

export function ReviewStars({ nota, className }: { nota: number; className?: string }) {
  return (
    <div
      aria-label={`Nota ${nota} de 5`}
      className={cn('flex gap-0.5 text-primary', className)}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} aria-hidden="true">
          {i < Math.round(nota) ? '★' : '☆'}
        </span>
      ))}
    </div>
  )
}
