export type StatusAgendamento = 'pendente' | 'confirmado' | 'cancelado' | 'concluido'
export type PixStatus = 'aguardando' | 'pago' | 'expirado' | 'nao_aplicavel'

export interface Tenant {
  id: string
  nome: string
  slug: string
  whatsapp: string | null
  instagram: string | null
  chave_pix: string | null
  nome_titular_pix: string | null
  logo_url: string | null
  criado_em: string
}

export interface Dono {
  id: string
  tenant_id: string
  nome: string
  criado_em: string
}

export interface Barbeiro {
  id: string
  tenant_id: string
  nome: string
  foto_url: string | null
  ativo: boolean
  criado_em: string
}

export interface Servico {
  id: string
  tenant_id: string
  nome: string
  descricao: string | null
  preco: number
  duracao_min: number
  ativo: boolean
  criado_em: string
}

export interface HorarioDisponivel {
  id: string
  tenant_id: string
  barbeiro_id: string
  dia_semana: number
  hora_inicio: string
  hora_fim: string
  intervalo_min: number
}

export interface Agendamento {
  id: string
  tenant_id: string
  barbeiro_id: string
  servico_id: string
  cliente_nome: string
  cliente_whatsapp: string
  cliente_email: string | null
  data: string
  hora: string
  status: StatusAgendamento
  pix_status: PixStatus
  codigo_acesso: string
  observacao: string | null
  criado_em: string
}

export interface Avaliacao {
  id: string
  tenant_id: string
  agendamento_id: string
  nota: number
  comentario: string | null
  criado_em: string
}

export interface Database {
  public: {
    Tables: {
      tenants: { Row: Tenant; Insert: Partial<Tenant>; Update: Partial<Tenant> }
      donos: { Row: Dono; Insert: Partial<Dono>; Update: Partial<Dono> }
      barbeiros: { Row: Barbeiro; Insert: Partial<Barbeiro>; Update: Partial<Barbeiro> }
      servicos: { Row: Servico; Insert: Partial<Servico>; Update: Partial<Servico> }
      horarios_disponiveis: {
        Row: HorarioDisponivel
        Insert: Partial<HorarioDisponivel>
        Update: Partial<HorarioDisponivel>
      }
      agendamentos: { Row: Agendamento; Insert: Partial<Agendamento>; Update: Partial<Agendamento> }
      avaliacoes: { Row: Avaliacao; Insert: Partial<Avaliacao>; Update: Partial<Avaliacao> }
    }
  }
}
