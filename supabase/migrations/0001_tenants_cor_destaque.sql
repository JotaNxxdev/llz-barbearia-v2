-- Adiciona a cor de destaque personalizável de cada barbearia (tenant).
-- O valor padrão é o dourado já usado no visual da LLz Barbearia, então
-- nada muda visualmente para ela ao rodar esta migração.
alter table public.tenants
  add column if not exists cor_destaque text not null default '#c9a24b';
