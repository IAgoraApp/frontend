import { useState } from 'react';
import { Title } from '../../../shared/ui';
import { Action, Icon } from './financeUi';
import { questions } from '../content';

function answerFor(question) {
  const text = question
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  if (/reserva|emergencia/.test(text))
    return 'Uma reserva é um valor separado para imprevistos. Você pode criar uma meta, definir um valor possível e acompanhar quanto já guardou na aba Metas.';
  if (/receita|salario|entrada/.test(text))
    return 'Use “Adicionar lançamento”, selecione Entrada, preencha descrição, valor, data e categoria e salve. O resumo do mês será atualizado.';
  if (/conta|vencimento|boleto/.test(text))
    return 'Abra Ferramentas → Contas e boletos para cadastrar vencimentos. Ao confirmar um pagamento, uma saída é registrada e o saldo do mês é atualizado.';
  if (/banco|agenda|conectar|sincroniz/.test(text))
    return 'As integrações bancária e com Google Agenda ainda não estão disponíveis. Por enquanto, você pode registrar os movimentos manualmente e exportar os vencimentos para sua agenda.';
  if (/meta|guardar|objetivo/.test(text))
    return 'Na aba Metas, crie um objetivo com valor total e prazo. Atualize o valor já guardado para acompanhar o progresso. O valor da meta é um acompanhamento separado dos lançamentos.';
  if (/categoria/.test(text))
    return 'Separe os registros em categorias como Moradia, Alimentação e Transporte. Você pode criar categorias e definir limites mensais na aba Categorias.';
  if (/gasto|orcamento|organizar|limite/.test(text))
    return 'Comece registrando suas entradas e saídas. Depois, use “Montar meu orçamento” para distribuir a renda entre moradia, alimentação, transporte, contas e objetivos, deixando espaço para imprevistos.';
  return 'Posso ajudar com o uso da página: lançamentos, orçamento, categorias, contas e metas. Escolha um desses assuntos ou use as perguntas sugeridas.';
}
export default function FinanceAssistant() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState(null);
  function ask(text) {
    if (!text.trim()) return;
    setResponse({ question: text.trim(), answer: answerFor(text) });
    setQuestion('');
  }
  return (
    <section
      aria-labelledby='finance-assistant-heading'
      className='mt-8 grid gap-6 bg-[#eaf1f5] p-5 sm:p-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]'
    >
      <div className='flex items-start gap-5'>
        <Icon
          name='IllustrationOpenBook'
          className='mt-4 hidden h-18 w-20 sm:flex'
        />
        <div>
          <p className='text-xs font-bold text-(--laranja-principal)'>
            IA · CONCEITO
          </p>
          <Title
            id='finance-assistant-heading'
            className='mt-2 text-3xl leading-tight font-extrabold'
          >
            Precisa de uma mão?
          </Title>
          <p className='mt-3 text-sm'>
            Tire dúvidas sobre orçamento e categorias.
          </p>
        </div>
      </div>
      <div className='space-y-3'>
        {questions.map(text => (
          <button
            type='button'
            key={text}
            onClick={() => ask(text)}
            className='min-h-11 w-full rounded-full border border-[#d9e2ec] bg-white px-5 py-3 text-left text-sm hover:border-(--laranja-principal)'
          >
            {text}
          </button>
        ))}
        <form
          onSubmit={event => {
            event.preventDefault();
            ask(question);
          }}
          className='flex min-w-0 items-center gap-2 rounded-full border border-[#d9e2ec] bg-white p-1.5 pl-5'
        >
          <input
            aria-label='Sua dúvida sobre finanças'
            placeholder='Escreva sua dúvida…'
            value={question}
            onChange={event => setQuestion(event.target.value)}
            maxLength={500}
            className='min-w-0 flex-1 py-2 text-sm'
          />
          <Action
            type='submit'
            disabled={!question.trim()}
            aria-label='Enviar dúvida'
            className='relative size-11 shrink-0 px-0'
          >
            <Icon name='InputSendButton' className='size-9' />
            <span aria-hidden='true' className='absolute text-xl'>
              →
            </span>
          </Action>
        </form>
        <p className='text-xs leading-relaxed text-(--texto-apoio)'>
          Respostas educativas predefinidas. Sem acesso a dados bancários ou IA
          conectada.
        </p>
        {response && (
          <div
            role='status'
            className='rounded-xl border border-[#d9e2ec] bg-white p-5 text-sm leading-relaxed'
          >
            <p className='mb-2 font-bold'>{response.question}</p>
            <p>{response.answer}</p>
            <button
              type='button'
              onClick={() => setResponse(null)}
              className='mt-3 min-h-11 text-xs font-bold text-(--laranja-principal)'
            >
              Fechar resposta
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
