'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { PartyPopper, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatarPreco } from '@/lib/format'
import type { Barbeiro, Servico } from '@/types/database'

export function Confirmacao({
  codigoAcesso,
  servico,
  barbeiro,
  data,
  hora,
  pixNecessario,
  chavePix,
  nomeTitularPix,
}: {
  codigoAcesso: string
  servico: Servico
  barbeiro: Barbeiro
  data: string
  hora: string
  pixNecessario: boolean
  chavePix: string | null
  nomeTitularPix: string | null
}) {
  const [copiado, setCopiado] = useState(false)

  async function copiarCodigo() {
    try {
      await navigator.clipboard.writeText(codigoAcesso)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      // clipboard indisponível — o código já está visível na tela
    }
  }

  const dataFormatada = format(new Date(`${data}T00:00:00`), "EEEE, d 'de' MMMM", {
    locale: ptBR,
  })

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary">
        <PartyPopper className="size-7" />
      </span>

      <div>
        <h1 className="font-display text-2xl">Agendamento confirmado!</h1>
        <p className="mt-1 text-muted-foreground">
          Te esperamos {dataFormatada}, às {hora}.
        </p>
      </div>

      <Card className="w-full">
        <CardContent className="flex flex-col gap-3 p-5 text-left">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Serviço</span>
            <span className="font-medium">{servico.nome}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Barbeiro</span>
            <span className="font-medium">{barbeiro.nome}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Valor</span>
            <span className="font-medium">{formatarPreco(servico.preco)}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full border-primary/40 bg-primary/5">
        <CardContent className="flex flex-col items-center gap-2 p-5">
          <p className="text-sm text-muted-foreground">
            Guarde seu código de acesso para consultar ou cancelar depois
          </p>
          <div className="flex items-center gap-2">
            <span className="font-display text-3xl tracking-widest text-primary">
              {codigoAcesso}
            </span>
            <Button variant="ghost" size="icon" onClick={copiarCodigo} aria-label="Copiar código">
              {copiado ? <Check className="size-4" /> : <Copy className="size-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {pixNecessario && chavePix && (
        <Card className="w-full">
          <CardContent className="flex flex-col gap-2 p-5 text-left">
            <p className="font-medium">Pagamento via Pix</p>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Chave Pix</span>
              <span className="font-medium">{chavePix}</span>
            </div>
            {nomeTitularPix && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Titular</span>
                <span className="font-medium">{nomeTitularPix}</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Envie o comprovante para a barbearia pelo WhatsApp para garantir seu horário.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <Button asChild variant="secondary" className="flex-1">
          <Link href="/meus-agendamentos">Meus agendamentos</Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <Link href="/">Voltar ao início</Link>
        </Button>
      </div>
    </div>
  )
}
