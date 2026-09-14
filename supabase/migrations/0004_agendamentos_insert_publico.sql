-- Permite que o público (site, sem login) crie um novo agendamento.
-- Sem essa regra, o banco recusa a gravação mesmo com todos os dados
-- corretos (erro "new row violates row-level security policy").
create policy "Público pode criar agendamentos"
on public.agendamentos
for insert
to anon, authenticated
with check (true);
