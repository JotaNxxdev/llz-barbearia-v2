export function horaParaMinutos(hora: string) {
  const [h, m] = hora.split(':').map(Number)
  return h * 60 + m
}

export function minutosParaHora(minutos: number) {
  const h = Math.floor(minutos / 60)
    .toString()
    .padStart(2, '0')
  const m = (minutos % 60).toString().padStart(2, '0')
  return `${h}:${m}`
}

export function gerarSlots(horaInicio: string, horaFim: string, intervaloMin: number) {
  const inicio = horaParaMinutos(horaInicio)
  const fim = horaParaMinutos(horaFim)
  const slots: string[] = []

  for (let m = inicio; m < fim; m += intervaloMin) {
    slots.push(minutosParaHora(m))
  }

  return slots
}

export function dataParaString(data: Date) {
  const ano = data.getFullYear()
  const mes = (data.getMonth() + 1).toString().padStart(2, '0')
  const dia = data.getDate().toString().padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

export function diaDaSemana(dataString: string) {
  return new Date(`${dataString}T00:00:00`).getDay()
}
