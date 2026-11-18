import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { alterarBancoPreparacao, useBancoMvp } from '../../app/dados/bancoMvp';
import { acessoLocal } from '../../app/dados/acessoLocal';
import { Botao, EstadoVazio, Titulo } from '../../shared/ui';
import LayoutPreparacao, { painel } from '../preparacao/LayoutPreparacao';
import { proximoId } from '../preparacao/modelo';

function Quiz({ quiz, banco, executar, usuario }) {
  const questoes = banco.questao.filter(item => item.quiz_id === quiz.id);
  const tentativas = banco.tentativa_quiz.filter(
    item => item.quiz_id === quiz.id && item.user_id === usuario
  );
  const tentativa = tentativas.find(item => item.pontuacao == null);
  const respostas = banco.resposta_quiz.filter(
    item => item.tentativa_id === tentativa?.id
  );
  const finalizadas = tentativas.filter(item => item.pontuacao != null);

  function responder(questao, alternativa) {
    executar(db => {
      const atual = db.resposta_quiz.find(
        item =>
          item.tentativa_id === tentativa.id && item.questao_id === questao.id
      );
      if (atual) {
        atual.alternativa_id = alternativa.id;
        return;
      }
      db.resposta_quiz.push({
        id: proximoId(db.resposta_quiz),
        tentativa_id: tentativa.id,
        questao_id: questao.id,
        alternativa_id: alternativa.id,
      });
    });
  }

  return (
    <section className={painel + ' space-y-3'}>
      <Titulo como='h2' classe='text-xl font-bold'>
        {quiz.titulo}
      </Titulo>
      {finalizadas.length > 0 && (
        <div className='text-sm text-(--texto-apoio)'>
          <p className='font-semibold'>Resultados das tentativas</p>
          <ol className='ml-5 list-decimal'>
            {finalizadas.map(item => (
              <li key={item.id}>{item.pontuacao.toLocaleString('pt-BR')}%</li>
            ))}
          </ol>
        </div>
      )}
      {!questoes.length ? (
        <p>Este quiz ainda não tem questões.</p>
      ) : tentativa ? (
        <>
          {questoes.map(questao => (
            <fieldset
              className='space-y-2 rounded-lg border border-(--borda-suave) p-3'
              key={questao.id}
            >
              <legend className='font-semibold'>{questao.enunciado}</legend>
              {banco.alternativa
                .filter(item => item.questao_id === questao.id)
                .map(alternativa => (
                  <label
                    key={alternativa.id}
                    className='flex items-center gap-2'
                  >
                    <input
                      type='radio'
                      name={'questao-' + questao.id}
                      checked={respostas.some(
                        item =>
                          item.questao_id === questao.id &&
                          item.alternativa_id === alternativa.id
                      )}
                      onChange={() => responder(questao, alternativa)}
                    />
                    {alternativa.texto}
                  </label>
                ))}
            </fieldset>
          ))}
          <Botao
            type='button'
            disabled={respostas.length !== questoes.length}
            onClick={() =>
              executar(db => {
                const certas = respostas.filter(r =>
                  banco.alternativa.some(
                    a =>
                      a.id === r.alternativa_id &&
                      a.questao_id === r.questao_id &&
                      a.correta
                  )
                ).length;
                db.tentativa_quiz.find(
                  item => item.id === tentativa.id
                ).pontuacao =
                  Math.round((10000 * certas) / questoes.length) / 100;
              })
            }
          >
            Finalizar tentativa
          </Botao>
        </>
      ) : (
        <Botao
          type='button'
          onClick={() =>
            executar(db => {
              db.tentativa_quiz.push({
                id: proximoId(db.tentativa_quiz),
                user_id: usuario,
                quiz_id: quiz.id,
                pontuacao: null,
              });
            })
          }
        >
          {finalizadas.length ? 'Tentar novamente' : 'Iniciar quiz'}
        </Botao>
      )}
    </section>
  );
}

export default function Aprendendo() {
  const { b, perfil } = useBancoMvp();
  const usuario = perfil?.user_id;
  const [params] = useSearchParams();
  const [erro, setErro] = useState('');
  const [filtro, setFiltro] = useState('todas');
  const aula = b.aula.find(item => item.id === Number(params.get('aula')));
  const progresso = b.progresso_aula.filter(item => item.user_id === usuario);
  const concluida = id =>
    progresso.some(item => item.aula_id === id && item.concluida);
  const aulasVisiveis = b.aula.filter(
    item =>
      filtro === 'todas' || concluida(item.id) === (filtro === 'concluidas')
  );
  function executar(operacao) {
    try {
      alterarBancoPreparacao(operacao);
      setErro('');
    } catch (falha) {
      setErro(falha.message);
    }
  }

  return (
    <LayoutPreparacao
      titulo={acessoLocal && aula ? aula.titulo : 'Aprendendo a morar'}
      descricao={
        acessoLocal && aula
          ? aula.descricao
          : 'Consulte as aulas, acompanhe seu progresso e pratique com os quizzes disponíveis.'
      }
    >
      {erro && <p role='alert'>{erro}</p>}
      {!acessoLocal ? (
        <EstadoVazio
          titulo='Disponível na prévia local'
          descricao='A biblioteca e seu progresso aguardam integração com o servidor.'
        />
      ) : aula ? (
        <>
          <Link className='inline-flex py-2 font-bold' to='/aprendendo'>
            Voltar para as aulas
          </Link>
          <article className={painel + ' space-y-3'}>
            {aula.conteudo && (
              <p className='whitespace-pre-line'>{aula.conteudo}</p>
            )}
            {aula.video_url && (
              <a href={aula.video_url} className='block underline'>
                Assistir ao vídeo
              </a>
            )}
            <Botao
              type='button'
              variante='contorno'
              onClick={() =>
                executar(db => {
                  const atual = db.progresso_aula.find(
                    item => item.user_id === usuario && item.aula_id === aula.id
                  );
                  if (atual) atual.concluida = !atual.concluida;
                  else
                    db.progresso_aula.push({
                      id: proximoId(db.progresso_aula),
                      user_id: usuario,
                      aula_id: aula.id,
                      concluida: true,
                    });
                })
              }
            >
              {concluida(aula.id) ? 'Reabrir aula' : 'Marcar como concluída'}
            </Botao>
          </article>
          {b.quiz
            .filter(item => item.aula_id === aula.id)
            .map(quiz => (
              <Quiz
                key={quiz.id}
                quiz={quiz}
                banco={b}
                executar={executar}
                usuario={usuario}
              />
            ))}
        </>
      ) : (
        <>
          <p className={painel + ' font-bold'}>
            {b.aula.filter(item => concluida(item.id)).length} de{' '}
            {b.aula.length} aulas concluídas
          </p>
          <label className='flex flex-wrap items-center gap-2 text-sm font-semibold'>
            Mostrar
            <select
              className='rounded-md border border-(--borda-suave) bg-white px-3 py-2'
              value={filtro}
              onChange={evento => setFiltro(evento.target.value)}
            >
              <option value='todas'>Todas as aulas</option>
              <option value='pendentes'>Aulas pendentes</option>
              <option value='concluidas'>Aulas concluídas</option>
            </select>
          </label>
          {!aulasVisiveis.length && (
            <EstadoVazio
              titulo='Nenhuma aula neste filtro'
              descricao='Escolha outro filtro para ver os conteúdos disponíveis.'
            />
          )}
          <ul className='grid gap-3 sm:grid-cols-2'>
            {aulasVisiveis.map(item => (
              <li key={item.id} className={painel}>
                <p className='text-sm text-(--texto-apoio)'>
                  {concluida(item.id) ? 'Concluída' : item.categoria}
                </p>
                <Link
                  to={'?aula=' + item.id}
                  className='text-lg font-bold hover:underline'
                >
                  {item.titulo}
                </Link>
                <p>{item.descricao}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </LayoutPreparacao>
  );
}
