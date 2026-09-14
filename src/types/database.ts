export type StatusAgendamento = 'pendente' | 'confirmado' | 'cancelado' | 'concluido'
export type PixStatus = 'aguardando' | 'pago' | 'expirado' | 'nao_aplicavel'

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string
          nome: string
          slug: string
          whatsapp: string | null
          instagram: string | null
          chave_pix: string | null
          nome_titular_pix: string | null
          logo_url: string | null
          cor_destaque: string
          criado_em: string
        }
        Insert: {
          id?: string
          nome: string
          slug: string
          whatsapp?: string | null
          instagram?: string | null
          chave_pix?: string | null
          nome_titular_pix?: string | null
          logo_url?: string | null
          cor_destaque?: string
          criado_em?: string
        }
        Update: {
          id?: string
          nome?: string
          slug?: string
          whatsapp?: string | null
          instagram?: string | null
          chave_pix?: string | null
          nome_titular_pix?: string | null
          logo_url?: string | null
          cor_destaque?: string
          criado_em?: string
        }
        Relationships: []
      }
      donos: {
        Row: {
          id: string
          tenant_id: string
          nome: string
          criado_em: string
        }
        Insert: {
          id?: string
          tenant_id: string
          nome: string
          criado_em?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          nome?: string
          criado_em?: string
        }
        Relationships: []
      }
      barbeiros: {
        Row: {
          id: string
          tenant_id: string
          nome: string
          foto_url: string | null
          ativo: boolean
          criado_em: string
        }
        Insert: {
          id?: string
          tenant_id: string
          nome: string
          foto_url?: string | null
          ativo?: boolean
          criado_em?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          nome?: string
          foto_url?: string | null
          ativo?: boolean
          criado_em?: string
        }
        Relationships: []
      }
      servicos: {
        Row: {
          id: string
          tenant_id: string
          nome: string
          descricao: string | null
          preco: number
          duracao_min: number
          ativo: boolean
          criado_em: string
        }
        Insert: {
          id?: string
          tenant_id: string
          nome: string
          descricao?: string | null
          preco: number
          duracao_min: number
          ativo?: boolean
          criado_em?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          nome?: string
          descricao?: string | null
          preco?: number
          duracao_min?: number
          ativo?: boolean
          criado_em?: string
        }
        Relationships: []
      }
      horarios_disponiveis: {
        Row: {
          id: string
          tenant_id: string
          barbeiro_id: string
          dia_semana: number
          hora_inicio: string
          hora_fim: string
          intervalo_min: number
        }
        Insert: {
          id?: string
          tenant_id: string
          barbeiro_id: string
          dia_semana: number
          hora_inicio: string
          hora_fim: string
          intervalo_min: number
        }
        Update: {
          id?: string
          tenant_id?: string
          barbeiro_id?: string
          dia_semana?: number
          hora_inicio?: string
          hora_fim?: string
          intervalo_min?: number
        }
        Relationships: []
      }
      agendamentos: {
        Row: {
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
        Insert: {
          id?: string
          tenant_id: string
          barbeiro_id: string
          servico_id: string
          cliente_nome: string
          cliente_whatsapp: string
          cliente_email?: string | null
          data: string
          hora: string
          status?: StatusAgendamento
          pix_status?: PixStatus
          codigo_acesso: string
          observacao?: string | null
          criado_em?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          barbeiro_id?: string
          servico_id?: string
          cliente_nome?: string
          cliente_whatsapp?: string
          cliente_email?: string | null
          data?: string
          hora?: string
          status?: StatusAgendamento
          pix_status?: PixStatus
          codigo_acesso?: string
          observacao?: string | null
          criado_em?: string
        }
        Relationships: []
      }
      avaliacoes: {
        Row: {
          id: string
          tenant_id: string
          agendamento_id: string
          nota: number
          comentario: string | null
          criado_em: string
        }
        Insert: {
          id?: string
          tenant_id: string
          agendamento_id: string
          nota: number
          comentario?: string | null
          criado_em?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          agendamento_id?: string
          nota?: number
          comentario?: string | null
          criado_em?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      buscar_agendamentos_cliente: {
        Args: {
          p_whatsapp: string
          p_codigo_acesso: string
        }
        Returns: {
          id: string
          data: string
          hora: string
          status: StatusAgendamento
          pix_status: PixStatus
          observacao: string | null
          codigo_acesso: string
          servico_nome: string
          servico_preco: number
          barbeiro_nome: string
          ja_avaliado: boolean
        }[]
      }
      cancelar_agendamento: {
        Args: {
          p_id: string
          p_whatsapp: string
          p_codigo_acesso: string
        }
        Returns: boolean
      }
      avaliar_agendamento: {
        Args: {
          p_agendamento_id: string
          p_whatsapp: string
          p_codigo_acesso: string
          p_nota: number
          p_comentario: string
        }
        Returns: boolean
      }
      horarios_ocupados: {
        Args: {
          p_barbeiro_id: string
          p_data: string
        }
        Returns: { hora: string }[]
      }
    }
  }
}

export type Tenant = Database['public']['Tables']['tenants']['Row']
export type Dono = Database['public']['Tables']['donos']['Row']
export type Barbeiro = Database['public']['Tables']['barbeiros']['Row']
export type Servico = Database['public']['Tables']['servicos']['Row']
export type HorarioDisponivel = Database['public']['Tables']['horarios_disponiveis']['Row']
export type Agendamento = Database['public']['Tables']['agendamentos']['Row']
export type Avaliacao = Database['public']['Tables']['avaliacoes']['Row']
export type AgendamentoCliente =
  Database['public']['Functions']['buscar_agendamentos_cliente']['Returns'][number]
