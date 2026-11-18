import { useBancoMvp } from '../../app/dados/bancoMvp';
import { ColecaoMvp } from '../../shared/ui/mvp';
import { CabecalhoRotina } from './components/routineUi';
import ImagemCategoriaRotina from './components/categoryArtwork';
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
    <>
      <CabecalhoRotina
        titulo='Categorias'
        descricao='Organize suas tarefas por assunto e identifique cada grupo por cor.'
      />
      <ColecaoMvp
        titulo='Categorias cadastradas'
        colecao='categoria_tarefa'
        registros={categorias}
        padrao={{
          user_id: perfil.user_id,
          cor: '#102a43',
          icone: 'lista',
        }}
        campos={[
          { nome: 'nome', rotulo: 'Nome' },
          { nome: 'cor', rotulo: 'Cor', tipo: 'color' },
          { nome: 'icone', rotulo: 'Ícone', obrigatorio: false },
        ]}
        podeExcluir={false}
        imagem={categoria => <ImagemCategoriaRotina categoria={categoria} />}
        detalhe={c => {
          const total = tarefas.filter(t => t.categoria_id === c.id).length;
          return (
            <span className='inline-flex items-center gap-2'>
              <span
                aria-hidden='true'
                className='size-2.5 rounded-full'
                style={{ backgroundColor: c.cor || 'var(--azul-principal)' }}
              />
              {total} {total === 1 ? 'tarefa' : 'tarefas'}
            </span>
          );
        }}
      />
    </>
  );
}
