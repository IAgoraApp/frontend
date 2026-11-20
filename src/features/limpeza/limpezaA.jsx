import { useAvisoPerfilA } from '../../app/avisos/avisosPerfilA';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ClipboardList, Plus, Sparkles, Trash2 } from 'lucide-react';
import {
  alterarBanco,
  hoje,
  inserir,
  removerRegistro,
  salvarRegistro,
  useBancoMvp,
} from '../../app/dados/bancoMvp';
import { EditorMvp, PaginaMvp } from '../../shared/ui/mvp';
import { DialogoCasa } from '../casa/components/casaUi';
import CardsComodos from './components/cardsComodos';
import { imagemComodo } from './utils/imagemComodo';
import ListaLimpezas from './components/listaLimpezas';
import ExtratoLimpeza from './components/extratoLimpeza';
import { ordenarLimpezas } from './utils/agendaLimpeza';
import { dataLocalExecucao } from './utils/extratoLimpeza';
import './limpezaA.css';

export default function LimpezaA() {
  const { b, casa, comodos, limpezas, perfil } = useBancoMvp();
  const [params, setParams] = useSearchParams();
  const [modal, setModal] = useState(null);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);
  const notificar = useAvisoPerfilA();
  const dia = hoje();
  const ehHistorico = params.get('visao') === 'historico';
  const comodo = ehHistorico
    ? undefined
    : comodos.find(c => c.id === Number(params.get('comodo')));
  const historico = b.execucao_limpeza.filter(e =>
    limpezas.some(l => l.id === e.limpeza_id)
  );
  const lista = ordenarLimpezas(limpezas, dia);
  const comodoDaTarefa = modal?.item
    ? comodos.find(c => c.id === modal.item.comodo_id)
    : comodo;
  const tarefasComodo = comodo
    ? lista.filter(item => item.comodo_id === comodo.id)
    : [];
  const feitasNoComodo = tarefasComodo.filter(
    item => item.ultima_vez === dia
  ).length;

  function selecionarComodo(id) {
    setParams(
      anteriores => {
        const novos = new URLSearchParams(anteriores);
        if (id) novos.set('comodo', String(id));
        else novos.delete('comodo');
        return novos;
      },
      { replace: true, preventScrollReset: true }
    );
  }

  function fecharModal() {
    if (modal) {
      setConfirmarExclusao(false);
      setModal(null);
    } else selecionarComodo(null);
  }

  const acoesLista = {
    comodos,
    hoje: dia,
    aoConcluir: concluir,
    aoEditar: item => setModal({ tipo: 'limpeza', item }),
  };

  function concluir(limpeza) {
    alterarBanco(db => {
      const atual = db.limpezas.find(l => l.id === limpeza.id);
      if (!atual || atual.ultima_vez === dia) return;
      inserir(
        'execucao_limpeza',
        {
          limpeza_id: limpeza.id,
          perfil_id: perfil.id,
          realizada_em: new Date().toISOString(),
        },
        db
      );
      atual.ultima_vez = dia;
    });
    notificar(`Limpeza registrada: ${limpeza.nome}.`);
  }

  function excluirExecucao(id) {
    alterarBanco(db => {
      const execucao = db.execucao_limpeza.find(item => item.id === id);
      const atividade = db.limpezas.find(
        item =>
          item.id === execucao?.limpeza_id &&
          comodos.some(c => c.id === item.comodo_id)
      );
      if (!atividade) return;
      db.execucao_limpeza = db.execucao_limpeza.filter(item => item.id !== id);
      if (atividade.ultima_vez === dataLocalExecucao(execucao.realizada_em)) {
        const ultima = db.execucao_limpeza
          .filter(item => item.limpeza_id === atividade.id)
          .reduce((data, item) => {
            const candidata = dataLocalExecucao(item.realizada_em);
            return data == null || candidata > data ? candidata : data;
          }, null);
        atividade.ultima_vez = ultima;
      }
    });
    notificar('Registro removido do histórico de limpeza.');
  }

  const camposLimpeza = [
    { nome: 'nome', rotulo: 'Atividade' },
    {
      nome: 'comodo_id',
      rotulo: 'Cômodo',
      numero: true,
      opcoes: comodos.map(c => [c.id, c.nome]),
    },
    {
      nome: 'proxima_vez',
      rotulo: 'Próxima limpeza',
      tipo: 'date',
      obrigatorio: false,
    },
    {
      nome: 'descricao',
      rotulo: 'O que fazer',
      tipo: 'textarea',
      obrigatorio: false,
    },
  ];

  return (
    <div
      className={`limpeza-identidade${ehHistorico ? '' : ' limpeza-identidade-painel'}`}
    >
      <PaginaMvp
        titulo={ehHistorico ? 'Histórico de limpeza' : 'Atividades de limpeza'}
        descricao={
          ehHistorico ? 'Veja o que já foi cuidado na sua casa.' : undefined
        }
        acao={
          ehHistorico ? (
            <Link className='mvp-link' to='/limpeza'>
              Voltar às atividades
            </Link>
          ) : null
        }
      >
        {ehHistorico ? (
          <ExtratoLimpeza
            registros={historico}
            limpezas={limpezas}
            comodos={comodos}
            perfis={b.perfil}
            aoRemover={excluirExecucao}
          />
        ) : (
          <div className='limpeza-paineis'>
            <section
              className='limpeza-espacos'
              aria-labelledby='limpeza-comodos-titulo'
            >
              <div className='limpeza-secao-topo'>
                <div>
                  <h2 id='limpeza-comodos-titulo'>Cômodos</h2>
                  <p>Clique em um cômodo para ver suas atividades.</p>
                </div>
                <span className='limpeza-contagem'>
                  {comodos.length} {comodos.length === 1 ? 'cômodo' : 'cômodos'}
                </span>
              </div>
              <div
                className='limpeza-rolagem-comodos'
                role='region'
                aria-label='Cards dos cômodos'
                tabIndex={0}
              >
                <CardsComodos
                  comodos={comodos}
                  limpezas={limpezas}
                  aoSelecionar={selecionarComodo}
                  aoAdicionar={() => setModal({ tipo: 'comodo' })}
                  hoje={dia}
                />
              </div>
            </section>
            <section
              className='limpeza-agenda'
              aria-labelledby='limpeza-lista-titulo'
            >
              <div className='limpeza-secao-topo'>
                <div>
                  <h2 id='limpeza-lista-titulo'>Todas as limpezas</h2>
                  <p>
                    {lista.length}{' '}
                    {lista.length === 1 ? 'atividade' : 'atividades'}
                    {' · '}
                    <Link className='mvp-link' to='/limpeza?visao=historico'>
                      Ver histórico
                    </Link>
                  </p>
                </div>
                <div className='limpeza-acoes-criacao'>
                  <Link
                    className='mvp-link limpeza-criar-ia'
                    to='/ia'
                    state={{
                      rascunho:
                        'Ajude-me a criar atividades de limpeza para a minha casa. Sugira tarefas por cômodo e com que frequência devo fazê-las.',
                    }}
                  >
                    <Sparkles size={16} aria-hidden='true' /> Criar com IA
                  </Link>
                  <button
                    className='mvp-primario'
                    type='button'
                    disabled={!comodos.length}
                    onClick={() => setModal({ tipo: 'limpeza' })}
                  >
                    <Plus size={16} aria-hidden='true' />
                    Adicionar tarefa
                  </button>
                </div>
              </div>
              <div
                className='limpeza-rolagem-tarefas'
                role='region'
                aria-label='Lista de tarefas de limpeza'
                tabIndex={0}
              >
                {lista.length ? (
                  <ListaLimpezas
                    registros={lista}
                    {...acoesLista}
                    aoAbrirComodo={selecionarComodo}
                    compacta
                  />
                ) : (
                  <div className='limpeza-vazia'>
                    <p>Sua casa ainda não tem atividades de limpeza.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
        {!ehHistorico && (modal || comodo) && (
          <DialogoCasa
            titulo={
              !modal
                ? comodo.nome
                : modal.tipo === 'comodo'
                  ? 'Adicionar cômodo'
                  : modal.item
                    ? 'Editar tarefa'
                    : 'Adicionar tarefa'
            }
            aoFechar={fecharModal}
          >
            <div className='limpeza-modal'>
              {!modal ? (
                <section aria-label={`Atividades de ${comodo.nome}`}>
                  <div className='limpeza-modal-comodo'>
                    <img src={imagemComodo(comodo.tipo)} alt='' />
                    <div className='limpeza-modal-resumo'>
                      <div className='limpeza-modal-progresso'>
                        <p>
                          {feitasNoComodo} de {tarefasComodo.length} concluídas
                          hoje
                        </p>
                        {!!tarefasComodo.length && (
                          <progress
                            aria-label='Atividades concluídas hoje'
                            value={feitasNoComodo}
                            max={tarefasComodo.length}
                          />
                        )}
                      </div>
                      <div className='limpeza-acoes-criacao'>
                        <Link
                          className='mvp-link limpeza-criar-ia'
                          to='/ia'
                          state={{
                            rascunho: `Ajude-me a criar atividades de limpeza para este cômodo da minha casa: ${comodo.nome}. Inclua o que fazer e a frequência de cada tarefa.`,
                          }}
                        >
                          <Sparkles size={16} aria-hidden='true' /> Criar com IA
                        </Link>
                        <button
                          className='mvp-primario'
                          type='button'
                          onClick={() => setModal({ tipo: 'limpeza' })}
                        >
                          <Plus size={16} aria-hidden='true' /> Adicionar tarefa
                        </button>
                      </div>
                    </div>
                  </div>
                  {tarefasComodo.length ? (
                    <ListaLimpezas
                      registros={tarefasComodo}
                      {...acoesLista}
                      mostrarComodo={false}
                    />
                  ) : (
                    <div className='limpeza-vazia'>
                      <p>Este cômodo ainda não tem atividades.</p>
                    </div>
                  )}
                </section>
              ) : (
                <div
                  className={
                    modal.tipo === 'limpeza'
                      ? 'limpeza-editor-tarefa'
                      : undefined
                  }
                >
                  {modal.tipo === 'limpeza' && (
                    <div className='limpeza-editor-contexto'>
                      {comodoDaTarefa ? (
                        <img src={imagemComodo(comodoDaTarefa.tipo)} alt='' />
                      ) : (
                        <span className='limpeza-editor-icone'>
                          <ClipboardList size={24} aria-hidden='true' />
                        </span>
                      )}
                      <div>
                        <strong>
                          {modal.item?.nome ||
                            comodoDaTarefa?.nome ||
                            'Limpeza da casa'}
                        </strong>
                        <p>
                          {modal.item
                            ? comodoDaTarefa?.nome
                            : 'Escolha o cômodo e, se quiser, defina uma data.'}
                        </p>
                      </div>
                    </div>
                  )}
                  <EditorMvp
                    key={`${modal.tipo}-${modal.item?.id || 'novo'}`}
                    cabecalho={false}
                    titulo={
                      modal.tipo === 'comodo' ? 'Adicionar cômodo' : 'Limpeza'
                    }
                    inicial={
                      modal.tipo === 'comodo'
                        ? { casa_id: casa.id }
                        : modal.item || {
                            comodo_id: comodo?.id || null,
                            ultima_vez: null,
                            proxima_vez: null,
                          }
                    }
                    campos={
                      modal.tipo === 'comodo'
                        ? [
                            { nome: 'nome', rotulo: 'Nome do cômodo' },
                            {
                              nome: 'tipo',
                              rotulo: 'Tipo',
                              opcoes: [
                                ['quarto', 'Quarto'],
                                ['sala', 'Sala'],
                                ['cozinha', 'Cozinha'],
                                ['banheiro', 'Banheiro'],
                                ['lavanderia', 'Lavanderia'],
                                ['outro', 'Outro'],
                              ],
                            },
                            {
                              nome: 'descricao',
                              rotulo: 'Descrição',
                              obrigatorio: false,
                            },
                          ]
                        : camposLimpeza
                    }
                    rotuloSalvar={
                      modal.tipo === 'limpeza' && !modal.item
                        ? 'Adicionar tarefa'
                        : undefined
                    }
                    acaoSecundaria={
                      modal.item && (
                        <button
                          className='limpeza-excluir-tarefa'
                          type='button'
                          aria-expanded={confirmarExclusao}
                          aria-controls='limpeza-confirmacao-exclusao'
                          onClick={() => setConfirmarExclusao(atual => !atual)}
                        >
                          <Trash2 size={17} aria-hidden='true' /> Excluir
                        </button>
                      )
                    }
                    onClose={fecharModal}
                    onSave={valores => {
                      if (modal.tipo === 'comodo') {
                        let novo;
                        alterarBanco(db => {
                          novo = inserir('comodo', valores, db);
                        });
                        selecionarComodo(novo.id);
                        notificar(
                          `${valores.nome} adicionado. Cadastre a primeira limpeza desse espaço.`
                        );
                      } else {
                        salvarRegistro('limpezas', valores);
                        notificar(
                          modal.item
                            ? 'Limpeza atualizada.'
                            : 'Limpeza adicionada.'
                        );
                      }
                    }}
                  />
                  <div
                    id='limpeza-confirmacao-exclusao'
                    hidden={!confirmarExclusao}
                  >
                    {confirmarExclusao && (
                      <div className='limpeza-confirmar-exclusao'>
                        <p>
                          Excluir “{modal.item.nome}”? O histórico desta
                          atividade também será removido.
                        </p>
                        <div>
                          <button
                            type='button'
                            onClick={() => setConfirmarExclusao(false)}
                          >
                            Manter tarefa
                          </button>
                          <button
                            className='limpeza-excluir-tarefa'
                            type='button'
                            onClick={() => {
                              removerRegistro('limpezas', modal.item.id);
                              fecharModal();
                              notificar('Atividade excluída.');
                            }}
                          >
                            Confirmar exclusão
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </DialogoCasa>
        )}
      </PaginaMvp>
    </div>
  );
}
