export function linkInstagram(valor: string) {
  const limpo = valor.trim()
  if (/^https?:\/\//i.test(limpo)) return limpo
  return `https://www.instagram.com/${limpo.replace(/^@/, '')}`
}
