'use client';

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { FormTarefa } from "./form-tarefa";

// Componente fino que só busca a tarefa e entrega pro formulário.
// Separei do FormTarefa pra ele continuar servindo tanto pra criar quanto pra editar,
// sem precisar saber de onde os dados vêm.
export function EditarTarefa({ id }: { id: string }) {
    const trpc = useTRPC();

     // A tarefa já vem hidratada do prefetch feito em tarefas/[id]/page.tsx.
    // Se o id não existir, o buscar lança NOT_FOUND e o erro cai no ErrorBoundary da página.
    const tarefaQuery = useSuspenseQuery(trpc.tarefa.buscar.queryOptions({ id }));

    return <FormTarefa tarefa={tarefaQuery.data} />;
}