import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { criarTarefa, listarTarefas, atualizarTarefa, deletarTarefa, buscarTarefa} from '@/trpc/tarefa';

export const tarefaRouter = createTRPCRouter({
  criar: baseProcedure.input(z.object({ titulo: z.string().trim().min(1, "O título é obrigatório"), descricao: z.string().optional()})).mutation(({ input }) => {
    return criarTarefa(input.titulo, input.descricao);
  }),

  listar: baseProcedure.query(() => {
    return listarTarefas();
  }),

  atualizar: baseProcedure.input(z.object({ id: z.string(), titulo: z.string().trim().min(1, "O título é obrigatório"), descricao: z.string().optional()})).mutation(({ input }) => {
    return atualizarTarefa(input.id, input.titulo, input.descricao);
  }),

  deletar: baseProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
    deletarTarefa(input.id);
    return { success: true };
  }),

  buscar: baseProcedure.input(z.object({ id: z.string() })).query(({ input }) => {
    return buscarTarefa(input.id);
  }),

});

// export type definition of API
export type tarefaRouter = typeof tarefaRouter;