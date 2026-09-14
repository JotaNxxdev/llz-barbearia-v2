-- Adiciona "já foi avaliado?" ao retorno de buscar_agendamentos_cliente,
-- para a tela "Meus agendamentos" saber quando mostrar o botão de avaliar.
drop function if exists public.buscar_agendamentos_cliente(text, text);

create function public.buscar_agendamentos_cliente(
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
  barbeiro_nome text,
  ja_avaliado boolean
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
    b.nome as barbeiro_nome,
    exists(select 1 from public.avaliacoes av where av.agendamento_id = a.id) as ja_avaliado
  from public.agendamentos a
  join public.servicos s on s.id = a.servico_id
  join public.barbeiros b on b.id = a.barbeiro_id
  where a.cliente_whatsapp = p_whatsapp
    and a.codigo_acesso = upper(p_codigo_acesso)
  order by a.data desc, a.hora desc;
$$;

grant execute on function public.buscar_agendamentos_cliente(text, text) to anon, authenticated;

-- Registra a avaliação de um agendamento concluído, confirmando que
-- quem está avaliando é o mesmo cliente (WhatsApp + código de acesso)
-- e que ainda não existe avaliação para esse agendamento.
create or replace function public.avaliar_agendamento(
  p_agendamento_id uuid,
  p_whatsapp text,
  p_codigo_acesso text,
  p_nota int,
  p_comentario text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  if p_nota < 1 or p_nota > 5 then
    return false;
  end if;

  select tenant_id into v_tenant_id
  from public.agendamentos
  where id = p_agendamento_id
    and cliente_whatsapp = p_whatsapp
    and codigo_acesso = upper(p_codigo_acesso)
    and status = 'concluido';

  if v_tenant_id is null then
    return false;
  end if;

  if exists(select 1 from public.avaliacoes where agendamento_id = p_agendamento_id) then
    return false;
  end if;

  insert into public.avaliacoes (tenant_id, agendamento_id, nota, comentario)
  values (v_tenant_id, p_agendamento_id, p_nota, nullif(trim(p_comentario), ''));

  return true;
end;
$$;

grant execute on function public.avaliar_agendamento(uuid, text, text, int, text) to anon, authenticated;
