# LLz Barbearia — Sistema de Agendamento

Sistema de agendamento online para barbearias, construído com **Next.js**
(App Router), **TypeScript**, **Tailwind CSS** e **Supabase** (Postgres +
Auth). O primeiro cliente é a LLz Barbearia, mas a base foi pensada para
virar um template reaproveitável por outros negócios de serviço.

## Como rodar localmente

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Copie o arquivo de exemplo de variáveis de ambiente e preencha com as
   credenciais do Supabase:

   ```bash
   cp .env.local.example .env.local
   ```

   O arquivo `.env.local` nunca é enviado ao GitHub (está no `.gitignore`) —
   é só para a sua máquina.

3. Rode o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

4. Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Estrutura do projeto

- `src/app/(site)` — páginas públicas do site (home, agendamento, etc.),
  todas compartilhando o cabeçalho/rodapé da barbearia.
- `src/lib/supabase` — clientes de conexão com o Supabase (navegador,
  servidor e proxy de sessão).
- `src/lib/tenant.ts` — funções que buscam os dados da barbearia no banco.
- `src/types/database.ts` — tipos das tabelas do banco de dados.
- `src/components` — componentes de interface reutilizáveis.

## Deploy

O projeto é feito para ser publicado na [Vercel](https://vercel.com). Basta
importar o repositório e configurar as mesmas variáveis de ambiente do
`.env.local.example` no painel do projeto.
