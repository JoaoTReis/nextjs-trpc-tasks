import { HydrateClient, prefetch, trpc } from '@/trpc/server';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ListaTarefas } from './lista-tarefas';

// A lista muda a cada requisição (dados em memória), então a página
// não pode ser gerada estaticamente no build, tem que renderizar no servidor sempre.
export const dynamic = 'force-dynamic';

export default async function Home() {
  // SSR: a busca começa no servidor, antes do cliente receber qualquer coisa.
  // Não uso await de propósito: a query fica "pendente" e o resultado vai
  // sendo enviado por streaming pro cliente, que já recebe os dados hidratados
  // no cache do React Query (por isso o useSuspenseQuery no componente não refaz a requisição).
  prefetch(trpc.tarefa.listar.queryOptions());

  return (
    <HydrateClient>
      {/* Se a busca falhar, mostra uma mensagem em vez de quebrar a página inteira */}
      <ErrorBoundary fallback={<div>Algo deu errado ao carregar as tarefas</div>}>
      {/* Enquanto os dados não chegam, o usuário vê o "Carregando..." */}
        <Suspense fallback={<div>Carregando...</div>}>
          <ListaTarefas />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}