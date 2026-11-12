import { useState } from 'react';
import { Titulo } from '../../../compartilhado/interface/indice';
import { AcaoFinancas, IconeFinancas } from './InterfaceFinancas';
import { perguntasSugeridasFinancas } from '../conteudo';

function respostaPara(pergunta) {
  const texto = pergunta
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  if (/reserva|emergencia/.test(texto)) {
    return 'Uma reserva é um valor separado para imprevistos. Você pode criar uma meta, definir um valor possível e acompanhar quanto já guardou na aba Metas.';
  }
  if (/receita|salario|entrada/.test(texto)) {
    return 'Use “Adicionar lançamento”, selecione Entrada, preencha descrição, valor, data e categoria e salve. O resumo do mês será atualizado.';
  }
  if (/conta|vencimento|boleto/.test(texto)) {
    return 'Abra Ferramentas → Contas e boletos para cadastrar vencimentos. Ao confirmar um pagamento, uma saída é registrada e o saldo do mês é atualizado.';
  }
  if (/banco|agenda|conectar|sincroniz/.test(texto)) {
    return 'As integrações bancária e com Google Agenda ainda não estão disponíveis. Por enquanto, você pode registrar os movimentos manualmente e exportar os vencimentos para sua agenda.';
  }
  if (/meta|guardar|objetivo/.test(texto)) {
    return 'Na aba Metas, crie um objetivo com valor total e prazo. Atualize o valor já guardado para acompanhar o progresso. O valor da meta é um acompanhamento separado dos lançamentos.';
  }
  if (/categoria/.test(texto)) {
    return 'Separe os registros em categorias como Moradia, Alimentação e Transporte. Você pode criar categorias e definir limites mensais na aba Categorias.';
  }
  if (/gasto|orcamento|organizar|limite/.test(texto)) {
    return 'Comece registrando suas entradas e saídas. Depois, use “Montar meu orçamento” para distribuir a renda entre moradia, alimentação, transporte, contas e objetivos, deixando espaço para imprevistos.';
  }
  return 'Posso ajudar com o uso da página: lançamentos, orçamento, categorias, contas e metas. Escolha um desses assuntos ou use as perguntas sugeridas.';
}

export default function AssistenteFinancas() {
  const [pergunta, setPergunta] = useState('');
  const [resposta, setResposta] = useState(null);

  function perguntar(texto) {
    if (!texto.trim()) return;
    setResposta({ pergunta: texto.trim(), texto: respostaPara(texto) });
    setPergunta('');
  }

  return (
    <section
      aria-labelledby='titulo-assistente-financas'
      className='mt-8 grid gap-6 rounded-xl bg-[#eaf1f5] p-5 sm:p-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]'
    >
      <div className='flex items-start gap-5'>
        <IconeFinancas
          nome='LivroAberto'
          classe='mt-4 hidden h-18 w-20 sm:flex'
        />
        <div>
          <p className='text-xs font-bold tracking-[0.08em] text-(--laranja-principal)'>
            IA · CONCEITO
          </p>
          <Titulo
            id='titulo-assistente-financas'
            classe='mt-2 text-3xl leading-tight font-extrabold'
          >
            Precisa de uma mão?
          </Titulo>
          <p className='mt-3 text-sm text-(--texto-apoio)'>
            Tire dúvidas sobre orçamento e categorias.
          </p>
        </div>
      </div>
      <div className='space-y-3'>
        {perguntasSugeridasFinancas.map(texto => (
          <button
            type='button'
            key={texto}
            onClick={() => perguntar(texto)}
            className='min-h-11 w-full rounded-full border border-[#d9e2ec] bg-white px-5 py-3 text-left text-sm hover:border-(--laranja-principal)'
          >
            {texto}
          </button>
        ))}
        <form
          onSubmit={evento => {
            evento.preventDefault();
            perguntar(pergunta);
          }}
          className='flex min-w-0 items-center gap-2 rounded-full border border-[#d9e2ec] bg-white p-1.5 pl-5'
        >
          <input
            aria-label='Sua dúvida sobre finanças'
            placeholder='Escreva sua dúvida…'
            value={pergunta}
            onChange={evento => setPergunta(evento.target.value)}
            maxLength={500}
            className='min-w-0 flex-1 py-2 text-sm'
          />
          <AcaoFinancas
            type='submit'
            disabled={!pergunta.trim()}
            aria-label='Enviar dúvida'
            classe='relative size-11 shrink-0 px-0'
          >
            <IconeFinancas nome='BotaoEnviar' classe='size-9' />
            <span aria-hidden='true' className='absolute text-xl'>
              →
            </span>
          </AcaoFinancas>
        </form>
        <p className='text-xs leading-relaxed text-(--texto-apoio)'>
          Orientações educativas. Sem recomendações de investimento ou acesso a
          dados bancários.
        </p>
        {resposta && (
          <div
            role='status'
            className='rounded-xl border border-[#d9e2ec] bg-white p-5 text-sm leading-relaxed'
          >
            <p className='mb-2 font-bold'>{resposta.pergunta}</p>
            <p>{resposta.texto}</p>
            <button
              type='button'
              onClick={() => setResposta(null)}
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
