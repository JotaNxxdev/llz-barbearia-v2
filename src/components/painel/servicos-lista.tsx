'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  alternarAtivoServico,
  atualizarServico,
  criarServico,
  excluirServico,
} from '@/app/painel/(dashboard)/servicos/actions'
import { ServicoForm } from '@/components/painel/servico-form'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatarDuracao, formatarPreco } from '@/lib/format'
import type { ServicoInput } from '@/lib/servico-schema'
import type { Servico } from '@/types/database'

export function ServicosLista({ servicosIniciais }: { servicosIniciais: Servico[] }) {
  const [servicos, setServicos] = useState(servicosIniciais)
  const [criando, setCriando] = useState(false)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [salvando, setSalvando] = useState(false)

  async function handleCriar(dados: ServicoInput) {
    setSalvando(true)
    const resposta = await criarServico(dados)
    setSalvando(false)

    if (!resposta.ok) {
      toast.error('Não foi possível criar o serviço.')
      return
    }

    toast.success('Serviço criado.')
    setCriando(false)
    setServicos((lista) => [
      ...lista,
      {
        id: crypto.randomUUID(),
        tenant_id: '',
        nome: dados.nome,
        descricao: dados.descricao || null,
        preco: dados.preco,
        duracao_min: dados.duracaoMin,
        ativo: true,
        criado_em: new Date().toISOString(),
      },
    ])
  }

  async function handleAtualizar(id: string, dados: ServicoInput) {
    setSalvando(true)
    const resposta = await atualizarServico(id, dados)
    setSalvando(false)

    if (!resposta.ok) {
      toast.error('Não foi possível salvar as alterações.')
      return
    }

    toast.success('Serviço atualizado.')
    setEditandoId(null)
    setServicos((lista) =>
      lista.map((s) =>
        s.id === id
          ? {
              ...s,
              nome: dados.nome,
              descricao: dados.descricao || null,
              preco: dados.preco,
              duracao_min: dados.duracaoMin,
            }
          : s
      )
    )
  }

  async function handleAlternarAtivo(servico: Servico) {
    const resposta = await alternarAtivoServico(servico.id, !servico.ativo)
    if (!resposta.ok) {
      toast.error('Não foi possível atualizar.')
      return
    }
    setServicos((lista) =>
      lista.map((s) => (s.id === servico.id ? { ...s, ativo: !s.ativo } : s))
    )
  }

  async function handleExcluir(id: string) {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return

    const resposta = await excluirServico(id)
    if (!resposta.ok) {
      toast.error(
        resposta.motivo === 'em_uso'
          ? 'Esse serviço já foi usado em agendamentos. Desative-o em vez de excluir.'
          : 'Não foi possível excluir agora.'
      )
      return
    }
    toast.success('Serviço excluído.')
    setServicos((lista) => lista.filter((s) => s.id !== id))
  }

  return (
    <div className="flex flex-col gap-3">
      {criando ? (
        <Card>
          <CardContent className="p-4">
            <ServicoForm
              salvando={salvando}
              onSalvar={handleCriar}
              onCancelar={() => setCriando(false)}
            />
          </CardContent>
        </Card>
      ) : (
        <Button size="sm" variant="secondary" className="self-start" onClick={() => setCriando(true)}>
          <Plus className="size-4" />
          Novo serviço
        </Button>
      )}

      {servicos.map((servico) => (
        <Card key={servico.id}>
          <CardContent className="p-4">
            {editandoId === servico.id ? (
              <ServicoForm
                valoresIniciais={{
                  nome: servico.nome,
                  descricao: servico.descricao ?? '',
                  preco: servico.preco,
                  duracaoMin: servico.duracao_min,
                }}
                salvando={salvando}
                onSalvar={(dados) => handleAtualizar(servico.id, dados)}
                onCancelar={() => setEditandoId(null)}
              />
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{servico.nome}</p>
                    {servico.descricao && (
                      <p className="text-sm text-muted-foreground">{servico.descricao}</p>
                    )}
                  </div>
                  <Badge variant={servico.ativo ? 'success' : 'secondary'}>
                    {servico.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatarPreco(servico.preco)} · {formatarDuracao(servico.duracao_min)}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditandoId(servico.id)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAlternarAtivo(servico)}>
                    {servico.ativo ? 'Desativar' : 'Ativar'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleExcluir(servico.id)}>
                    Excluir
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
