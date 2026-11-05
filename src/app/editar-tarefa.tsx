'use client';

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { FormTarefa } from "./form-tarefa";

export function EditarTarefa({ id }: { id: string }) {
    const trpc = useTRPC();
    const tarefaQuery = useSuspenseQuery(trpc.tarefa.buscar.queryOptions({ id }));

    return <FormTarefa tarefa={tarefaQuery.data} />;
}