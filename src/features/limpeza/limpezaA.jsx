import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import {
  alterarBanco,
  dataCurta,
  hoje,
  inserir,
  removerRegistro,
  salvarRegistro,
  useBancoMvp,
} from '../../app/dados/bancoMvp';
import { EditorMvp, PaginaMvp, ResumoMvp, VazioMvp } from '../../shared/ui/mvp';
import { DialogoCasa } from '../casa/components/casaUi';
import CardsComodos from './components/cardsComodos';
import ListaLimpezas from './components/listaLimpezas';
import { ordenarLimpezas } from './utils/agendaLimpeza';
import './limpezaA.css';

export default function LimpezaA() {
  const { b, casa, comodos, limpezas, perfil } = useBancoMvp();
  const [params, setParams] = useSearchParams();
  const [modal, setModal] = useState(null);
  const [aviso, setAviso] = useState('');
  const [situacao, setSituacao] = useState('todas');
  const dia = hoje();
  const comodo = comodos.find(c => c.id === Number(params.get('comodo')));
  const referenciaLista = useRef(null);
  const idSelecionado = comodo?.id;
  useEffect(() => {
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
    setAviso(`Limpeza registrada: ${limpeza.nome}.`);
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
    <div className='limpeza-identidade'>
      <PaginaMvp
        titulo={
          ehHistorico ? 'Histórico de limpeza' : 'Um cuidado de cada vez.'
        }
        descricao={
          ehHistorico
            ? 'Veja o que já foi cuidado na sua casa.'
            : 'Escolha um cômodo ou acompanhe as próximas limpezas da casa.'
        }
        acao={
          ehHistorico ? (
            <Link className='mvp-link' to='/limpeza'>
              Voltar às atividades
            </Link>
          ) : (
            <button
              className='mvp-primario'
              type='button'
              disabled={!comodos.length}
              onClick={() => setModal({ tipo: 'limpeza' })}
            >
              <Plus size={16} />
              Adicionar limpeza
            </button>
          )
        }
      >
        {aviso && (
          <p className='mvp-sucesso' role='status'>
            {aviso}
          </p>
        )}
        {ehHistorico ? (
          <>
            <ResumoMvp
              itens={[
                ['Atividades', limpezas.length],
                ['Cômodos', comodos.length],
                ['Limpezas registradas', historico.length],
              ]}
            />
            <section className='mvp-painel'>
              <div className='mvp-painel-topo'>
                <h2>Limpezas realizadas</h2>
              </div>
              {!historico.length && (
                <VazioMvp>Nenhuma limpeza realizada ainda.</VazioMvp>
              )}
              {historico
                .slice()
                .sort((a, c) => c.realizada_em.localeCompare(a.realizada_em))
                .map(e => (
                  <div className='mvp-registro' key={e.id}>
                    <div>
                      <strong>
                        {limpezas.find(l => l.id === e.limpeza_id)?.nome}
                      </strong>
                      <p className='mvp-detalhe'>
                        {
                          comodos.find(
                            c =>
                              c.id ===
                              limpezas.find(l => l.id === e.limpeza_id)
                                ?.comodo_id
                          )?.nome
                        }{' '}
                        · {b.perfil.find(p => p.id === e.perfil_id)?.nome}
                      </p>
                    </div>
                    <span className='mvp-detalhe'>
                      {dataCurta(e.realizada_em)}
                    </span>
                  </div>
                ))}
            </section>
          </>
        ) : (
          <>
            <section
              className='limpeza-espacos'
              aria-labelledby='limpeza-comodos-titulo'
            >
              <div className='limpeza-secao-topo'>
                <div>
                  <h2 id='limpeza-comodos-titulo'>Por onde vamos começar?</h2>
                  <p>Clique em um cômodo para ver suas atividades.</p>
                </div>
                <span className='limpeza-contagem'>
                  {comodos.length} {comodos.length === 1 ? 'cômodo' : 'cômodos'}
                </span>
              </div>
              <CardsComodos
                comodos={comodos}
                limpezas={limpezas}
                selecionado={comodo?.id}
                aoSelecionar={selecionarComodo}
                aoAdicionar={() => setModal({ tipo: 'comodo' })}
                hoje={dia}
              />
            </section>
            <section
              className='limpeza-agenda'
              id='limpeza-lista'
              ref={referenciaLista}
              aria-labelledby='limpeza-lista-titulo'
            >
              <div className='limpeza-secao-topo'>
                <div>
                  <h2 id='limpeza-lista-titulo'>
                    {comodo ? `Limpezas: ${comodo.nome}` : 'Todas as limpezas'}
                  </h2>
                  <p>
                    Mais próximas primeiro. Sem data depois; feitas hoje no fim.
                  </p>
                </div>
                <Link className='mvp-link' to='/limpeza?visao=historico'>
                  Ver histórico
                </Link>
              </div>
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
            </section>
          </>
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
                        setAviso('Atividade excluída.');
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
                      setAviso(
                        `${valores.nome} adicionado. Cadastre a primeira limpeza desse espaço.`
                      );
                    } else {
                      salvarRegistro('limpezas', valores);
                      setAviso(
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
    </div>
  );
}
