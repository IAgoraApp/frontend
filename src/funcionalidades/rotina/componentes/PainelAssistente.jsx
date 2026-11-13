import { useEffect, useState } from 'react';
import { Titulo } from '../../../compartilhado/interface/indice';
import Robo from '../../../ativos/imagens/ilustracoes/assistente-robo.png';
import { exemplosSugestao, diasSemanaRotina } from '../conteudo';
import { construirSugestoes } from '../utilitarios/tarefas';
import {
  CabecalhoModalRotina,
  AvisoRotina,
  BotaoRotina,
  IconeRotina,
} from './InterfaceRotina';
import classesRotina from '../classesRotina';

export default function PainelAssistente({
  aoAdicionar,
  aoManual,
  idTitulo,
  apresentacao = 'modal',
}) {
  const [comando, setComando] = useState('');
  const [pedido, setPedido] = useState('');
  const [situacao, setSituacao] = useState('inicial');
  const [sugestoes, setSugestoes] = useState([]);
  const [selecionadas, setSelecionadas] = useState([]);

  useEffect(() => {
    document.getElementById(idTitulo)?.focus({ preventScroll: true });
  }, [situacao, idTitulo]);

  useEffect(() => {
    if (situacao !== 'carregando') return;
    const temporizador = window.setTimeout(() => {
      try {
        const resultado = construirSugestoes(pedido);
        setSugestoes(resultado);
        setSelecionadas(resultado.map(item => item.id));
        setSituacao('pronto');
      } catch {
        setSituacao('erro');
      }
    }, 500);
    return () => window.clearTimeout(temporizador);
  }, [situacao, pedido]);

  function gerar(valor) {
    if (!valor.trim()) return;
    setPedido(valor.trim());
    setSituacao('carregando');
  }

  if (situacao === 'carregando') {
    return (
      <div className={classesRotina.conteudoModal} aria-busy='true'>
        <CabecalhoModalRotina
          id={idTitulo}
          como={apresentacao === 'pagina' ? 'h1' : 'h2'}
          titulo='Organizando as informações'
          descricao='Aguarde enquanto preparamos suas sugestões.'
          arte
        />
        <div className={classesRotina.listaEsqueleto} aria-hidden='true'>
          {[0, 1, 2].map(item => (
            <div key={item} />
          ))}
        </div>
        <p role='status' className={classesRotina.notaPequena}>
          Preparando sugestões de exemplo…
        </p>
        <BotaoRotina tom='secundario' onClick={() => setSituacao('inicial')}>
          Cancelar
        </BotaoRotina>
      </div>
    );
  }

  if (situacao === 'erro') {
    return (
      <div className={classesRotina.conteudoModal}>
        <CabecalhoModalRotina
          id={idTitulo}
          como={apresentacao === 'pagina' ? 'h1' : 'h2'}
          titulo='Não foi possível gerar sugestões'
          descricao='Tente novamente ou crie sua tarefa manualmente.'
          arte
        />
        <div className={classesRotina.acoes} data-acoes>
          <BotaoRotina onClick={() => gerar(pedido)}>
            Tentar novamente
          </BotaoRotina>
          <BotaoRotina tom='secundario' onClick={aoManual}>
            Criar tarefa
          </BotaoRotina>
        </div>
      </div>
    );
  }

  if (situacao === 'pronto') {
    return (
      <div className={classesRotina.conteudoModal}>
        <CabecalhoModalRotina
          id={idTitulo}
          como={apresentacao === 'pagina' ? 'h1' : 'h2'}
          titulo='Uma semana com espaço para respirar'
          descricao='Sugestão de organização para revisar antes de adicionar.'
          arte
        />
        <p className={classesRotina.notaPequena}>
          Demonstração com sugestões prontas. Nenhuma IA está conectada.
        </p>
        <div className={classesRotina.listaSugestoes}>
          {sugestoes.map(item => (
            <label key={item.id} className={classesRotina.itemSugestao}>
              <input
                type='checkbox'
                checked={selecionadas.includes(item.id)}
                onChange={evento =>
                  setSelecionadas(anterior =>
                    evento.target.checked
                      ? [...anterior, item.id]
                      : anterior.filter(id => id !== item.id)
                  )
                }
              />
              <span>
                <strong>
                  {diasSemanaRotina
                    .find(dia => dia.id === item.day)
                    ?.rotulo.replace('-feira', '')}{' '}
                  · {item.title} · {item.duration} min
                </strong>
                <span>Selecione o que faz sentido para você.</span>
              </span>
            </label>
          ))}
        </div>
        <div className={classesRotina.acoes} data-acoes>
          <BotaoRotina
            disabled={!selecionadas.length}
            onClick={() =>
              aoAdicionar(sugestoes.filter(item => selecionadas.includes(item.id)))
            }
          >
            Adicionar selecionadas
            {selecionadas.length ? ` (${selecionadas.length})` : ''}
          </BotaoRotina>
          <BotaoRotina tom='secundario' onClick={() => setSituacao('inicial')}>
            Pedir outra sugestão
          </BotaoRotina>
        </div>
      </div>
    );
  }

  return (
    <div className={classesRotina.conteudoModal}>
      <CabecalhoModalRotina
        id={idTitulo}
        como={apresentacao === 'pagina' ? 'h1' : 'h2'}
        fita={apresentacao !== 'pagina'}
        titulo='Sugestões da IA'
        descricao='Com base no seu momento, aqui estão algumas ideias para a sua rotina.'
      />
      <section
        className={classesRotina.comandoAssistente}
        aria-labelledby='titulo-comando-assistente'
      >
        <img
          src={Robo}
          width='180'
          height='180'
          alt=''
          className={classesRotina.roboAssistente}
          aria-hidden='true'
        />
        <Titulo como='h3' id='titulo-comando-assistente'>
          Em que posso te ajudar hoje?
        </Titulo>
        <p>
          Peça sugestões de tarefas, monte uma rotina completa ou tire dúvidas
          sobre organização da sua casa.
        </p>
        <form
          className={classesRotina.formularioComando}
          onSubmit={evento => {
            evento.preventDefault();
            gerar(comando);
          }}
        >
          <label className={classesRotina.somenteLeitor} htmlFor={`${idTitulo}-comando`}>
            Descreva a rotina que você quer organizar
          </label>
          <input
            id={`${idTitulo}-comando`}
            placeholder='Ex: Me ajude a criar uma rotina semanal de limpeza'
            maxLength={500}
            value={comando}
            onChange={evento => setComando(evento.target.value)}
            required
          />

        </form>
      </section>
      <p className={classesRotina.rotuloExemplos}>Ou escolha um exemplo:</p>
      <div className={classesRotina.exemplosSugestao}>
        {exemplosSugestao.map(exemplo => (
          <button
            key={exemplo.id}
            type='button'
            onClick={() => gerar(exemplo.titulo)}
          >
            <IconeRotina nome={exemplo.icone} />
            <strong>{exemplo.titulo}</strong>
          </button>
        ))}
      </div>
      <AvisoRotina>
        Sugestões de exemplo para adaptar. Nenhuma IA está conectada.
      </AvisoRotina>
    </div>
  );
}
