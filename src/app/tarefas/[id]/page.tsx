import { HydrateClient, prefetch, trpc } from '@/trpc/server';
import { EditarTarefa } from '@/app/editar-tarefa';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';

export default async function EditarTarefaPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    prefetch(trpc.tarefa.buscar.queryOptions({ id }));

    return (
        <HydrateClient>
            <main>
                <h1>Editar Tarefa</h1>
                <ErrorBoundary fallback={<div>Não foi possível carregar a tarefa.</div>}>
                    <Suspense fallback={<div>Carregando...</div>}>
                    <EditarTarefa id={id} />
                    </Suspense>
                </ErrorBoundary>
            </main>
        </HydrateClient>
    );
}