-- Funções seguras para a página "Meus agendamentos".
--
-- Por quê uma função em vez de simplesmente liberar leitura pública da
-- tabela `agendamentos`? Porque essa tabela guarda nome, WhatsApp e
-- e-mail dos clientes. Se qualquer pessoa pudesse ler a tabela toda,
-- alguém malicioso conseguiria baixar os dados de todos os clientes da
-- barbearia usando a mesma chave pública do site. Com uma função, o
-- cliente só recebe agendamentos que baterem exatamente com o WhatsApp
-- e o código de acesso informados.

create or replace function public.buscar_agendamentos_cliente(
  p_whatsapp text,
  p_codigo_acesso text
)
returns table (
  id uuid,
  data date,
  hora time,
  status text,
  pix_status text,
  observacao text,
  codigo_acesso text,
  servico_nome text,
  servico_preco numeric,
  barbeiro_nome text
)
language sql
security definer
set search_path = public
as $$
  select
    a.id,
    a.data,
    a.hora,
    a.status,
    a.pix_status,
    a.observacao,
    a.codigo_acesso,
    s.nome as servico_nome,
    s.preco as servico_preco,
    b.nome as barbeiro_nome
  from public.agendamentos a
  join public.servicos s on s.id = a.servico_id
  join public.barbeiros b on b.id = a.barbeiro_id
  where a.cliente_whatsapp = p_whatsapp
    and a.codigo_acesso = upper(p_codigo_acesso)
  order by a.data desc, a.hora desc;
$$;

grant execute on function public.buscar_agendamentos_cliente(text, text) to anon, authenticated;

-- Cancela um agendamento, mas só se o WhatsApp e o código de acesso
-- baterem com o dono do agendamento e faltarem mais de 2 horas para o
-- horário marcado (mesma regra descrita no briefing).
create or replace function public.cancelar_agendamento(
  p_id uuid,
  p_whatsapp text,
  p_codigo_acesso text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_data date;
  v_hora time;
  v_agora timestamp;
begin
  select data, hora into v_data, v_hora
  from public.agendamentos
  where id = p_id
    and cliente_whatsapp = p_whatsapp
    and codigo_acesso = upper(p_codigo_acesso)
    and status <> 'cancelado';

  if v_data is null then
    return false;
  end if;

  v_agora := now() at time zone 'America/Sao_Paulo';

  if (v_data + v_hora) - v_agora < interval '2 hours' then
    return false;
  end if;

  update public.agendamentos set status = 'cancelado' where id = p_id;
  return true;
end;
$$;

grant execute on function public.cancelar_agendamento(uuid, text, text) to anon, authenticated;
