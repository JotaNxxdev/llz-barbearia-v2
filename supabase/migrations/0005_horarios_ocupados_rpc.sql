-- Devolve só os horários (hora) já ocupados de um barbeiro em uma data,
-- sem expor nome/WhatsApp/e-mail dos clientes por trás desses horários.
-- Usada para montar a lista de horários livres na tela de agendamento.
create or replace function public.horarios_ocupados(
  p_barbeiro_id uuid,
  p_data date
)
returns table (hora time)
language sql
security definer
set search_path = public
as $$
  select hora
  from public.agendamentos
  where barbeiro_id = p_barbeiro_id
    and data = p_data
    and status <> 'cancelado';
$$;

grant execute on function public.horarios_ocupados(uuid, date) to anon, authenticated;
