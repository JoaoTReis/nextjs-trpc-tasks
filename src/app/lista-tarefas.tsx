'use client';

import { useState } from 'react';
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import Link from 'next/link';

export function ListaTarefas() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [mensagem, setMensagem] = useState<string | null>(null);

  const tarefasQuery = useSuspenseQuery(trpc.tarefa.listar.queryOptions());

  const excluir = useMutation(
    trpc.tarefa.deletar.mutationOptions({
    onSuccess: () => {
      setMensagem('Tarefa excluída com sucesso!');
      queryClient.invalidateQueries(trpc.tarefa.listar.queryFilter());
    },
    onError: (error: any) => {
      setMensagem(`Erro ao excluir tarefa: ${error.message}`);
    }},
  ));

  if (tarefasQuery.data.length === 0) {
    return <p>Nenhuma Tarefa criada ainda!</p>
  }

  return <div>
    {mensagem && <p>{mensagem}</p>}
    <Link href="/tarefas/nova">Nova tarefa</Link>
    <ul>
      {tarefasQuery.data.map((tarefa) => (
        <li key={tarefa.id}>
          <strong>{tarefa.titulo}</strong> - {tarefa.descricao || 'Sem descrição'}
          <button onClick={() => excluir.mutate({ id: tarefa.id })}>Excluir</button>
        </li>
      ))}
    </ul>
  </div>;
}