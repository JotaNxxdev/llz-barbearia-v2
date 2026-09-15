-- Permite que o dono autenticado leia (apenas) o próprio registro na
-- tabela donos, usado para descobrir a que tenant ele pertence ao
-- entrar no painel. Sem essa regra, a consulta é bloqueada mesmo com
-- o dado correto na tabela.
drop policy if exists "Dono pode ver seu próprio registro" on public.donos;

create policy "Dono pode ver seu próprio registro"
on public.donos
for select
to authenticated
using (id = auth.uid());
