'use client'

import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  buscarHorariosBarbeiro,
  buscarHorariosLivres,
  criarAgendamento,
} from '@/app/(site)/agendar/actions'
import { Confirmacao } from '@/components/agendar/confirmacao'
import { FormContato } from '@/components/agendar/form-contato'
import { SelectBarbeiro } from '@/components/agendar/select-barbeiro'
import { SelectData } from '@/components/agendar/select-data'
import { SelectHorario } from '@/components/agendar/select-horario'
import { SelectServico } from '@/components/agendar/select-servico'
import { StepIndicator } from '@/components/agendar/step-indicator'
import { Button } from '@/components/ui/button'
import type { DadosContato } from '@/lib/agendamento-schema'
import type { Barbeiro, HorarioDisponivel, Servico } from '@/types/database'

type Resultado = {
  codigoAcesso: string
  pixNecessario: boolean
  chavePix: string | null
  nomeTitularPix: string | null
}

const DADOS_CONTATO_VAZIO: DadosContato = {
  nome: '',
  whatsapp: '',
  email: '',
  observacao: '',
}

export function AgendamentoWizard({
  servicos,
  barbeiros,
}: {
  servicos: Servico[]
  barbeiros: Barbeiro[]
}) {
  const [etapa, setEtapa] = useState(1)
  const [servico, setServico] = useState<Servico | null>(null)
  const [barbeiro, setBarbeiro] = useState<Barbeiro | null>(null)
  const [horariosBarbeiro, setHorariosBarbeiro] = useState<HorarioDisponivel[] | null>(null)
  const [carregandoDias, setCarregandoDias] = useState(false)
  const [data, setData] = useState<string | null>(null)
  const [horariosLivres, setHorariosLivres] = useState<string[]>([])
  const [carregandoSlots, setCarregandoSlots] = useState(false)
  const [hora, setHora] = useState<string | null>(null)
  const [dadosContato, setDadosContato] = useState<DadosContato>(DADOS_CONTATO_VAZIO)
  const [enviando, setEnviando] = useState(false)
  const [resultado, setResultado] = useState<Resultado | null>(null)

  async function selecionarBarbeiro(novoBarbeiro: Barbeiro) {
    setBarbeiro(novoBarbeiro)
    setData(null)
    setHora(null)
    setHorariosLivres([])
    setEtapa(3)
    setCarregandoDias(true)
    const horarios = await buscarHorariosBarbeiro(novoBarbeiro.id)
    setHorariosBarbeiro(horarios)
    setCarregandoDias(false)
  }

  async function selecionarData(novaData: string) {
    if (!barbeiro) return
    setData(novaData)
    setHora(null)
    setEtapa(4)
    setCarregandoSlots(true)
    const livres = await buscarHorariosLivres(barbeiro.id, novaData)
    setHorariosLivres(livres)
    setCarregandoSlots(false)
  }

  function selecionarHora(novaHora: string) {
    setHora(novaHora)
    setEtapa(5)
  }

  async function confirmar(dados: DadosContato) {
    if (!servico || !barbeiro || !data || !hora) return
    setDadosContato(dados)
    setEnviando(true)

    const resposta = await criarAgendamento({
      servicoId: servico.id,
      barbeiroId: barbeiro.id,
      data,
      hora,
      ...dados,
    })

    setEnviando(false)

    if (resposta.ok) {
      setResultado({
        codigoAcesso: resposta.codigoAcesso,
        pixNecessario: resposta.pixNecessario,
        chavePix: resposta.chavePix,
        nomeTitularPix: resposta.nomeTitularPix,
      })
      return
    }

    if (resposta.motivo === 'horario_ocupado') {
      toast.error('Esse horário acabou de ser reservado. Escolha outro.')
      setHora(null)
      setEtapa(4)
      setCarregandoSlots(true)
      const livres = await buscarHorariosLivres(barbeiro.id, data)
      setHorariosLivres(livres)
      setCarregandoSlots(false)
      return
    }

    toast.error('Não foi possível confirmar agora. Tente novamente em alguns instantes.')
  }

  if (resultado && servico && barbeiro && data && hora) {
    return (
      <Confirmacao
        codigoAcesso={resultado.codigoAcesso}
        servico={servico}
        barbeiro={barbeiro}
        data={data}
        hora={hora}
        pixNecessario={resultado.pixNecessario}
        chavePix={resultado.chavePix}
        nomeTitularPix={resultado.nomeTitularPix}
      />
    )
  }

  const diasSemanaDisponiveis = new Set(
    (horariosBarbeiro ?? []).map((h) => h.dia_semana)
  )

  return (
    <div>
      <StepIndicator etapaAtual={etapa} />

      <div className="mb-4 flex items-center gap-2">
        {etapa > 1 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEtapa((e) => e - 1)}
            aria-label="Voltar"
          >
            <ChevronLeft className="size-5" />
          </Button>
        )}
        <h1 className="font-display text-xl">
          {etapa === 1 && 'Escolha o serviço'}
          {etapa === 2 && 'Escolha o barbeiro'}
          {etapa === 3 && 'Escolha a data'}
          {etapa === 4 && 'Escolha o horário'}
          {etapa === 5 && 'Seus dados'}
        </h1>
      </div>

      {etapa === 1 && (
        <SelectServico
          servicos={servicos}
          selecionado={servico}
          onSelecionar={(s) => {
            setServico(s)
            setEtapa(2)
          }}
        />
      )}

      {etapa === 2 && (
        <SelectBarbeiro
          barbeiros={barbeiros}
          selecionado={barbeiro}
          onSelecionar={selecionarBarbeiro}
        />
      )}

      {etapa === 3 &&
        (carregandoDias ? (
          <div className="flex gap-2">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="h-20 w-16 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : (
          <SelectData
            diasSemanaDisponiveis={diasSemanaDisponiveis}
            selecionada={data}
            onSelecionar={selecionarData}
          />
        ))}

      {etapa === 4 && (
        <SelectHorario
          horarios={horariosLivres}
          carregando={carregandoSlots}
          selecionado={hora}
          onSelecionar={selecionarHora}
        />
      )}

      {etapa === 5 && (
        <FormContato
          valoresIniciais={dadosContato}
          enviando={enviando}
          onEnviar={confirmar}
        />
      )}
    </div>
  )
}
