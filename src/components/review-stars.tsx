export function ReviewStars({ nota }: { nota: number }) {
  return (
    <div aria-label={`Nota ${nota} de 5`} className="flex gap-0.5 text-[var(--accent)]">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} aria-hidden="true">
          {i < Math.round(nota) ? '★' : '☆'}
        </span>
      ))}
    </div>
  )
}
