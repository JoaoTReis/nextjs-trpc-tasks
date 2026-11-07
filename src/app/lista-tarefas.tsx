'use client';

import { useState } from 'react';
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import Link from 'next/link';

export function ListaTarefas() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [mensagem, setMensagem] = useState<string | null>(null);

   // Os dados já vêm pré-carregados do servidor (prefetch + HydrateClient em page.tsx),
  // então aqui não dispara uma requisição nova na primeira renderização.
  const tarefasQuery = useSuspenseQuery(trpc.tarefa.listar.queryOptions());

  const excluir = useMutation(
    trpc.tarefa.deletar.mutationOptions({
    onSuccess: () => {
      setMensagem('Tarefa excluída com sucesso!');
      // Invalida a lista pra ela ser buscada de novo e a tarefa excluída sair da tela
      queryClient.invalidateQueries(trpc.tarefa.listar.queryFilter());
    },
    onError: (error) => {
      // Mostra o erro que veio do backend (ex.: tarefa já não existe mais)
      setMensagem(`Erro ao excluir tarefa: ${error.message}`);
    }},
  ));

  return (
  <div>
    <Link href="/tarefas/nova">Nova tarefa</Link>

    {mensagem && <p>{mensagem}</p>}

    {tarefasQuery.data.length === 0 ? (
      <p>Nenhuma tarefa criada ainda!</p>
    ) : (
      <ul>
        {tarefasQuery.data.map((tarefa) => (
          <li key={tarefa.id}>
            <strong>{tarefa.titulo}</strong> - {tarefa.descricao || 'Sem descrição'}
            <Link href={`/tarefas/${tarefa.id}`}>Editar</Link>
            <button onClick={() => excluir.mutate({ id: tarefa.id })}>Excluir</button>
          </li>
        ))}
      </ul>
    )}
  </div>
)};