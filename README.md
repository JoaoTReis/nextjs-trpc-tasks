# Gerenciador de Tarefas (Next.js 15 + tRPC)

Aplicação simples de gerenciamento de tarefas feita como desafio técnico. O backend mantém a lista de tarefas **em memória** (sem banco de dados) e é exposto via **tRPC**. O frontend é feito com Next.js (App Router) e consome a API com TanStack React Query.

> As respostas da Parte 1 (questões teóricas) estão em [`RESPOSTAS.md`](./RESPOSTAS.md).

## Stack

- [Next.js 15](https://nextjs.org) (App Router) + React 19
- [tRPC v11](https://trpc.io) + `@trpc/tanstack-react-query`
- [TanStack React Query v5](https://tanstack.com/query)
- [Zod](https://zod.dev) para validação de entrada
- TypeScript, Tailwind CSS (configurado, uso mínimo)

## Como executar

Pré-requisito: Node.js 18.18+ (recomendado 20+).

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Outros comandos:

```bash
npm run lint    # checagem com ESLint
npm run build   # build de produção
npm run start   # serve o build de produção
```

Não há variáveis de ambiente nem informações sensíveis no projeto.

## Funcionalidades

- **Listar** tarefas (página inicial, pré-carregadas no servidor).
- **Criar** tarefa (`/tarefas/nova`).
- **Editar** tarefa (`/tarefas/[id]`).
- **Excluir** tarefa direto na listagem, com mensagem de sucesso/erro.
- Validação de título obrigatório no frontend e no backend.
- Erros do backend (ex.: tarefa inexistente) exibidos ao usuário.

## Rotas

| Rota | Descrição |
| --- | --- |
| `/` | Lista de tarefas (SSR com prefetch) |
| `/tarefas/nova` | Formulário de criação |
| `/tarefas/[id]` | Formulário de edição (SSR com prefetch da tarefa) |
| `/api/trpc/*` | Endpoint HTTP do tRPC |

## API (tRPC)

Router `tarefa`:

| Procedure | Tipo | Entrada | Observação |
| --- | --- | --- | --- |
| `listar` | query | – | Retorna todas as tarefas |
| `buscar` | query | `{ id }` | `NOT_FOUND` se não existir |
| `criar` | mutation | `{ titulo, descricao? }` | Título obrigatório (após `trim`) |
| `atualizar` | mutation | `{ id, titulo, descricao? }` | `NOT_FOUND` se não existir |
| `deletar` | mutation | `{ id }` | `NOT_FOUND` se não existir |

Modelo de dados:

```ts
type Tarefa = {
  id: string;           // UUID gerado no servidor
  titulo: string;       // obrigatório
  descricao?: string;   // opcional
  dataCriacao: string;  // ISO 8601
};
```

## Estrutura do projeto

```
src/
├── app/
│   ├── page.tsx                 # Listagem (Server Component, faz prefetch)
│   ├── lista-tarefas.tsx        # Lista + exclusão (Client Component)
│   ├── form-tarefa.tsx          # Formulário de criação/edição
│   ├── editar-tarefa.tsx        # Carrega a tarefa e renderiza o formulário
│   ├── tarefas/nova/page.tsx    # Página de criação
│   ├── tarefas/[id]/page.tsx    # Página de edição
│   └── api/trpc/[trpc]/route.ts # Handler HTTP do tRPC
└── trpc/
    ├── init.ts                  # Inicialização do tRPC e contexto
    ├── tarefa.ts                # "Banco" em memória + regras de negócio
    ├── routers/                 # Routers (tarefaRouter, _app)
    ├── client.tsx               # Provider do tRPC/React Query (cliente)
    ├── server.tsx               # Helpers de prefetch e hidratação (servidor)
    └── query-client.ts          # Configuração do QueryClient
```

## Decisões de projeto

- **SSR com prefetch + hidratação:** as páginas de listagem e edição são Server Components que chamam `prefetch(...)` e envolvem o conteúdo em `HydrateClient`. O HTML já chega com os dados, e o React Query assume no cliente (cache, invalidação, mutações).
- **`force-dynamic` na home:** como os dados mudam a cada requisição, a página não deve ser gerada estaticamente no build.
- **Dados em memória via `globalThis`:** o hot reload do Next recarrega módulos e, em produção, o servidor pode ser dividido em vários bundles. Guardar o array em `globalThis` garante que todas as cópias do módulo compartilhem a mesma lista.
- **Separação entre regra de negócio e router:** `tarefa.ts` contém as funções de CRUD e lança `TRPCError` com códigos significativos; o router só valida a entrada (Zod) e delega.
- **Validação em duas camadas:** o formulário bloqueia o envio sem título (feedback imediato) e o Zod no backend rejeita título vazio ou só com espaços (`.trim().min(1)`).
- **Tipagem ponta a ponta:** o frontend importa o tipo `AppRouter`, então chamadas e retornos são tipados sem código gerado.
- **Visual mínimo:** o foco é a funcionalidade, conforme a dica do desafio ("menos é mais").

## Limitações conhecidas

- **Sem persistência:** reiniciar o servidor apaga todas as tarefas.
- **Não escala horizontalmente / serverless:** como o estado vive na memória de um processo, múltiplas instâncias (ex.: deploy na Vercel com funções serverless) não compartilhariam os dados. Para uso real, trocar `tarefa.ts` por um banco de dados.
- **Sem autenticação:** o contexto do tRPC tem um `userId` fixo apenas como placeholder.
- **Sem paginação / infinite scroll** (item bônus não implementado).