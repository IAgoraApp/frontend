import { useState } from 'react';
import { ArrowRight, Check, ChevronLeft, ListChecks } from 'lucide-react';
import { Botao } from '../../shared/ui';
import { proximoId } from '../preparacao/modelo';

export default function QuizAula({
  quiz,
  banco,
  executar,
  usuario,
  onConcluir,
}) {
  const [indice, setIndice] = useState(null);
  const questoes = banco.questao.filter(item => item.quiz_id === quiz.id);
  const tentativas = banco.tentativa_quiz.filter(
    item => item.quiz_id === quiz.id && item.user_id === usuario
  );
  const tentativa = tentativas.find(item => item.pontuacao == null);
  const resultados = tentativas.filter(item => item.pontuacao != null);
  const ultima = resultados.at(-1);
  const respostas = banco.resposta_quiz.filter(
    item => item.tentativa_id === tentativa?.id
  );
  const primeiraPendente = questoes.findIndex(
    q => !respostas.some(r => r.questao_id === q.id)
  );
  const posicao =
    indice ??
    (primeiraPendente === -1 ? questoes.length - 1 : primeiraPendente);
  const questao = questoes[posicao];
  const resposta = respostas.find(item => item.questao_id === questao?.id);
  const alternativas = banco.alternativa.filter(
    item => item.questao_id === questao?.id
  );
  const completa = questoes.every(q =>
    respostas.some(r => r.questao_id === q.id)
  );

  function iniciar() {
    if (
      executar(db => {
        if (
          db.tentativa_quiz.some(
            item =>
              item.quiz_id === quiz.id &&
              item.user_id === usuario &&
              item.pontuacao == null
          )
        )
          return;
        db.tentativa_quiz.push({
          id: proximoId(db.tentativa_quiz),
          user_id: usuario,
          quiz_id: quiz.id,
          pontuacao: null,
        });
      })
    )
      setIndice(0);
  }

  function responder(alternativa) {
    if (
      executar(db => {
        const atual = db.resposta_quiz.find(
          item =>
            item.tentativa_id === tentativa.id && item.questao_id === questao.id
        );
        if (atual) atual.alternativa_id = alternativa.id;
        else
          db.resposta_quiz.push({
            id: proximoId(db.resposta_quiz),
            tentativa_id: tentativa.id,
            questao_id: questao.id,
            alternativa_id: alternativa.id,
          });
      })
    )
      setIndice(posicao);
  }

  function finalizar() {
    executar(db => {
      const registro = db.tentativa_quiz.find(
        item => item.id === tentativa.id && item.pontuacao == null
      );
      if (!registro) throw new Error('Esta tentativa já foi finalizada.');
      const acertos = questoes.filter(q => {
        const resposta = db.resposta_quiz.find(
          item => item.tentativa_id === registro.id && item.questao_id === q.id
        );
        if (!resposta)
          throw new Error('Responda todas as questões antes de finalizar.');
        return db.alternativa.some(
          item =>
            item.id === resposta.alternativa_id &&
            item.questao_id === q.id &&
            item.correta
        );
      }).length;
      registro.pontuacao =
        Math.round((acertos * 10000) / questoes.length) / 100;
    });
  }

  return (
    <section
      className='aprendendo-quiz'
      aria-labelledby={'quiz-titulo-' + quiz.id}
    >
      <header>
        <ListChecks size={19} aria-hidden='true' />
        <h2 id={'quiz-titulo-' + quiz.id}>{quiz.titulo}</h2>
      </header>

      <div
        className='aprendendo-quiz-corpo'
        key={tentativa ? questao?.id : 'resultado'}
      >
        {questoes.length === 0 ? (
          <p>Este quiz ainda não tem questões.</p>
        ) : tentativa ? (
          <>
            <div className='aprendendo-quiz-progresso'>
              <span>
                Questão {posicao + 1} de {questoes.length}
              </span>
              <progress
                max={questoes.length}
                value={
                  questoes.filter(q =>
                    respostas.some(r => r.questao_id === q.id)
                  ).length
                }
                aria-label='Questões respondidas'
              />
            </div>
            <fieldset className='aprendendo-alternativas'>
              <legend>{questao.enunciado}</legend>
              {alternativas.map((item, numero) => (
                <label key={item.id}>
                  <input
                    type='radio'
                    name={'questao-' + questao.id}
                    checked={resposta?.alternativa_id === item.id}
                    onChange={() => responder(item)}
                  />
                  <span
                    className='aprendendo-alternativa-letra'
                    aria-hidden='true'
                  >
                    {String.fromCharCode(65 + numero)}
                  </span>
                  <span>{item.texto}</span>
                  {resposta?.alternativa_id === item.id && (
                    <Check size={17} aria-hidden='true' />
                  )}
                </label>
              ))}
            </fieldset>
          </>
        ) : ultima ? (
          <>
            <div className='aprendendo-resultado' role='status'>
              <div>
                <p>Última tentativa</p>
                <strong>
                  {ultima.pontuacao.toLocaleString('pt-BR')}% de acertos
                </strong>
              </div>
            </div>
            {resultados.length > 1 && (
              <p className='aprendendo-total-tentativas'>
                {resultados.length} tentativas · Melhor resultado:{' '}
                {Math.max(
                  ...resultados.map(item => item.pontuacao)
                ).toLocaleString('pt-BR')}
                %
              </p>
            )}
          </>
        ) : (
          <div className='aprendendo-quiz-intro'>
            <h3>Hora de praticar</h3>
            <p>
              {questoes.length} {questoes.length === 1 ? 'questão' : 'questões'}{' '}
              de múltipla escolha. Confira sua pontuação no final.
            </p>
          </div>
        )}
      </div>

      <footer className='aprendendo-quiz-acoes'>
        {questoes.length > 0 &&
          (tentativa ? (
            <>
              <button
                type='button'
                className='aprendendo-seta'
                aria-label='Questão anterior'
                disabled={posicao === 0}
                onClick={() => setIndice(posicao - 1)}
              >
                <ChevronLeft size={19} aria-hidden='true' />
              </button>
              {posicao < questoes.length - 1 ? (
                <Botao
                  type='button'
                  disabled={!resposta}
                  onClick={() => setIndice(posicao + 1)}
                >
                  Próxima questão <ArrowRight size={16} aria-hidden='true' />
                </Botao>
              ) : (
                <Botao type='button' disabled={!completa} onClick={finalizar}>
                  Ver resultado <ArrowRight size={16} aria-hidden='true' />
                </Botao>
              )}
            </>
          ) : ultima ? (
            <>
              <Botao type='button' variante='contorno' onClick={iniciar}>
                Tentar novamente
              </Botao>
              <Botao type='button' onClick={onConcluir}>
                Concluir
              </Botao>
            </>
          ) : (
            <Botao type='button' onClick={iniciar}>
              Iniciar quiz
            </Botao>
          ))}
      </footer>
    </section>
  );
}
