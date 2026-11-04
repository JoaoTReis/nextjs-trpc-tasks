import { randomUUID } from "node:crypto";
import { TRPCError } from "@trpc/server";

export type Tarefa = {
    id: string;
    titulo: string;
    descricao?: string;
    dataCriacao: string;
};

const tarefas: Tarefa[] = [];

export function criarTarefa(titulo: string, descricao?: string): Tarefa {
    const novo: Tarefa = {
        id: randomUUID(),
        titulo,
        descricao,
        dataCriacao: new Date().toISOString(),
    };
    tarefas.push(novo);
    return novo;
}

export function listarTarefas(): Tarefa[] {
    return [...tarefas];
}

export function atualizarTarefa(id: string, titulo: string, descricao?: string): Tarefa {
    const tarefa = tarefas.find(t => t.id === id);
    if (!tarefa) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Tarefa não encontrada",
        });
    }
    tarefa.titulo = titulo;
    tarefa.descricao = descricao;
    return tarefa;
}

export function deletarTarefa(id: string): void {
    const index = tarefas.findIndex(t => t.id === id);
    if (index === -1) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Tarefa não encontrada",
        });
    }
    tarefas.splice(index, 1);
}

