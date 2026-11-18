import { useBancoMvp } from '../../app/dados/bancoMvp';
import CategoriasRotina from './components/categoriesRotina';
import RecorrenciasRotina from './components/recorrenciasRotina';

export default function GestaoRotina({ visao }) {
  const { b, categorias, tarefas, perfil } = useBancoMvp();
  if (visao === 'recorrencias') {
    const ids = new Set(tarefas.map(tarefa => tarefa.id));
    return (
      <RecorrenciasRotina
        regras={b.recorrencia_tarefa.filter(regra => ids.has(regra.tarefa_id))}
        tarefas={tarefas}
        execucoes={b.execucao_tarefa.filter(execucao =>
          ids.has(execucao.tarefa_id)
        )}
      />
    );
  }

  return (
    <CategoriasRotina
      categorias={categorias}
      tarefas={tarefas}
      userId={perfil.user_id}
    />
  );
}
