import { Titulo } from '../../../compartilhado/interface/indice';
import { acoesRapidasRotina } from '../conteudo';
import Robo from '../../../ativos/imagens/ilustracoes/assistente-robo.png';
import {
  ArteListaRotina,
  BotaoRotina,
  FitaRotina,
  IconeRotina,
} from './InterfaceRotina';
import LinhaTarefa from './LinhaTarefa';
import { useCapacidadeProximas } from '../hooks/useCapacidadeProximas';
import classesRotina from '../classesRotina';

export default function VisaoGeralRotina({
  proximas,
  aoAcao,
  aoAbrir,
  aoConcluir,
}) {
  const { referencia, capacidade } = useCapacidadeProximas(proximas.length);
  return (
    <div className={classesRotina.visaoGeral}>
      <div className={classesRotina.introducao}>
        <div className={classesRotina.copiaTitulo}>
          <FitaRotina />
          <Titulo como='h1' classe={classesRotina.tituloBoasVindas}>
            Oi! Vamos organizar o seu dia?
          </Titulo>
          <p className={classesRotina.descricaoIntroducao}>
            Crie tarefas, receba sugestões da IA e mantenha sua rotina em dia.
          </p>
        </div>
        <ArteListaRotina />
      </div>
      <nav className={classesRotina.acoesRapidas} aria-label='Ações da minha rotina'>
        {acoesRapidasRotina.map(acao => (
          <button
            key={acao.id}
            type='button'
            className={classesRotina.acaoRapida}
            onClick={() => aoAcao(acao.id)}
          >
            <IconeRotina nome={acao.icone} />
            <span>{acao.rotulo}</span>
          </button>
        ))}
      </nav>
      <div className={classesRotina.cartoesVisaoGeral}>
        <section
          className={classesRotina.proximas}
          aria-labelledby='titulo-proximas-tarefas'
        >
          <div className={classesRotina.cabecalhoCartao}>
            <Titulo
              como='h2'
              id='titulo-proximas-tarefas'
              classe={classesRotina.tituloCartao}
            >
              Próximas tarefas
            </Titulo>
            <button
              type='button'
              className={classesRotina.acaoTexto}
              onClick={() => aoAcao('lista')}
            >
              Ver todas <span aria-hidden='true'>→</span>
            </button>
          </div>
          {proximas.length ? (
            <div
              ref={referencia}
              className={classesRotina.linhasProximas}
              data-previa-proximas
            >
              {proximas.slice(0, capacidade).map(tarefa => (
                <LinhaTarefa
                  key={tarefa.occurrenceId}
                  tarefa={tarefa}
                  variante='proximas'
                  aoAbrir={aoAbrir}
                  aoConcluir={aoConcluir}
                />
              ))}
            </div>
          ) : (
            <div className={classesRotina.proximasVazio}>
              <p className={classesRotina.notaPequena}>
                Nenhuma tarefa por enquanto.
              </p>
              <button
                type='button'
                className={classesRotina.acaoTexto}
                onClick={() => aoAcao('criar')}
              >
                Criar primeira tarefa <span aria-hidden='true'>+</span>
              </button>
            </div>
          )}
        </section>
        <section
          className={classesRotina.cartaoIa}
          aria-labelledby='titulo-cartao-ia'
        >
          <div className={classesRotina.copiaCartaoIa}>
            <FitaRotina>COM A AJUDA DA IA</FitaRotina>
            <Titulo
              como='h2'
              id='titulo-cartao-ia'
              classe={classesRotina.tituloCartaoIa}
            >
              Crie sua rotina <br />
              em minutos.
            </Titulo>
            <p>
              Receba sugestões personalizadas de tarefas com base no seu momento
              e estilo de vida.
            </p>
            <BotaoRotina onClick={() => aoAcao('assistente')}>
              Quero ajuda da IA <span aria-hidden='true'>→</span>
            </BotaoRotina>
          </div>
          <img
            src={Robo}
            width='180'
            height='180'
            className={classesRotina.robo}
            alt=''
            aria-hidden='true'
          />
        </section>
      </div>
    </div>
  );
}
