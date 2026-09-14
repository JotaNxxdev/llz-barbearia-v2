export function apenasDigitos(valor: string) {
  return valor.replace(/\D/g, '')
}

export function whatsappValido(valor: string) {
  const digitos = apenasDigitos(valor)
  return digitos.length === 10 || digitos.length === 11
}

export function formatarWhatsapp(valor: string) {
  const digitos = apenasDigitos(valor).slice(0, 11)

  if (digitos.length <= 2) return digitos
  if (digitos.length <= 7) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`
  if (digitos.length <= 10)
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`

  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`
}

export function linkWhatsapp(valor: string) {
  return `https://wa.me/55${apenasDigitos(valor)}`
}
