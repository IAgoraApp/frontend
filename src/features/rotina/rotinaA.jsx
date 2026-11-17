import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  normalizarRecorrencia,
  proximaOcorrencia,
} from './utils/recorrenciasMvp';
import {
  alterarBanco,
  dataCurta,
  hoje,
  inserir,
  salvarRegistro,
  useBancoMvp,
} from '../../app/dados/bancoMvp';
import {
  AbasMvp,
  ColecaoMvp,
  PaginaMvp,
  ResumoMvp,
  VazioMvp,
} from '../../shared/ui/mvp';

export default function RotinaA() {
  const { b, categorias, tarefas, perfil } = useBancoMvp();
  const [params] = useSearchParams();
  const [filtro, setFiltro] = useState('todas');
  const [aviso, setAviso] = useState('');
  const visao = params.get('visao') || 'tarefas';
  const execucoes = b.execucao_tarefa.filter(e =>
    tarefas.some(t => t.id === e.tarefa_id)
  );
  const lista = execucoes
    .filter(e => filtro === 'todas' || e.status === filtro)
    .slice()
    .sort((a, c) => a.data_prevista.localeCompare(c.data_prevista));
  return (
    <PaginaMvp
      titulo='Sua rotina, no seu ritmo.'
      descricao='Organize tarefas e acompanhe cada execução.'
    >
      {aviso && (
        <p className='mvp-sucesso' role='status'>
          {aviso}
        </p>
      )}
      <ResumoMvp
        itens={[
          ['Tarefas', tarefas.length],
          ['Pendentes', execucoes.filter(e => e.status === 'pendente').length],
          [
            'Concluídas',
            execucoes.filter(e => e.status === 'concluida').length,
          ],
        ]}
      />
      <AbasMvp
        caminho='/rotina'
        atual={visao}
        itens={[
          ['tarefas', 'Tarefas'],
          ['agenda', 'Execuções e histórico'],
          ['categorias', 'Categorias'],
        ]}
      />
      {visao === 'categorias' ? (
        <ColecaoMvp
          titulo='Categorias de tarefas'
          colecao='categoria_tarefa'
          registros={categorias}
          padrao={{
            user_id: perfil.user_id,
            cor: '#102a43',
            icone: 'list-check',
          }}
          campos={[
            { nome: 'nome', rotulo: 'Nome' },
            { nome: 'cor', rotulo: 'Cor', tipo: 'color' },
          ]}
          podeExcluir={false}
          detalhe={c =>
            `${tarefas.filter(t => t.categoria_id === c.id).length} tarefas`
          }
        />
      ) : visao === 'agenda' ? (
        <section className='mvp-painel'>
          <div className='mvp-painel-topo'>
            <h2>Execuções</h2>
            <select
              aria-label='Filtrar execuções'
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
            >
              <option value='todas'>Todas</option>
              <option value='pendente'>Pendentes</option>
              <option value='concluida'>Concluídas</option>
            </select>
          </div>
          {!lista.length && <VazioMvp>Nenhuma execução neste filtro.</VazioMvp>}
          {lista.map(e => (
            <div className='mvp-registro' key={e.id}>
              <div>
                <strong>{tarefas.find(t => t.id === e.tarefa_id)?.nome}</strong>
                <p className='mvp-detalhe'>
                  {dataCurta(e.data_prevista)} ·{' '}
                  {e.status === 'concluida'
                    ? `Concluída em ${dataCurta(e.concluida_em)}`
                    : 'Pendente'}
                </p>
              </div>
              <div className='mvp-acoes'>
                <button
                  type='button'
                  onClick={() =>
                    salvarRegistro('execucao_tarefa', {
                      ...e,
                      status:
                        e.status === 'pendente' ? 'concluida' : 'pendente',
                      concluida_em:
                        e.status === 'pendente'
                          ? new Date().toISOString()
                          : null,
                    })
                  }
                >
                  {e.status === 'pendente' ? 'Concluir' : 'Reabrir'}
                </button>
              </div>
            </div>
          ))}
        </section>
      ) : (
        <div className='mvp-grade'>
          <ColecaoMvp
            titulo='Tarefas cadastradas'
            colecao='tarefa'
            registros={tarefas}
            padrao={{ prazo: null }}
            campos={[
              { nome: 'nome', rotulo: 'Tarefa' },
              {
                nome: 'categoria_id',
                rotulo: 'Categoria',
                numero: true,
                opcoes: categorias.map(c => [c.id, c.nome]),
              },
              { nome: 'descricao', rotulo: 'Descrição', obrigatorio: false },
              {
                nome: 'prazo',
                rotulo: 'Prazo',
                tipo: 'datetime-local',
                obrigatorio: false,
              },
            ]}
            detalhe={t =>
              `${categorias.find(c => c.id === t.categoria_id)?.nome} · ${dataCurta(t.prazo)}\n${t.descricao || ''}`
            }
            acoes={t => (
              <button
                type='button'
                onClick={() =>
                  alterarBanco(db => {
                    inserir(
                      'execucao_tarefa',
                      {
                        tarefa_id: t.id,
                        data_prevista: t.prazo || `${hoje()}T12:00:00`,
                        concluida_em: null,
                        status: 'pendente',
                      },
                      db
                    );
                  })
                }
              >
                Criar execução
              </button>
            )}
          />
          <ColecaoMvp
            titulo='Recorrências'
            colecao='recorrencia_tarefa'
            registros={b.recorrencia_tarefa
              .filter(r => tarefas.some(t => t.id === r.tarefa_id))
              .map(r => ({
                ...r,
                nome: tarefas.find(t => t.id === r.tarefa_id)?.nome,
              }))}
            campos={[
              {
                nome: 'tarefa_id',
                rotulo: 'Tarefa',
                numero: true,
                opcoes: tarefas.map(t => [t.id, t.nome]),
              },
              {
                nome: 'frequencia',
                rotulo: 'Frequência',
                opcoes: [
                  ['diaria', 'Diária'],
                  ['semanal', 'Semanal'],
                  ['mensal', 'Mensal'],
                ],
              },
              {
                nome: 'intervalo',
                rotulo: 'Intervalo',
                tipo: 'number',
                min: 1,
              },
              { nome: 'inicio', rotulo: 'Início', tipo: 'date' },
              { nome: 'fim', rotulo: 'Fim', tipo: 'date', obrigatorio: false },
              {
                nome: 'dias_semana',
                rotulo: 'Dias da semana, separados por vírgula',
                obrigatorio: false,
              },
              {
                nome: 'dia_mes',
                rotulo: 'Dias do mês, separados por vírgula',
                obrigatorio: false,
              },
            ]}
            padrao={{
              intervalo: 1,
              inicio: hoje(),
              fim: null,
              dias_semana: null,
              dia_mes: null,
            }}
            detalhe={r =>
              `${r.frequencia} · a cada ${r.intervalo} período(s)\nInício: ${dataCurta(r.inicio)}${r.dias_semana?.length ? `\n${r.dias_semana.join(', ')}` : ''}${r.dia_mes?.length ? `\nDias: ${r.dia_mes.join(', ')}` : ''}`
            }
            acoes={r => (
              <button
                type='button'
                onClick={() => {
                  const proxima = proximaOcorrencia(r, execucoes, hoje());
                  if (!proxima) {
                    setAviso(
                      'Não há próxima execução dentro do período desta recorrência.'
                    );
                    return;
                  }
                  alterarBanco(db =>
                    inserir(
                      'execucao_tarefa',
                      {
                        tarefa_id: r.tarefa_id,
                        data_prevista: `${proxima}T12:00:00`,
                        concluida_em: null,
                        status: 'pendente',
                      },
                      db
                    )
                  );
                  setAviso(
                    `Execução criada para ${dataCurta(proxima)}. Veja em Execuções e histórico.`
                  );
                }}
              >
                Gerar próxima execução
              </button>
            )}
            onSave={v => {
              if (
                b.recorrencia_tarefa.some(
                  r => r.tarefa_id === v.tarefa_id && r.id !== v.id
                )
              )
                throw new Error(
                  'Essa tarefa já tem uma recorrência. Edite a configuração existente.'
                );
              salvarRegistro('recorrencia_tarefa', normalizarRecorrencia(v));
            }}
          />
        </div>
      )}
    </PaginaMvp>
  );
}
