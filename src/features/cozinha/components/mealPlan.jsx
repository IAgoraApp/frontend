import { Titulo } from '../../../shared/ui/index';
import { BotaoCasa, CartaoCasa } from '../../casa/components/index';
import { adicionarDias, receitasCozinha, tiposRefeicao } from '../content';

export default function PlanoRefeicoes({
  semana,
  refeicoes,
  aoMudarSemana,
  aoEditar,
  aoSugerir,
  aoGerarCompras,
}) {
  const dias = Array.from({ length: 7 }, (_, indice) =>
    adicionarDias(semana, indice)
  );

  return (
    <div className='space-y-5'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <button
            type='button'
            aria-label='Semana anterior'
            onClick={() => aoMudarSemana(adicionarDias(semana, -7))}
            className='size-11 rounded-full border border-[#dbe5ed] text-xl'
          >
            ‹
          </button>
          <strong className='text-sm'>
            {new Date(semana + 'T12:00:00').toLocaleDateString('pt-BR')} —{' '}
            {new Date(dias[6] + 'T12:00:00').toLocaleDateString('pt-BR')}
          </strong>
          <button
            type='button'
            aria-label='Próxima semana'
            onClick={() => aoMudarSemana(adicionarDias(semana, 7))}
            className='size-11 rounded-full border border-[#dbe5ed] text-xl'
          >
            ›
          </button>
        </div>
        <BotaoCasa onClick={aoSugerir}>Preencher plano de exemplo</BotaoCasa>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-7'>
        {dias.map(dia => (
          <CartaoCasa key={dia} classe='px-3!'>
            <Titulo classe='mb-4 text-lg font-bold'>
              {new Date(dia + 'T12:00:00').toLocaleDateString('pt-BR', {
                weekday: 'short',
                day: '2-digit',
              })}
            </Titulo>
            <div className='space-y-4'>
              {tiposRefeicao.map(tipo => {
                const refeicao = refeicoes.find(
                  item => item.date === dia && item.type === tipo
                );
                const receita =
                  refeicao &&
                  receitasCozinha.find(item => item.id === refeicao.recipeId);
                return (
                  <div key={tipo}>
                    <p className='mb-2 text-xs font-bold text-(--texto-apoio)'>
                      {tipo}
                    </p>
                    <button
                      type='button'
                      aria-label={
                        tipo +
                        ' em ' +
                        dia +
                        (receita ? ': ' + receita.title : ': adicionar')
                      }
                      onClick={() =>
                        aoEditar(
                          refeicao ?? {
                            date: dia,
                            type: tipo,
                            recipeId: 'omelete',
                            portions: 1,
                          }
                        )
                      }
                      className={
                        'min-h-16 w-full rounded-lg border p-3 text-left text-sm ' +
                        (receita
                          ? 'border-[#f5d3bf] bg-(--laranja-fundo)'
                          : 'border-dashed border-[#dbe5ed] bg-(--azul-fundo)')
                      }
                    >
                      {receita ? (
                        <>
                          <strong className='block'>{receita.title}</strong>
                          <span className='mt-1 block text-xs'>
                            {refeicao.portions} porção(ões)
                          </span>
                        </>
                      ) : (
                        '+ Adicionar'
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </CartaoCasa>
        ))}
      </div>

      <div className='flex flex-wrap gap-3'>
        <BotaoCasa onClick={aoGerarCompras}>Gerar compras desta semana</BotaoCasa>
        <BotaoCasa
          secundario
          onClick={() =>
            aoEditar({
              date: semana,
              type: 'Almoço',
              recipeId: 'macarrao',
              portions: 2,
            })
          }
        >
          + Adicionar refeição
        </BotaoCasa>
      </div>
      <p className='text-xs text-(--texto-apoio)'>
        O plano de exemplo usa receitas do catálogo local e preenche apenas
        horários vazios.
      </p>
    </div>
  );
}
