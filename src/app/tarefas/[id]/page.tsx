import { HydrateClient, prefetch, trpc } from '@/trpc/server';
import { EditarTarefa } from '@/app/editar-tarefa';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';


// No Next 15 os `params` de rotas dinâmicas são uma Promise, por isso o await.
// Como a rota depende do id, ela é renderizada sob demanda a cada acesso.
export default async function EditarTarefaPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

     // Mesma ideia da listagem: a busca começa no servidor (SSR) e o resultado
    // é hidratado no cache do React Query, então o formulário já abre preenchido.
    prefetch(trpc.tarefa.buscar.queryOptions({ id }));

    return (
        <HydrateClient>
            <main>
                <h1>Editar Tarefa</h1>
                 {/* Se o id não existir (NOT_FOUND), o usuário vê esta mensagem em vez de uma tela quebrada */}
                <ErrorBoundary fallback={<div>Não foi possível carregar a tarefa.</div>}>
                    <Suspense fallback={<div>Carregando...</div>}>
                    <EditarTarefa id={id} />
                    </Suspense>
                </ErrorBoundary>
            </main>
        </HydrateClient>
    );
}