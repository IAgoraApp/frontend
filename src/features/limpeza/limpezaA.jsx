import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
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
import ListaLimpezas from './components/listaLimpezas';
import AvisoLimpeza from './components/avisoLimpeza';
import ExtratoLimpeza from './components/extratoLimpeza';
import { ordenarLimpezas } from './utils/agendaLimpeza';
import './limpezaA.css';

export default function LimpezaA() {
  const { b, casa, comodos, limpezas, perfil } = useBancoMvp();
  const [params, setParams] = useSearchParams();
  const [modal, setModal] = useState(null);
  const [aviso, setAviso] = useState(null);
  const dispensarAviso = useCallback(() => setAviso(null), []);
  function notificar(mensagem) {
    setAviso({ id: crypto.randomUUID(), mensagem });
  }
  const [situacao, setSituacao] = useState('todas');
  const dia = hoje();
  const comodo = comodos.find(c => c.id === Number(params.get('comodo')));
  const referenciaLista = useRef(null);
  const idSelecionado = comodo?.id;
  useEffect(() => {
    if (window.matchMedia('(min-width: 1000px)').matches) {
      referenciaLista.current
        ?.querySelector('.limpeza-rolagem-tarefas')
        ?.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    if (!idSelecionado) return;
    referenciaLista.current?.scrollIntoView({
      block: 'start',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  }, [idSelecionado]);
  const historico = b.execucao_limpeza.filter(e =>
    limpezas.some(l => l.id === e.limpeza_id)
  );
  const ehHistorico = params.get('visao') === 'historico';
  const lista = ordenarLimpezas(
    limpezas.filter(
      l =>
        (!comodo || l.comodo_id === comodo.id) &&
        (situacao === 'todas' ||
          (situacao === 'feitas' ? l.ultima_vez === dia : l.ultima_vez !== dia))
    ),
    dia
  );

  function selecionarComodo(id) {
    if (!id) setSituacao('todas');
    setParams(
      anteriores => {
        const novos = new URLSearchParams(anteriores);
        if (!id || comodo?.id === id) novos.delete('comodo');
        else novos.set('comodo', String(id));
        return novos;
      },
      { preventScrollReset: true }
    );
  }

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

  const camposLimpeza = [
    { nome: 'nome', rotulo: 'Atividade' },
    {
      nome: 'comodo_id',
      rotulo: 'Cômodo',
      numero: true,
      opcoes: comodos.map(c => [c.id, c.nome]),
    },
    { nome: 'descricao', rotulo: 'O que fazer', obrigatorio: false },
    {
      nome: 'proxima_vez',
      rotulo: 'Próxima limpeza',
      tipo: 'date',
      obrigatorio: false,
    },
  ];

  return (
    <div
      className={`limpeza-identidade${ehHistorico ? '' : ' limpeza-identidade-painel'}`}
    >
      <PaginaMvp
        cabecalho={ehHistorico}
        titulo='Histórico de limpeza'
        descricao='Veja o que já foi cuidado na sua casa.'
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
          />
        ) : (
          <div className='limpeza-paineis'>
            <section
              className='limpeza-espacos'
              aria-labelledby='limpeza-comodos-titulo'
            >
              <div className='limpeza-secao-topo'>
                <div>
                  <h1 id='limpeza-comodos-titulo'>Por onde vamos começar?</h1>
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
                  selecionado={comodo?.id}
                  aoSelecionar={selecionarComodo}
                  aoAdicionar={() => setModal({ tipo: 'comodo' })}
                  hoje={dia}
                />
              </div>
            </section>
            <section
              className='limpeza-agenda'
              id='limpeza-lista'
              ref={referenciaLista}
              aria-label={
                comodo ? `Limpezas: ${comodo.nome}` : 'Todas as limpezas'
              }
            >
              <div className='limpeza-filtros'>
                <button
                  type='button'
                  aria-pressed={!comodo}
                  onClick={() => selecionarComodo(null)}
                >
                  Todas as limpezas <span>{limpezas.length}</span>
                </button>
                {comodo && (
                  <span className='limpeza-filtro-ativo'>{comodo.nome}</span>
                )}
                <label>
                  Situação
                  <select
                    aria-label='Situação'
                    value={situacao}
                    onChange={e => setSituacao(e.target.value)}
                  >
                    <option value='todas'>Todas</option>
                    <option value='pendentes'>A fazer</option>
                    <option value='feitas'>Feitas hoje</option>
                  </select>
                </label>
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
                    comodos={comodos}
                    hoje={dia}
                    aoConcluir={concluir}
                    aoEditar={item => setModal({ tipo: 'limpeza', item })}
                    aoExcluir={item => setModal({ tipo: 'excluir', item })}
                  />
                ) : (
                  <div className='limpeza-vazia'>
                    <p>
                      {situacao !== 'todas'
                        ? 'Nenhuma atividade nesta situação.'
                        : comodo
                          ? `${comodo.nome} ainda não tem atividades de limpeza.`
                          : 'Sua casa ainda não tem atividades de limpeza.'}
                    </p>
                    {situacao === 'todas' && !!comodos.length && (
                      <button
                        className='mvp-primario'
                        type='button'
                        onClick={() => setModal({ tipo: 'limpeza' })}
                      >
                        Adicionar primeira limpeza
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className='limpeza-agenda-acoes'>
                <button
                  className='mvp-primario'
                  type='button'
                  disabled={!comodos.length}
                  onClick={() => setModal({ tipo: 'limpeza' })}
                >
                  <Plus size={16} />
                  Adicionar tarefa
                </button>
                <Link className='mvp-link' to='/limpeza?visao=historico'>
                  Ver histórico
                </Link>
              </div>
            </section>
          </div>
        )}
        {modal && (
          <DialogoCasa
            key={`${modal.tipo}-${modal.item?.id || 'novo'}`}
            titulo={
              modal.tipo === 'comodo'
                ? 'Adicionar cômodo'
                : modal.tipo === 'excluir'
                  ? 'Excluir limpeza'
                  : modal.item
                    ? 'Editar limpeza'
                    : 'Adicionar limpeza'
            }
            aoFechar={() => setModal(null)}
          >
            <div className='limpeza-modal'>
              {modal.tipo === 'excluir' ? (
                <>
                  <p>
                    Excluir “{modal.item.nome}”? O histórico desta atividade
                    também será removido.
                  </p>
                  <div className='limpeza-modal-acoes'>
                    <button type='button' onClick={() => setModal(null)}>
                      Manter atividade
                    </button>
                    <button
                      type='button'
                      className='mvp-primario'
                      onClick={() => {
                        removerRegistro('limpezas', modal.item.id);
                        setModal(null);
                        notificar('Atividade excluída.');
                      }}
                    >
                      Excluir limpeza
                    </button>
                  </div>
                </>
              ) : (
                <EditorMvp
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
                  onClose={() => setModal(null)}
                  onSave={valores => {
                    if (modal.tipo === 'comodo') {
                      let novo;
                      alterarBanco(db => {
                        novo = inserir('comodo', valores, db);
                      });
                      setParams(
                        { comodo: String(novo.id) },
                        { preventScrollReset: true }
                      );
                      setSituacao('todas');
                      notificar(
                        `${valores.nome} adicionado. Cadastre a primeira limpeza desse espaço.`
                      );
                    } else {
                      salvarRegistro('limpezas', valores);
                      if (!modal.item) {
                        setParams(
                          { comodo: String(valores.comodo_id) },
                          { preventScrollReset: true }
                        );
                        setSituacao('todas');
                      }
                      notificar(
                        modal.item
                          ? 'Limpeza atualizada.'
                          : 'Limpeza adicionada.'
                      );
                    }
                  }}
                />
              )}
            </div>
          </DialogoCasa>
        )}
      </PaginaMvp>
      {aviso && (
        <AvisoLimpeza key={aviso.id} aviso={aviso} aoFechar={dispensarAviso} />
      )}
    </div>
  );
}
