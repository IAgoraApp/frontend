import { useDadosServidor } from '../../../app/dados/contextoServidor';
import { salvarCategoriaRotina } from '../rotinaApi';
import { useAvisoPerfilA } from '../../../app/avisos/avisosPerfilA';
import { useId, useState } from 'react';
import { ChevronRight, ListChecks, Pencil, Plus, Trash2 } from 'lucide-react';
import { alterarBanco, salvarRegistro } from '../../../app/dados/bancoMvp';
import { EditorMvp } from '../../../shared/ui/mvp';
import ImagemCategoriaRotina from './categoryArtwork';
import ModalRotina from './routineModal';
import { BotaoRotina, CabecalhoRotina } from './routineUi';

const campos = [
  { nome: 'nome', rotulo: 'Nome', limite: 100 },
  { nome: 'cor', rotulo: 'Cor', tipo: 'color' },
  { nome: 'icone', rotulo: 'Ícone', limite: 100, obrigatorio: false },
];
const quantidade = total => total + (total === 1 ? ' tarefa' : ' tarefas');

export default function CategoriasRotina({ categorias, tarefas, userId }) {
  const servidor = useDadosServidor();
  const idTitulo = useId();
  const [modal, setModal] = useState(null);
  const notificar = useAvisoPerfilA();
  const [erro, setErro] = useState('');
  const categoria = categorias.find(c => c.id === modal?.id);
  const vinculadas = tarefas.filter(t => t.categoria_id === categoria?.id);
  const modo = modal?.modo;
  const titulo = {
    nova: 'Nova categoria',
    detalhe: categoria?.nome,
    editar: 'Editar categoria',
    excluir: 'Excluir categoria?',
  }[modo];

  function abrir(proximo, id = modal?.id) {
    setErro('');
    setModal({ modo: proximo, id });
  }

  async function excluir() {
    try {
      if (servidor) {
        await salvarCategoriaRotina(categoria.id);
        await servidor.atualizar();
      } else alterarBanco(b => {
        if (b.tarefa.some(t => t.categoria_id === categoria.id))
          throw new Error(
            'Mova as tarefas vinculadas para outra categoria antes de excluir.'
          );
        b.categoria_tarefa = b.categoria_tarefa.filter(
          c => c.id !== categoria.id || c.user_id !== userId
        );
      });
      notificar('Categoria excluída.');
      setModal(null);
    } catch (falha) {
      setErro(falha.message);
    }
  }

  return (
    <>
      <CabecalhoRotina titulo='Categorias'>
        <BotaoRotina onClick={() => abrir('nova')}>
          <Plus size={17} aria-hidden='true' /> Nova categoria
        </BotaoRotina>
      </CabecalhoRotina>
      {categorias.length ? (
        <ul className='rotina-categorias'>
          {categorias.map(c => (
            <li key={c.id}>
              <button
                type='button'
                className='rotina-categoria-card'
                onClick={() => abrir('detalhe', c.id)}
              >
                <ImagemCategoriaRotina categoria={c} />
                <span className='rotina-categoria-rotulo'>
                  <span className='min-w-0 flex-1'>
                    <strong>{c.nome}</strong>
                    <small>
                      {quantidade(
                        tarefas.filter(t => t.categoria_id === c.id).length
                      )}
                    </small>
                  </span>
                  <ChevronRight size={18} aria-hidden='true' />
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className='rotina-extrato-vazio'>Nenhuma categoria cadastrada.</p>
      )}
      {modal && (categoria || modo === 'nova') && (
        <ModalRotina
          chaveModal={modo}
          idTitulo={idTitulo}
          aoFechar={() => setModal(null)}
          aoVoltar={
            modo === 'editar' || modo === 'excluir'
              ? () => abrir(modo === 'excluir' ? 'editar' : 'detalhe')
              : undefined
          }
        >
          <div data-modal-ativo='true' className='rotina-categoria-modal'>
            {modo === 'detalhe' && (
              <ImagemCategoriaRotina categoria={categoria} />
            )}
            <h2
              tabIndex={-1}
              id={idTitulo}
              className='font-titulo text-2xl leading-tight font-extrabold wrap-anywhere'
            >
              {titulo}
            </h2>
            {modo === 'detalhe' && (
              <>
                <dl className='rotina-detalhe-dados'>
                  <div>
                    <dt>Cor</dt>
                    <dd className='flex items-center gap-2'>
                      <span
                        aria-hidden='true'
                        className='size-3 rounded-full'
                        style={{ backgroundColor: categoria.cor || '#102a43' }}
                      />
                      {categoria.cor || 'Padrão'}
                    </dd>
                  </div>
                  <div>
                    <dt>Ícone</dt>
                    <dd>{categoria.icone || 'Padrão'}</dd>
                  </div>
                </dl>
                <section
                  className='rotina-categoria-vinculos'
                  aria-label='Tarefas vinculadas'
                >
                  <h3>
                    <ListChecks size={17} aria-hidden='true' />{' '}
                    {quantidade(vinculadas.length)} na categoria
                  </h3>
                  {vinculadas.length ? (
                    <ul>
                      {vinculadas.map(t => (
                        <li key={t.id}>{t.nome}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Nenhuma tarefa vinculada.</p>
                  )}
                </section>
                <BotaoRotina onClick={() => abrir('editar')}>
                  <Pencil size={17} aria-hidden='true' /> Editar categoria
                </BotaoRotina>
              </>
            )}
            {['nova', 'editar'].includes(modo) && (
              <div className='rotina-categoria-editor'>
                <EditorMvp
                  key={modo}
                  cabecalho={false}
                  inicial={
                    categoria ?? {
                      user_id: userId,
                      cor: '#102a43',
                      icone: 'lista',
                    }
                  }
                  campos={campos}
                  rotuloSalvar='Salvar categoria'
                  acaoSecundaria={
                    categoria && (
                      <button
                        type='button'
                        className='rotina-detalhe-excluir'
                        onClick={() => abrir('excluir')}
                      >
                        <Trash2 size={16} aria-hidden='true' /> Excluir
                        categoria
                      </button>
                    )
                  }
                  onSave={async v => {
                    if (servidor) {
                      await salvarCategoriaRotina(v.id, { nome: v.nome, cor: v.cor, icone: v.icone });
                      await servidor.atualizar();
                    } else salvarRegistro('categoria_tarefa', v);
                    notificar(
                      categoria ? 'Categoria atualizada.' : 'Categoria criada.'
                    );
                  }}
                  onClose={() =>
                    categoria ? abrir('detalhe') : setModal(null)
                  }
                />
              </div>
            )}
            {modo === 'excluir' && (
              <>
                <p className='text-sm text-(--texto-apoio)'>
                  {vinculadas.length
                    ? 'Mova as tarefas vinculadas para outra categoria antes de excluir.'
                    : 'A categoria “' +
                      categoria.nome +
                      '” será removida da sua rotina.'}
                </p>
                {erro && (
                  <p role='alert' className='text-sm text-(--vermelho-alerta)'>
                    {erro}
                  </p>
                )}
                <div className='flex flex-wrap justify-end gap-2'>
                  <BotaoRotina tom='secundario' onClick={() => abrir('editar')}>
                    Manter categoria
                  </BotaoRotina>
                  {!vinculadas.length && (
                    <BotaoRotina
                      classe='bg-(--vermelho-alerta)!'
                      onClick={excluir}
                    >
                      Confirmar exclusão
                    </BotaoRotina>
                  )}
                </div>
              </>
            )}
          </div>
        </ModalRotina>
      )}
    </>
  );
}
