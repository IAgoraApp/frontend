import { useState } from 'react';
import { BotaoCasa, CartaoCasa } from '../../casa/componentes/indice';
import {
  formatarQuantidade,
  ingredientesFaltantes,
  possuiIngrediente,
} from '../conteudo';
import { ImagemReceita } from './CartoesReceita';

export default function DetalheReceita({
  receita,
  dados,
  aoFavoritar,
  aoAtualizarDespensa,
  aoAdicionarCompras,
  aoPlanejarRefeicao,
  aoMarcar,
}) {
  const [porcoes, setPorcoes] = useState(receita.portions);
  const faltantes = ingredientesFaltantes(receita, porcoes, dados.pantry);

  return (
    <div className='space-y-6'>
      <div className='grid items-start gap-6 lg:grid-cols-2'>
        <ImagemReceita
          receita={receita}
          detalhe
          classe='aspect-[1.4] rounded-xl'
        />
        <div className='space-y-5'>
          <p className='text-sm text-(--texto-apoio)'>
            {receita.minutes} min · {porcoes} porções · Nível: {receita.level}
          </p>
          <p className='text-lg leading-relaxed'>{receita.description}</p>
          <div className='flex flex-wrap gap-3'>
            <BotaoCasa
              secundario
              aria-pressed={dados.favorites.includes(receita.id)}
              onClick={() => aoFavoritar(receita.id)}
            >
              {dados.favorites.includes(receita.id)
                ? "Receita salva"
                : "Salvar receita"}
            </BotaoCasa>
            <BotaoCasa onClick={() => aoPlanejarRefeicao(receita, porcoes)}>
              Adicionar ao plano
            </BotaoCasa>
          </div>
          <CartaoCasa titulo='Ingredientes'>
            <div className='mb-5 flex flex-wrap items-center gap-3'>
              <button
                type='button'
                disabled={porcoes <= 1}
                onClick={() => setPorcoes(valor => valor - 1)}
                aria-label='Diminuir porções'
                className='size-11 rounded-full border border-[#dbe5ed] disabled:opacity-40'
              >
                −
              </button>
              <output
                aria-live='polite'
                className='min-w-20 text-center font-bold'
              >
                {porcoes} porções
              </output>
              <button
                type='button'
                disabled={porcoes >= 24}
                onClick={() => setPorcoes(valor => valor + 1)}
                aria-label='Aumentar porções'
                className='size-11 rounded-full border border-[#dbe5ed] disabled:opacity-40'
              >
                +
              </button>
            </div>
            <ul className='space-y-3'>
              {receita.ingredients.map((item, indice) => (
                <li key={indice}>
                  <label className='flex min-h-11 items-center gap-3'>
                    <input
                      type='checkbox'
                      aria-label={'Já tenho ' + item.name + ' ' + item.unit}
                      checked={possuiIngrediente(dados.pantry, item.name)}
                      onChange={evento =>
                        aoAtualizarDespensa(item.name, evento.target.checked)
                      }
                      className='size-5 shrink-0 accent-(--laranja-principal)'
                    />
                    <span>
                      {formatarQuantidade(
                        (item.amount * porcoes) / receita.portions
                      )}{' '}
                      {item.unit} de {item.name.toLocaleLowerCase('pt-BR')}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
            <p className='mt-4 text-xs text-(--texto-apoio)'>
              Marque os ingredientes que você já tem em casa. As quantidades
              acompanham as porções.
            </p>
          </CartaoCasa>
        </div>
      </div>

      <CartaoCasa titulo='Modo de preparo'>
        <ol className='space-y-4'>
          {receita.steps.map((passo, indice) => (
            <li key={indice}>
              <label className='flex min-h-14 items-start gap-4 rounded-lg bg-(--azul-fundo) p-4'>
                <input
                  type='checkbox'
                  checked={Boolean(dados.checks[receita.id + ':' + indice])}
                  onChange={evento =>
                    aoMarcar(
                      receita.id + ':' + indice,
                      evento.target.checked
                    )
                  }
                  className='mt-1 size-5 shrink-0 accent-(--laranja-principal)'
                />
                <span>
                  <strong>{indice + 1}. </strong>
                  {passo}
                </span>
              </label>
            </li>
          ))}
        </ol>
      </CartaoCasa>

      <div className='flex flex-wrap gap-3'>
        <BotaoCasa
          onClick={() => aoAdicionarCompras(faltantes)}
          disabled={!faltantes.length}
        >
          Adicionar ingredientes faltantes ({faltantes.length})
        </BotaoCasa>
        <BotaoCasa
          secundario
          onClick={() => aoPlanejarRefeicao(receita, porcoes)}
        >
          Planejar esta refeição
        </BotaoCasa>
      </div>
      <p className='text-xs text-(--texto-apoio)'>
        Os tempos são aproximados e podem variar conforme o equipamento. Ajuste
        o preparo e confira o ponto dos alimentos.
      </p>
    </div>
  );
}
