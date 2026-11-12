import { useState } from 'react';
import { CampoFormulario } from '../../../shared/ui/index';
import { BotaoCasa, SelecaoCasa } from '../../casa/components/index';
import { chaveData, receitasCozinha, tiposRefeicao } from '../content';

export function FormularioRefeicao({
  item,
  aoSalvar,
  aoCancelar,
  aoRemover,
}) {
  return (
    <form
      className='space-y-5'
      onSubmit={evento => {
        evento.preventDefault();
        const valores = Object.fromEntries(new FormData(evento.currentTarget));
        aoSalvar({
          ...valores,
          id: item?.id ?? crypto.randomUUID(),
          portions: Number(valores.portions),
        });
      }}
    >
      <CampoFormulario
        id='refeicao-data'
        name='date'
        rotulo='Dia'
        type='date'
        defaultValue={item?.date ?? chaveData()}
        required
      />
      <SelecaoCasa
        id='refeicao-tipo'
        name='type'
        rotulo='Refeição'
        defaultValue={item?.type ?? 'Almoço'}
      >
        {tiposRefeicao.map(tipo => (
          <option key={tipo}>{tipo}</option>
        ))}
      </SelecaoCasa>
      <SelecaoCasa
        id='refeicao-receita'
        name='recipeId'
        rotulo='Receita'
        defaultValue={item?.recipeId ?? 'omelete'}
      >
        {receitasCozinha.map(receita => (
          <option key={receita.id} value={receita.id}>
            {receita.title}
          </option>
        ))}
      </SelecaoCasa>
      <CampoFormulario
        id='refeicao-porcoes'
        name='portions'
        rotulo='Porções'
        type='number'
        min={1}
        max={24}
        step={1}
        defaultValue={item?.portions ?? 1}
        required
      />
      <div className='flex flex-wrap gap-3'>
        <BotaoCasa type='submit'>Salvar no plano</BotaoCasa>
        <BotaoCasa secundario type='button' onClick={aoCancelar}>
          Cancelar
        </BotaoCasa>
        {item?.id && (
          <button
            type='button'
            onClick={aoRemover}
            className='min-h-12 px-3 text-sm font-bold text-[#b42318]'
          >
            Remover refeição
          </button>
        )}
      </div>
    </form>
  );
}

export function FormularioCompras({ item, aoSalvar, aoCancelar, aoRemover }) {
  const [erro, setErro] = useState('');

  return (
    <form
      className='space-y-5'
      onSubmit={evento => {
        evento.preventDefault();
        const valores = Object.fromEntries(new FormData(evento.currentTarget));
        const quantidade = Number(String(valores.amount).replace(',', '.'));
        if (
          !valores.name.trim() ||
          !Number.isFinite(quantidade) ||
          quantidade <= 0 ||
          quantidade > 100000
        ) {
          setErro('Informe o item e uma quantidade válida maior que zero.');
          return;
        }
        aoSalvar({
          ...valores,
          name: valores.name.trim(),
          amount: quantidade,
          id: item?.id ?? crypto.randomUUID(),
          bought: item?.bought ?? false,
        });
      }}
    >
      <CampoFormulario
        id='compra-nome'
        name='name'
        rotulo='Item'
        defaultValue={item?.name ?? ''}
        maxLength={100}
        required
      />
      <div className='grid gap-4 sm:grid-cols-2'>
        <CampoFormulario
          id='compra-quantidade'
          name='amount'
          rotulo='Quantidade'
          inputMode='decimal'
          defaultValue={item?.amount ?? 1}
          maxLength={10}
          required
        />
        <SelecaoCasa
          id='compra-unidade'
          name='unit'
          rotulo='Unidade'
          defaultValue={item?.unit ?? 'unidade'}
        >
          {[
            ...new Set(
              [
                'unidade',
                'g',
                'kg',
                'ml',
                'L',
                'xícara',
                'colher de sopa',
                'colher de chá',
                'dente',
                'pitada',
                item?.unit,
              ].filter(Boolean)
            ),
          ].map(unidade => (
            <option key={unidade}>{unidade}</option>
          ))}
        </SelecaoCasa>
      </div>
      <SelecaoCasa
        id='compra-categoria'
        name='category'
        rotulo='Categoria'
        defaultValue={item?.category ?? 'Frescos'}
      >
        {['Frescos', 'Básicos', 'Outros'].map(categoria => (
          <option key={categoria}>{categoria}</option>
        ))}
      </SelecaoCasa>
      {erro && (
        <p role='alert' className='text-sm text-[#b42318]'>
          {erro}
        </p>
      )}
      <div className='flex flex-wrap gap-3'>
        <BotaoCasa type='submit'>Salvar item</BotaoCasa>
        <BotaoCasa secundario type='button' onClick={aoCancelar}>
          Cancelar
        </BotaoCasa>
        {item && (
          <button
            type='button'
            onClick={aoRemover}
            className='min-h-12 px-3 text-sm font-bold text-[#b42318]'
          >
            Excluir item
          </button>
        )}
      </div>
    </form>
  );
}
