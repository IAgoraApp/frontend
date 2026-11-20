import { contaApi } from '../../app/dados/contaApi';
import { listarApi } from '../../app/dados/contratoApi';

export async function carregarAprendizado(usuario, aulaId, opcoes) {
  const [aulas, progresso] = await Promise.all([
    listarApi('/aulas', opcoes),
    listarApi('/progresso-aulas', opcoes),
  ]);
  const base = {
    aula: aulas,
    progresso_aula: progresso.map(item => ({ ...item, user_id: usuario })),
  };
  if (!aulas.some(aula => aula.id === aulaId)) return base;
  const quizzes = await listarApi(`/aulas/${aulaId}/quizzes`, opcoes);
  const [questoes, tentativas] = await Promise.all([
    Promise.all(
      quizzes.map(quiz => listarApi(`/quizzes/${quiz.id}/questoes`, opcoes))
    ),
    Promise.all(
      quizzes.map(quiz => listarApi(`/quizzes/${quiz.id}/tentativas`, opcoes))
    ),
  ]);
  const perguntas = questoes.flat();
  const tentativasQuiz = tentativas.flat();
  const [alternativas, respostas] = await Promise.all([
    Promise.all(
      perguntas.map(questao =>
        listarApi(`/questoes/${questao.id}/alternativas`, opcoes)
      )
    ),
    Promise.all(
      tentativasQuiz
        .filter(item => item.pontuacao == null)
        .map(item => listarApi(`/tentativas-quiz/${item.id}/respostas`, opcoes))
    ),
  ]);
  return {
    ...base,
    quiz: quizzes,
    questao: perguntas,
    alternativa: alternativas.flat(),
    tentativa_quiz: tentativasQuiz,
    resposta_quiz: respostas.flat(),
  };
}

export function concluirAula(id, concluida) {
  return contaApi(`/aulas/${id}/${concluida ? 'concluir' : 'reabrir'}`, {
    metodo: 'PATCH',
  });
}

export function iniciarQuiz(id) {
  return contaApi(`/quizzes/${id}/tentativas`, { metodo: 'POST' });
}

export function responderQuiz(
  tentativaId,
  questaoId,
  alternativaId,
  respostaId
) {
  const rota = respostaId
    ? `/respostas-quiz/${respostaId}`
    : `/tentativas-quiz/${tentativaId}/respostas`;
  return contaApi(rota, {
    metodo: respostaId ? 'PATCH' : 'POST',
    dados: { questaoId, alternativaId },
  });
}

export function finalizarQuiz(id) {
  return contaApi(`/tentativas-quiz/${id}/finalizar`, { metodo: 'POST' });
}
