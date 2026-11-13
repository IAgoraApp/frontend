import { useState } from 'react';
import EstatisticaConcluido from '../../../ativos/vetores/rotina/estatistica-concluido.svg';
import EstatisticaGrafico from '../../../ativos/vetores/rotina/estatistica-grafico.svg';
import EstatisticaSequencia from '../../../ativos/vetores/rotina/estatistica-sequencia.svg';
import { Titulo } from '../../../compartilhado/interface/indice';
import { adicionarDias, chaveData, formatarData } from '../utilitarios/datas';
import {
  EstadoVazioRotina,
  BotaoRotina,
  CabecalhoRotina,
} from './InterfaceRotina';
import LinhaTarefa from './LinhaTarefa';
import classesRotina from '../classesRotina';

export default function VisaoHistorico({
  conclusoes,
  pendentes,
  aoVoltar,
  aoAbrir,
  aoDesfazer,
}) {
  const [periodo, setPeriodo] = useState('mes');
  const [visiveis, setVisiveis] = useState(10);
  const hoje = chaveData();
  const inicio =
    periodo === 'mes'
      ? `${hoje.slice(0, 7)}-01`
      : periodo === 'semana'
        ? adicionarDias(hoje, -6)
        : '0000-01-01';
  const concluidas = conclusoes
    .filter(item => chaveData(new Date(item.completedAt)) >= inicio)
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  const quantidadePendentes = pendentes.filter(
    item => item.occurrenceDate >= inicio && item.occurrenceDate <= hoje
  ).length;
  const taxa = concluidas.length
    ? Math.round(
        (concluidas.length / (concluidas.length + quantidadePendentes)) * 100
      )
    : 0;
  const diasConcluidos = new Set(
    conclusoes.map(item => chaveData(new Date(item.completedAt)))
  );
  let dia = diasConcluidos.has(hoje) ? hoje : adicionarDias(hoje, -1);
  let sequencia = 0;
  while (diasConcluidos.has(dia)) {
    sequencia++;
    dia = adicionarDias(dia, -1);
  }
  const estatisticas = [
    {
      rotulo: 'Tarefas concluídas',
      valor: concluidas.length,
      icone: EstatisticaConcluido,
    },
    {
      rotulo: 'Taxa de conclusão',
      valor: `${taxa}%`,
      icone: EstatisticaGrafico,
    },
    {
      rotulo: 'Sequência atual',
      valor: `${sequencia} ${sequencia === 1 ? 'dia' : 'dias'}`,
      icone: EstatisticaSequencia,
    },
  ];

  return (
    <div>
      <CabecalhoRotina
        fita
        titulo='Histórico de conclusão'
        descricao='Acompanhe o seu progresso ao longo do tempo.'
        aoVoltar={aoVoltar}
      >
        <select
          className={classesRotina.seletorPeriodo}
          aria-label='Período do histórico'
          value={periodo}
          onChange={evento => {
            setPeriodo(evento.target.value);
            setVisiveis(10);
          }}
        >
          <option value='mes'>Esse mês</option>
          <option value='semana'>Últimos 7 dias</option>
          <option value='tudo'>Todo o período</option>
        </select>
      </CabecalhoRotina>
      <dl className={classesRotina.estatisticas}>
        {estatisticas.map(estatistica => (
          <div key={estatistica.rotulo} className={classesRotina.estatistica}>
            <span className={classesRotina.iconeEstatistica}>
              <img src={estatistica.icone} alt='' />
            </span>
            <div>
              <dt>{estatistica.rotulo}</dt>
              <dd>{estatistica.valor}</dd>
            </div>
          </div>
        ))}
      </dl>
      <section
        className={classesRotina.secaoConcluidas}
        aria-labelledby='titulo-concluidas'
      >
        <Titulo como='h2' id='titulo-concluidas' classe={classesRotina.tituloCartao}>
          Tarefas concluídas
        </Titulo>
        {concluidas.length ? (
          <div className={classesRotina.tarefasConcluidas}>
            {concluidas.slice(0, visiveis).map(tarefa => (
              <LinhaTarefa
                key={tarefa.id}
                tarefa={tarefa}
                variante='historico'
                rotuloData={`${formatarData(tarefa.occurrenceDate)} · ${tarefa.time}`}
                aoAbrir={aoAbrir}
                aoDesfazer={aoDesfazer}
              />
            ))}
          </div>
        ) : (
          <EstadoVazioRotina
            titulo='Cada passo vai aparecer aqui'
            descricao='Você ainda não concluiu tarefas neste período.'
          >
            <BotaoRotina tom='secundario' onClick={aoVoltar}>
              Voltar à rotina
            </BotaoRotina>
          </EstadoVazioRotina>
        )}
        {concluidas.length > visiveis && (
          <BotaoRotina
            tom='secundario'
            classe={classesRotina.carregarMais}
            onClick={() => setVisiveis(contador => contador + 10)}
          >
            Ver mais conclusões
          </BotaoRotina>
        )}
      </section>
    </div>
  );
}
