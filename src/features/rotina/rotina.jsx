import { usePerfilPreparacao } from '../../app/dados/perfilNavegacao';
import { useAvisoPerfilA } from '../../app/avisos/avisosPerfilA';
import { useLayoutEffect, useState } from 'react';
import {
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import {
  CalendarDays,
  LayoutGrid,
  ListChecks,
  Sparkles,
  Tags,
} from 'lucide-react';
import LayoutCasa from '../../app/layouts/casaLayout';
import { MenuLateralCasa } from '../../app/layouts/components/casaNavigation';
import { Container } from '../../shared/ui/index';
import './rotina.css';
import {
  VisaoCalendario,
  DialogoExcluirTarefa,
  VisaoHistorico,
  SeletorMes,
  ModalRotina,
  EspacoTrabalhoRotina,
  DetalheTarefa,
  FormularioTarefa,
  VisaoListaTarefas,
  AjustesTarefa,
} from './components/index';
import { useAlturaDisponivel } from './hooks/useAvailableHeight';
import { useLembretes } from './hooks/useReminders';
import { useRotinaBanco } from './hooks/useRotinaBanco';
import GestaoRotina from './rotinaA';
import { analisarData, diasCalendario, intervaloMes } from './utils/dates';
import { criarId } from './utils/tasks';
import classesRotina from './routineClasses';

const secoesRotina = [
  {
    rota: '/rotina',
    nome: 'Visão geral',
    Icone: LayoutGrid,
    inicial: 'geral',
    links: [],
  },
  {
    rota: '/rotina',
    nome: 'Atividades',
    Icone: ListChecks,
    links: [
      ['lista', 'Tarefas'],
      ['historico', 'Histórico'],
    ],
  },
  {
    rota: '/rotina',
    nome: 'Organização',
    Icone: Tags,
    links: [
      ['categorias', 'Categorias'],
      ['recorrencias', 'Recorrências'],
    ],
  },
  {
    rota: '/ia',
    nome: 'Dicas da IA',
    Icone: Sparkles,
    links: [],
  },
];
const visoesRotina = secoesRotina.flatMap(secao =>
  secao.links.map(([id]) => id)
);

const tiposEspaco = ['criar', 'editar'];

export default function Rotina() {
  const preparacao = usePerfilPreparacao();
  const localizacao = useLocation();
  const navegar = useNavigate();
  const { estado, ocorrencias, despachar } = useRotinaBanco();
  const [parametrosBusca] = useSearchParams();
  const visaoSolicitada = parametrosBusca.get('visao');
  const visao =
    visaoSolicitada === 'tarefas'
      ? 'lista'
      : visoesRotina.includes(visaoSolicitada)
        ? visaoSolicitada
        : 'geral';
  const [mes, setMes] = useState(
    () => analisarData(parametrosBusca.get('data')) ?? new Date()
  );
  const [mostrarTudo, setMostrarTudo] = useState(false);
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
  const notificar = useAvisoPerfilA();
  const referencia = useAlturaDisponivel();
  useLembretes(ocorrencias, notificar);

  useLayoutEffect(() => {
    referencia.current
      ?.closest('.casa-conteudo')
      ?.scrollTo({ top: 0, behavior: 'instant' });
  }, [localizacao.key, chaveEspaco, referencia]);

  const pendentes = ocorrencias.filter(tarefa => !tarefa.completed);
  const dias = diasCalendario(mes);
  const tarefasCalendario = ocorrencias.filter(
    tarefa =>
      tarefa.occurrenceDate >= dias[0] && tarefa.occurrenceDate <= dias.at(-1)
  );

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
    fechar();
    notificar(`${titulo} ${descricao}`);
  }

  function resolverTarefa(tarefa) {
    const id = tarefa.taskId ?? tarefa.id;
    const origem = estado.tasks.find(item => item.id === id);
    const atual = ocorrencias.find(
      item => item.executionId === tarefa.executionId
    );
    return { ...tarefa, ...origem, ...atual, id };
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
      });
    }
  }

  function salvarTarefa(valores, tarefa) {
    if (tarefa) {
      despachar({
        type: 'update',
        id: tarefa.id,
        occurrence: tarefa,
        changes: valores,
      });
    } else {
      despachar({
        type: 'add',
        tasks: [valores],
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

  function conteudoModal(entrada) {
    const idTitulo = `modal-rotina-${entrada.key}`;
    const tarefa = entrada.task ? resolverTarefa(entrada.task) : null;
    const comuns = { idTitulo };
    if (entrada.type === 'criar' || entrada.type === 'editar') {
      return (
        <FormularioTarefa
          {...comuns}
          apresentacao='pagina'
          tarefa={
            entrada.type === 'editar'
              ? estado.tasks.find(item => item.id === tarefa.id)
              : undefined
          }
          dataPadrao={entrada.day}
          aoCancelar={voltar}
          aoSalvar={valores =>
            salvarTarefa(valores, entrada.type === 'editar' ? tarefa : null)
          }
          aoAssistente={preparacao ? undefined : () => navegar('/ia')}
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
    return null;
  }

  const modalAtivo = dialogos.at(-1);
  const largo =
    modalAtivo && ['reagendar', 'repeticao'].includes(modalAtivo.type);
  const { inicio: inicioCalendario, fim: fimCalendario } = intervaloMes(mes);

  if (visaoSolicitada === 'assistente') return <Navigate to={preparacao ? '/rotina' : '/ia'} replace />;

  return (
    <LayoutCasa
      secao={visao}
      navegacao={
        <MenuLateralCasa
          titulo='Rotina'
          IconeTitulo={CalendarDays}
          rotulo='Navegação da rotina'
          secoes={preparacao ? secoesRotina.filter(secao => secao.rota !== '/ia') : secoesRotina}
          pathname='/rotina'
          visao={visao}
        />
      }
    >
      <main
        ref={referencia}
        className={`rotina-tela ${classesRotina.escopo} ${classesRotina.pagina} min-h-full bg-(--azul-fundo)! ${espaco ? classesRotina.paginaAjustada : ''}`}
        data-visao={espaco ? 'espaco' : visao}
        data-ajuste={Boolean(espaco)}
        aria-label='Minha rotina'
      >
        <Container classe='rotina-conteudo casa-pagina-conteudo'>
          <div
            hidden={Boolean(espaco)}
            className={`rotina-visao ${classesRotina.painelVisao}`}
          >
            {visao === 'geral' && (
              <VisaoCalendario
                mes={mes}
                aoMudarMes={setMes}
                ocorrencias={tarefasCalendario}
                mostrarTudo={mostrarTudo}
                aoMostrarTudo={setMostrarTudo}
                aoEscolherMes={() => abrir('mes')}
                aoCriar={dia => abrir('criar', undefined, { day: dia })}
                aoAbrir={tarefa => abrir('detalhe', tarefa)}
                aoConcluir={concluir}
                aoDesfazer={desfazer}
              />
            )}
            {visao === 'lista' && (
              <VisaoListaTarefas
                tarefas={ocorrencias}
                mes={mes}
                mostrarTudo={mostrarTudo}
                aoMostrarTudo={setMostrarTudo}
                aoEscolherMes={() => abrir('mes')}
                aoCriar={dia => abrir('criar', undefined, { day: dia })}
                aoAbrir={tarefa => abrir('detalhe', tarefa)}
                aoConcluir={concluir}
                aoReagendar={tarefa => abrir('reagendar', tarefa)}
              />
            )}
            {visao === 'historico' && (
              <VisaoHistorico
                conclusoes={estado.completions}
                pendentes={pendentes}
                aoAbrir={tarefa => abrir('detalhe', tarefa)}
              />
            )}
            {['categorias', 'recorrencias'].includes(visao) && (
              <GestaoRotina key={visao} visao={visao} />
            )}
            <span className={classesRotina.somenteLeitor} aria-live='polite'>
              {visao === 'geral'
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
      </main>
    </LayoutCasa>
  );
}
