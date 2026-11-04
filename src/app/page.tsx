import { HydrateClient, prefetch, trpc } from '@/trpc/server';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ListaTarefas } from './lista-tarefas';

export default async function Home() {
  // prefetch(trpc.hello.queryOptions({ text: 'world' }));

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <ListaTarefas />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}