import { HydrateClient, prefetch, trpc } from '@/trpc/server';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ListaTarefas } from './lista-tarefas';

export const dynamic = 'force-dynamic';

export default async function Home() {
  prefetch(trpc.tarefa.listar.queryOptions());

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Algo deu errado ao carregar as tarefas</div>}>
        <Suspense fallback={<div>Carregando...</div>}>
          <ListaTarefas />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}