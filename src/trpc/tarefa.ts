import { randomUUID } from "node:crypto";
import { TRPCError } from "@trpc/server";

export type Tarefa = {
    id: string;
    titulo: string;
    descricao?: string;
    dataCriacao: string;
};

// Em desenvolvimento o hot reload recarrega os módulos, e em produção o Next pode
// empacotar o servidor em partes separadas. Guardar o array no globalThis faz todas
// as cópias do módulo compartilharem a mesma lista em memória.
const store = globalThis as unknown as { tarefas?: Tarefa[] };

const tarefas: Tarefa[] = store.tarefas ?? (store.tarefas = []);

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

export function buscarTarefa(id: string): Tarefa{
    const tarefa = tarefas.find((l) => l.id === id);
    if (!tarefa) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Tarefa não encontrada",
        });
    }
    return tarefa;
}