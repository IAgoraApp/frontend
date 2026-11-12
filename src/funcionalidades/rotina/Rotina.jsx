import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Container } from '../../compartilhado/interface/indice';
import Rodape from '../../compartilhado/Rodape';
import {
  PainelAgenda,
  PainelAssistente,
  VisaoCalendario,
  DialogoTarefasDia,
  DialogoExcluirTarefa,
  VisaoHistorico,
  SeletorMes,
  DialogoResultado,
  ModalRotina,
  VisaoGeralRotina,
  AvisoFlutuanteRotina,
  EspacoTrabalhoRotina,
  DetalheTarefa,
  FormularioTarefa,
  VisaoListaTarefas,
  AjustesTarefa,
} from './componentes/indice';
import { useAlturaDisponivel } from './hooks/useAlturaDisponivel';
import { useLembretes } from './hooks/useLembretes';
import { useRotina } from './hooks/useRotina';
import {
  adicionarDias,
  diasCalendario,
  chaveData,
  intervaloMes,
} from './utilitarios/datas';
import { criarId, ocorrenciasEntre } from './utilitarios/tarefas';
import classesRotina from './classesRotina';

const mapaVisoes = {
  calendario: 'calendario',
  lista: 'lista',
  historico: 'historico',
};
const tiposEspaco = ['criar', 'editar', 'assistente'];

export default function Rotina() {
  const localizacao = useLocation();
  const { estado, despachar } = useRotina();
  const [parametrosBusca, setParametrosBusca] = useSearchParams();
  const visao =
    Object.keys(mapaVisoes).find(
      chave => mapaVisoes[chave] === parametrosBusca.get('visao')
    ) ?? 'visaoGeral';
  const [mes, setMes] = useState(() => new Date());
  const [hoje, setHoje] = useState(chaveData);
  const [modais, setModais] = useState([]);
  const [chaveNavegacao, setChaveNavegacao] = useState(localizacao.key);
  if (chaveNavegacao !== localizacao.key) {
    setChaveNavegacao(localizacao.key);
    setModais([]);
  }
  const indiceEspaco = modais.findLastIndex(entrada =>
    tiposEspaco.includes(entrada.type)
  );
  const espaco = modais[indiceEspaco];
  const chaveEspaco = espaco?.key;
  const dialogos = modais.slice(indiceEspaco + 1);
  const [aviso, setAviso] = useState(null);
  const referencia = useAlturaDisponivel();
  const dispensarAviso = useCallback(() => setAviso(null), []);
  const notificar = useCallback(
    (mensagem, acao) => setAviso({ mensagem, acao }),
    []
  );
  useLembretes(estado.tasks, estado.completions, notificar);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [localizacao.key, chaveEspaco]);

  useEffect(() => {
    const intervalo = window.setInterval(() => setHoje(chaveData()), 60_000);
    return () => window.clearInterval(intervalo);
  }, []);

  const pendentes = useMemo(() => {
    const inicio = adicionarDias(hoje, -30);
    const recentes = ocorrenciasEntre(
      estado.tasks,
      estado.completions,
      inicio,
      adicionarDias(hoje, 30)
    );
    const antigas = estado.tasks
      .filter(
        tarefa =>
          tarefa.frequency === 'none' &&
          tarefa.date < inicio &&
          !estado.completions.some(
            item => item.taskId === tarefa.id && item.occurrenceDate === tarefa.date
          )
      )
      .map(tarefa => ({
        ...tarefa,
        occurrenceDate: tarefa.date,
        occurrenceId: `${tarefa.id}:${tarefa.date}`,
        completed: false,
      }));
    return [...antigas, ...recentes].sort((a, b) =>
      `${a.occurrenceDate}T${a.time}`.localeCompare(
        `${b.occurrenceDate}T${b.time}`
      )
    );
  }, [estado.tasks, estado.completions, hoje]);

  const tarefasCalendario = useMemo(() => {
    const dias = diasCalendario(mes);
    return ocorrenciasEntre(
      estado.tasks,
      estado.completions,
      dias[0],
      dias.at(-1),
      true
    );
  }, [estado.tasks, estado.completions, mes]);

  function irPara(proxima) {
    setParametrosBusca(anterior => {
      const parametros = new URLSearchParams(anterior);
      if (mapaVisoes[proxima]) parametros.set('visao', mapaVisoes[proxima]);
      else parametros.delete('visao');
      return parametros;
    });
    setModais([]);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function abrir(tipo, tarefa, extras = {}) {
    const entrada = { type: tipo, task: tarefa, ...extras, key: criarId() };
    setModais(anterior => [...anterior, entrada]);
  }
  function fechar() {
    setModais([]);
  }
  function voltar() {
    setModais(anterior => anterior.slice(0, -1));
  }
  function resultado(titulo, descricao) {
    setModais([{ type: 'resultado', title: titulo, description: descricao, key: criarId() }]);
  }

  function resolverTarefa(tarefa) {
    const id = tarefa.taskId ?? tarefa.id;
    const origem = estado.tasks.find(item => item.id === id);
    const occurrenceDate = tarefa.occurrenceDate ?? tarefa.date;
    const occurrenceId = `${id}:${occurrenceDate}`;
    return {
      frequency: 'none',
      reminder: 'none',
      notes: '',
      weekdays: [],
      excludedDates: [],
      ...origem,
      ...tarefa,
      id,
      occurrenceDate,
      occurrenceId,
      completed: estado.completions.some(item => item.id === occurrenceId),
    };
  }

  function desfazer(tarefa) {
    despachar({ type: 'undo', id: tarefa.occurrenceId ?? tarefa.id });
    notificar('A tarefa voltou para a sua rotina.');
  }

  function concluir(tarefa, exibirResultado = false) {
    const ocorrencia = resolverTarefa(tarefa);
    if (ocorrencia.completed) return;
    despachar({
      type: 'complete',
      occurrence: ocorrencia,
      completedAt: new Date().toISOString(),
    });
    if (exibirResultado) {
      resultado(
        'Mais uma tarefa feita.',
        `${ocorrencia.title} foi adicionada ao seu histórico.`
      );
    } else {
      notificar('Mais uma tarefa feita.', () => {
        despachar({ type: 'undo', id: ocorrencia.occurrenceId });
        dispensarAviso();
      });
    }
  }

  function salvarTarefa(valores, tarefa) {
    if (tarefa) {
      despachar({
        type: 'update',
        id: tarefa.id,
        changes: {
          ...valores,
          excludedDates:
            tarefa.frequency === valores.frequency ? tarefa.excludedDates : [],
        },
      });
    } else {
      despachar({
        type: 'add',
        tasks: [
          {
            ...valores,
            id: criarId(),
            reminder: 'none',
            excludedDates: [],
            icon:
              valores.category === 'cozinha'
                ? 'limpeza'
                : valores.category === 'pessoal'
                  ? 'estudos'
                  : 'lista',
          },
        ],
      });
    }
    resultado(
      tarefa ? 'Sua tarefa foi atualizada.' : 'Sua tarefa está na rotina.',
      'Confira a nova organização na lista ou no calendário.'
    );
  }

  function salvarAjustes(tipo, tarefa, valores) {
    if (tipo === 'reagendar') {
      despachar({
        type: 'reschedule',
        occurrence: tarefa,
        ...valores,
        newId: criarId(),
      });
    } else {
      despachar({
        type: 'update',
        id: tarefa.id,
        changes:
          tipo === 'lembrete'
            ? { reminder: valores.reminder }
            : {
                frequency: valores.frequency,
                weekdays: valores.weekdays,
                endDate: valores.frequency === 'none' ? '' : valores.endDate,
                excludedDates: [],
              },
      });
    }
    resultado(
      'Sua tarefa foi atualizada.',
      tipo === 'lembrete'
        ? 'O lembrete foi salvo para aparecer nesta aba.'
        : 'Confira a nova organização na lista.'
    );
  }

  function adicionarSugestoes(sugestoes) {
    const tarefas = sugestoes.filter(
      item =>
        !estado.tasks.some(
          tarefa =>
            tarefa.title === item.title &&
            tarefa.category === item.category &&
            tarefa.date === item.date &&
            tarefa.frequency === item.frequency
        )
    );
    if (!tarefas.length) {
      notificar('Estas sugestões já estão na sua rotina.');
      return;
    }
    despachar({
      type: 'add',
      tasks: tarefas.map(item => ({ ...item, id: criarId() })),
    });
    resultado(
      'Sua rotina ganhou novos passos.',
      `${tarefas.length} ${tarefas.length === 1 ? 'tarefa foi adicionada' : 'tarefas foram adicionadas'} à sua rotina.`
    );
  }

  function acaoRapida(acao) {
    if (acao in mapaVisoes) irPara(acao);
    else abrir(acao);
  }

  function conteudoModal(entrada) {
    const idTitulo = `modal-rotina-${entrada.key}`;
    const tarefa = entrada.task ? resolverTarefa(entrada.task) : null;
    const comuns = { idTitulo };
    if (entrada.type === 'criar' || entrada.type === 'editar') {
      return (
        <FormularioTarefa
          {...comuns}
          apresentacao='pagina'
          tarefa={entrada.type === 'editar' ? tarefa : undefined}
          dataPadrao={entrada.day}
          aoCancelar={voltar}
          aoSalvar={valores =>
            salvarTarefa(valores, entrada.type === 'editar' ? tarefa : null)
          }
          aoAssistente={() => abrir('assistente')}
          aoExcluir={() => abrir('excluir', tarefa)}
        />
      );
    }
    if (entrada.type === 'detalhe') {
      return (
        <DetalheTarefa
          {...comuns}
          tarefa={tarefa}
          aoAcao={abrir}
          aoConcluir={valor => concluir(valor, true)}
          aoDesfazer={valor => {
            desfazer(valor);
            fechar();
          }}
        />
      );
    }
    if (['reagendar', 'lembrete', 'repeticao'].includes(entrada.type)) {
      return (
        <AjustesTarefa
          {...comuns}
          tipo={entrada.type}
          tarefa={tarefa}
          aoSalvar={valores => salvarAjustes(entrada.type, tarefa, valores)}
          aoCancelar={voltar}
        />
      );
    }
    if (entrada.type === 'excluir') {
      return (
        <DialogoExcluirTarefa
          {...comuns}
          tarefa={tarefa}
          aoCancelar={voltar}
          aoExcluir={escopo => {
            despachar({ type: 'delete', occurrence: tarefa, scope: escopo });
            fechar();
            notificar(
              escopo === 'series'
                ? 'A repetição foi removida. Seu histórico foi mantido.'
                : 'Tarefa excluída da rotina.'
            );
          }}
        />
      );
    }
    if (entrada.type === 'assistente') {
      return (
        <PainelAssistente
          {...comuns}
          apresentacao='pagina'
          aoAdicionar={adicionarSugestoes}
          aoManual={() => abrir('criar')}
        />
      );
    }
    if (entrada.type === 'agenda') {
      return (
        <PainelAgenda
          {...comuns}
          agenda={estado.agenda}
          aoCancelar={voltar}
          aoConectar={() =>
            despachar({ type: 'agenda', changes: { connected: true } })
          }
          aoSalvar={preferencias => {
            despachar({ type: 'agenda', changes: { preferences: preferencias } });
            resultado(
              'Preferências atualizadas.',
              'A sincronização foi configurada no exemplo.'
            );
          }}
          aoDesconectar={() => {
            despachar({ type: 'agenda', changes: { connected: false } });
            resultado(
              'Conexão removida.',
              'Suas tarefas continuam disponíveis na plataforma.'
            );
          }}
        />
      );
    }
    if (entrada.type === 'mes') {
      return (
        <SeletorMes
          {...comuns}
          mes={mes}
          aoSelecionar={valor => {
            setMes(valor);
            voltar();
          }}
        />
      );
    }
    if (entrada.type === 'dia') {
      return (
        <DialogoTarefasDia
          {...comuns}
          dia={entrada.day}
          tarefas={ocorrenciasEntre(
            estado.tasks,
            estado.completions,
            entrada.day,
            entrada.day,
            true
          )}
          aoAbrir={valor => abrir('detalhe', valor)}
          aoConcluir={concluir}
          aoDesfazer={desfazer}
          aoCriar={() => abrir('criar', undefined, { day: entrada.day })}
          aoCancelar={voltar}
        />
      );
    }
    return (
      <DialogoResultado
        {...comuns}
        titulo={entrada.title}
        descricao={entrada.description}
        aoContinuar={fechar}
      />
    );
  }

  const modalAtivo = dialogos.at(-1);
  const largo =
    modalAtivo &&
    ['reagendar', 'lembrete', 'repeticao'].includes(modalAtivo.type);
  const { inicio: inicioCalendario, fim: fimCalendario } = intervaloMes(mes);

  return (
    <div lang='pt-BR' className='flex min-w-0 flex-1 flex-col bg-white'>
      <main
        ref={referencia}
        className={`${classesRotina.escopo} ${classesRotina.pagina} ${espaco || visao === 'visaoGeral' || visao === 'calendario' ? classesRotina.paginaAjustada : ''}`}
        data-visao={espaco ? 'espaco' : visao}
        data-ajuste={Boolean(
          espaco || visao === 'visaoGeral' || visao === 'calendario'
        )}
        aria-label='Minha rotina'
      >
        <Container classe={classesRotina.container}>
          <div hidden={Boolean(espaco)} className={classesRotina.painelVisao}>
            {visao === 'visaoGeral' && (
              <VisaoGeralRotina
                proximas={pendentes.filter(
                  tarefa => tarefa.occurrenceDate >= hoje
                )}
                aoAcao={acaoRapida}
                aoAbrir={tarefa => abrir('detalhe', tarefa)}
                aoConcluir={concluir}
              />
            )}
            {visao === 'calendario' && (
              <VisaoCalendario
                mes={mes}
                aoMudarMes={setMes}
                ocorrencias={tarefasCalendario}
                aoSelecionarDia={dia => abrir('dia', undefined, { day: dia })}
                aoEscolherMes={() => abrir('mes')}
                aoVoltar={() => irPara('visaoGeral')}
                aoAgenda={() => abrir('agenda')}
                conectada={estado.agenda.connected}
              />
            )}
            {visao === 'lista' && (
              <VisaoListaTarefas
                tarefas={pendentes}
                aoVoltar={() => irPara('visaoGeral')}
                aoCriar={() => abrir('criar')}
                aoAssistente={() => abrir('assistente')}
                aoAbrir={tarefa => abrir('detalhe', tarefa)}
                aoConcluir={concluir}
                aoAcao={abrir}
              />
            )}
            {visao === 'historico' && (
              <VisaoHistorico
                conclusoes={estado.completions}
                pendentes={pendentes}
                aoVoltar={() => irPara('visaoGeral')}
                aoAbrir={tarefa => abrir('detalhe', tarefa)}
                aoDesfazer={desfazer}
              />
            )}
            <span className={classesRotina.somenteLeitor} aria-live='polite'>
              {visao === 'calendario'
                ? `Calendário de ${inicioCalendario} a ${fimCalendario}.`
                : ''}
            </span>
          </div>
          {modais
            .slice(0, indiceEspaco + 1)
            .filter(entrada => tiposEspaco.includes(entrada.type))
            .map(entrada => (
              <div
                key={entrada.key}
                hidden={entrada.key !== espaco?.key}
                className={classesRotina.painelVisao}
                data-espaco-ativo={
                  entrada.key === espaco?.key ? 'true' : 'false'
                }
              >
                <EspacoTrabalhoRotina
                  registro={entrada}
                  ativo={entrada.key === espaco?.key}
                  rotuloVoltar={
                    modais.indexOf(entrada) > 0 ? 'Voltar' : 'Minha rotina'
                  }
                  aoVoltar={voltar}
                >
                  {conteudoModal(entrada)}
                </EspacoTrabalhoRotina>
              </div>
            ))}
        </Container>
        {modalAtivo && (
          <ModalRotina
            aoFechar={() =>
              setModais(anterior => anterior.slice(0, indiceEspaco + 1))
            }
            aoVoltar={dialogos.length > 1 ? voltar : undefined}
            chaveModal={modalAtivo.key}
            idTitulo={`modal-rotina-${modalAtivo.key}`}
            largo={largo}
          >
            {dialogos.map(entrada => (
              <div
                key={entrada.key}
                hidden={entrada.key !== modalAtivo.key}
                data-modal-ativo={
                  entrada.key === modalAtivo.key ? 'true' : 'false'
                }
                className={classesRotina.painelModal}
              >
                {conteudoModal(entrada)}
              </div>
            ))}
          </ModalRotina>
        )}
        {aviso && (
          <AvisoFlutuanteRotina aviso={aviso} aoDispensar={dispensarAviso} />
        )}
      </main>
      <Rodape />
    </div>
  );
}
