import { createTRPCRouter } from '../init';
import { tarefaRouter } from './tarefaRouter';

export const appRouter = createTRPCRouter({
  tarefa: tarefaRouter,
});

// tipo da API, usado pelo front
export type AppRouter = typeof appRouter;