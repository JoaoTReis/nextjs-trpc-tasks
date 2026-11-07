import { FormTarefa } from "@/app/form-tarefa";

// Página de criação: é só o formulário sem `tarefa`, então os campos começam vazios.
// Não precisa de prefetch nem Suspense porque não busca nenhum dado.
export default function NovaTarefa() {
  return (
    <main>
      <h1>Criar Nova Tarefa</h1>
      <FormTarefa />
    </main>
  );
}