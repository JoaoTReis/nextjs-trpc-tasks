'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';

export function FormTarefa() {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [mensagem, setMensagem] = useState<string | null>(null);

  const criarTarefa = useMutation(
    trpc.tarefa.criar.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.tarefa.listar.queryFilter());
        router.push('/');
      },
      onError: (error: any) => {
        setMensagem(`Erro ao criar tarefa: ${error.message}`);
      },
    }),
  );

  function enviar(){
    if (titulo.trim() === '') {
      setMensagem('O título é obrigatório.');
      return;
    }
    criarTarefa.mutate({ titulo, descricao });
  }
  
  return (
  <div>
    <input
      type="text"
      onChange={(e) => setTitulo(e.target.value)}
      placeholder="Título"
    />
    <input
      value={descricao}
      onChange={(e) => setDescricao(e.target.value)}
      placeholder="Descrição"
    />
    <button onClick={enviar}>Criar Tarefa</button>
    {mensagem && <p>{mensagem}</p>}

  </div>
  );
}