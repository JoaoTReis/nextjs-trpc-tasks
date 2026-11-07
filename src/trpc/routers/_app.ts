import { createTRPCRouter } from '../init';
import { tarefaRouter } from './tarefaRouter';

// Router raiz: junta os sub-routers por namespace (trpc.tarefa.listar, trpc.tarefa.criar, ...).
// Se o projeto crescesse, cada novo domínio entraria aqui como mais uma chave.
export const appRouter = createTRPCRouter({
  tarefa: tarefaRouter,
});

// Só o tipo é exportado pro frontend (import type), então nenhum código do servidor
// vai pro bundle do cliente. É daqui que vem a tipagem de ponta a ponta.
export type AppRouter = typeof appRouter;