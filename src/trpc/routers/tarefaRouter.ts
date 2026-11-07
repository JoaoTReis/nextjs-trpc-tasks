import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { criarTarefa, listarTarefas, atualizarTarefa, deletarTarefa, buscarTarefa} from '@/trpc/tarefa';


// Validação feita com zod no router, então nenhuma regra de entrada vaza pra dentro de tarefa.ts.
// O trim() roda antes do min(1), então um título só com espaços também é rejeitado.
// Como o valor já chega limpo, o título é salvo sem espaços nas pontas.
export const tarefaRouter = createTRPCRouter({
  criar: baseProcedure.input(z.object({ titulo: z.string().trim().min(1, "O título é obrigatório"), descricao: z.string().optional()})).mutation(({ input }) => {
    return criarTarefa(input.titulo, input.descricao);
  }),

  listar: baseProcedure.query(() => {
    return listarTarefas();
  }),

  // Se o id não existir, o TRPCError NOT_FOUND vem de tarefa.ts e chega no onError do frontend
  atualizar: baseProcedure.input(z.object({ id: z.string(), titulo: z.string().trim().min(1, "O título é obrigatório"), descricao: z.string().optional()})).mutation(({ input }) => {
    return atualizarTarefa(input.id, input.titulo, input.descricao);
  }),

  // Retorna um objeto em vez de void pra mutation ter um resultado explícito no cliente
  deletar: baseProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
    deletarTarefa(input.id);
    return { success: true };
  }),

  buscar: baseProcedure.input(z.object({ id: z.string() })).query(({ input }) => {
    return buscarTarefa(input.id);
  }),

});

