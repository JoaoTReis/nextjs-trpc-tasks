'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import type { Tarefa } from '@/trpc/tarefa';

// Um formulário só pra criar e editar: se vier `tarefa`, é edição e os campos
// já começam preenchidos; se não vier, é criação com os campos vazios.
export function FormTarefa({ tarefa }: { tarefa?: Tarefa }) {
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();

    const [titulo, setTitulo] = useState(tarefa?.titulo ?? '');
    const [descricao, setDescricao] = useState(tarefa?.descricao ?? '');
    const [mensagem, setMensagem] = useState<string | null>(null);

    const criarTarefa = useMutation(
        trpc.tarefa.criar.mutationOptions({
            onSuccess: () => {
                // Invalida a lista pra ela mostrar a tarefa nova ao voltar pra home
                queryClient.invalidateQueries(trpc.tarefa.listar.queryFilter());
                router.push('/');
            },
            onError: (error) => {
                setMensagem(`Erro ao criar tarefa: ${error.message}`);
            },
        }),
    );

    const atualizarTarefa = useMutation(
        trpc.tarefa.atualizar.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(trpc.tarefa.listar.queryFilter());
                if (tarefa) {
                    router.push('/');
                }
            }
        }));



    function enviar() {
        if (titulo.trim() === '') {
            setMensagem('O título é obrigatório.');
            return;
        }
        setMensagem(null);

        if (tarefa) {
            atualizarTarefa.mutate({ id: tarefa.id, titulo, descricao: descricao || undefined });
        } else {
            criarTarefa.mutate({ titulo, descricao });
        }
    }

    return (
        <div>
            <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Título"
            />
            <input
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descrição"
            />
            <button onClick={enviar}>{tarefa ? 'Salvar alterações' : 'Criar Tarefa'}</button>
            {mensagem && <p>{mensagem}</p>}

            <button type="button" onClick={() => router.push('/')}>
                Cancelar
            </button>

        </div>
    );
};