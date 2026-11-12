import { useState } from 'react';
import { CampoFormulario, Titulo } from '../../../shared/ui/index';
import {
  AcaoFinancas,
  PainelFinancas,
  SegmentosFinancas,
} from './financeUi';
import {
  analisarCentavos,
  camposOrcamento,
  criarIdFinancas,
  formatarDecimal,
  formatarMoeda,
  hojeIso,
  paletaCoresFinancas,
} from '../content';

const classeEntrada =
  'h-[52px] w-full min-w-0 rounded-lg border border-[#dbe5ed] bg-white px-4 text-base text-(--azul-titulo)';

function CampoSelecao({ nome, rotulo, valor, aoAlterar, children }) {
  return (
    <div className='flex min-w-0 flex-col gap-2 text-sm font-bold'>
      <label htmlFor={'financas-' + nome}>{rotulo}</label>
      <select
        id={'financas-' + nome}
        name={nome}
        value={valor}
        onChange={aoAlterar}
        className={classeEntrada}
      >
        {children}
      </select>
    </div>
  );
}

const titulosFormulario = {
  transaction: [
    'Cada movimento, no seu lugar.',
    'Registre uma entrada ou saída para acompanhar seu mês.',
  ],
  category: ['Nova categoria.', 'Uma organização que faz sentido para você.'],
  bill: ['Nova conta.', 'Um vencimento no radar.'],
  goal: ['Nova meta.', 'Um objetivo com próximos passos.'],
  budget: [
    'Um plano possível para o seu mês.',
    'Defina limites que façam sentido para sua realidade.',
  ],
};

export default function FormularioFinancas({
  tipo,
  registro,
  dados,
  saldo,
  aoSalvar,
  aoVoltar,
}) {
  const [valores, setValores] = useState(() => {
    if (tipo === 'budget') {
      return Object.fromEntries(
        camposOrcamento.map(([chave]) => [
          chave,
          formatarDecimal(dados.budget?.[chave] ?? 0),
        ])
      );
    }
    return {
      nome: registro?.name ?? '',
      valor: registro ? formatarDecimal(registro.amount ?? 0) : '',
      guardado: formatarDecimal(registro?.saved ?? 0),
      data: registro?.date ?? (tipo === 'goal' ? '' : hojeIso()),
      tipoMovimento: registro?.type ?? 'expense',
      categoriaId: registro?.categoryId ?? '',
      pagamento: registro?.payment ?? 'Pix',
      repetir: registro?.repeat ?? tipo === 'bill',
      cor: registro?.color ?? paletaCoresFinancas[1],
      limite: formatarDecimal(registro?.limit ?? 0),
    };
  });
  const [erro, setErro] = useState('');

  const atualizarCampo = evento =>
    setValores(anterior => ({
      ...anterior,
      [evento.target.name]:
        evento.target.type === 'checkbox'
          ? evento.target.checked
          : evento.target.value,
    }));

  const campoNumerico = (nome, rotulo, obrigatorio = true) => (
    <CampoFormulario
      id={'financas-' + nome}
      name={nome}
      rotulo={rotulo}
      value={valores[nome]}
      onChange={atualizarCampo}
      inputMode='decimal'
      placeholder='0,00'
      required={obrigatorio}
      maxLength={18}
    />
  );

  const valorCentavos = analisarCentavos(valores.valor) || 0;
  const alocacoes = camposOrcamento
    .slice(1)
    .reduce((soma, [chave]) => soma + (analisarCentavos(valores[chave]) || 0), 0);
  const renda = analisarCentavos(valores.renda) || 0;
  const saldoPrevisto =
    saldo +
    (valores.tipoMovimento === 'income' ? valorCentavos : -valorCentavos) -
    (registro && tipo === 'transaction'
      ? registro.type === 'income'
        ? registro.amount
        : -registro.amount
      : 0);

  function enviar(evento) {
    evento.preventDefault();
    setErro('');
    if (tipo === 'budget') {
      const resultado = Object.fromEntries(
        camposOrcamento.map(([chave]) => [chave, analisarCentavos(valores[chave])])
      );
      if (
        Object.values(resultado).some(
          valor => !Number.isSafeInteger(valor) || valor < 0
        ) ||
        resultado.renda <= 0
      ) {
        setErro(
          'Informe a renda e os limites válidos, usando vírgula para os centavos.'
        );
        return;
      }
      if (
        camposOrcamento
          .slice(1)
          .reduce((soma, [chave]) => soma + resultado[chave], 0) > resultado.renda
      ) {
        setErro(
          'Os limites ultrapassam sua renda. Ajuste os valores antes de salvar.'
        );
        return;
      }
      aoSalvar(resultado);
      return;
    }

    if (!valores.nome.trim()) {
      setErro('Preencha a descrição.');
      return;
    }

    if (tipo === 'category') {
      if (
        dados.categories.some(
          cat =>
            cat.id !== registro?.id &&
            cat.type === valores.tipoMovimento &&
            cat.name.toLocaleLowerCase('pt-BR') ===
              valores.nome.trim().toLocaleLowerCase('pt-BR')
        )
      ) {
        setErro('Já existe uma categoria com este nome e tipo.');
        return;
      }
      const limite = analisarCentavos(valores.limite);
      if (!Number.isSafeInteger(limite) || limite < 0) {
        setErro('Informe um limite válido.');
        return;
      }
      aoSalvar({
        ...registro,
        id: registro?.id ?? criarIdFinancas(),
        name: valores.nome.trim(),
        type: valores.tipoMovimento,
        color: valores.cor,
        limit: limite,
        icon: registro?.icon ?? 'Receipt',
      });
      return;
    }

    const quantia = analisarCentavos(valores.valor);
    if (!Number.isSafeInteger(quantia) || quantia <= 0) {
      setErro('Informe um valor maior que zero, como 120,50.');
      return;
    }

    if (
      tipo === 'transaction' &&
      !dados.categories.some(
        cat =>
          cat.id === valores.categoriaId && cat.type === valores.tipoMovimento
      )
    ) {
      setErro('Selecione uma categoria para o lançamento.');
      return;
    }

    const guardado = analisarCentavos(valores.guardado);
    if (
      tipo === 'goal' &&
      (!Number.isSafeInteger(guardado) || guardado < 0 || guardado > quantia)
    ) {
      setErro(
        'O valor guardado deve estar entre zero e o valor do objetivo.'
      );
      return;
    }

    if (tipo === 'goal' && valores.data && valores.data < hojeIso()) {
      setErro('Escolha um prazo a partir de hoje.');
      return;
    }

    aoSalvar({
      ...registro,
      name: valores.nome.trim(),
      id: registro?.id ?? criarIdFinancas(),
      amount: quantia,
      date: valores.data,
      type: valores.tipoMovimento,
      categoryId: valores.categoriaId,
      payment: valores.pagamento,
      repeat: valores.repetir,
      saved: tipo === 'goal' ? guardado : undefined,
      icon: registro?.icon ?? (tipo === 'goal' ? 'Sofa' : 'Receipt'),
    });
  }

  return (
    <div className='space-y-7'>
      <button
        type='button'
        onClick={aoVoltar}
        className='min-h-11 text-sm font-bold text-(--texto-apoio) hover:text-(--laranja-principal)'
      >
        ← Voltar
      </button>
      <div>
        <span className='inline-block rotate-[1.4deg] bg-(--laranja-principal) px-3 py-1.5 text-xs font-bold text-white'>
          SEU DINHEIRO EM PERSPECTIVA
        </span>
        <Titulo
          como='h1'
          classe='mt-3 text-3xl leading-tight font-extrabold sm:text-5xl'
        >
          {registro
            ? 'Editar ' +
              ({
                transaction: 'lançamento.',
                category: 'categoria.',
                bill: 'conta.',
                goal: 'meta.',
              }[tipo] ?? 'orçamento.')
            : titulosFormulario[tipo][0]}
        </Titulo>
        <p className='mt-3 text-(--texto-apoio)'>{titulosFormulario[tipo][1]}</p>
      </div>
      <div className='grid items-start gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]'>
        <PainelFinancas>
          <form className='space-y-6' onSubmit={enviar}>
            {tipo === 'budget' ? (
              <div className='grid gap-5 sm:grid-cols-2'>
                {camposOrcamento.map(([chave, rotulo]) => (
                  <div
                    key={chave}
                    className={
                      chave === 'renda' || chave === 'reserva'
                        ? 'sm:col-span-2'
                        : ''
                    }
                  >
                    {campoNumerico(chave, rotulo + ' (R$)')}
                  </div>
                ))}
              </div>
            ) : (
              <>
                {(tipo === 'transaction' || tipo === 'category') && (
                  <SegmentosFinancas
                    rotulo='Tipo de movimento'
                    valor={valores.tipoMovimento}
                    opcoes={
                      tipo === 'transaction'
                        ? [
                            ['expense', 'Saída'],
                            ['income', 'Entrada'],
                          ]
                        : [
                            ['expense', 'Despesa'],
                            ['income', 'Receita'],
                          ]
                    }
                    aoAlterar={tipoMovimento =>
                      setValores(anterior => ({
                        ...anterior,
                        tipoMovimento,
                        categoriaId: '',
                      }))
                    }
                  />
                )}
                <CampoFormulario
                  id='financas-nome'
                  name='nome'
                  rotulo={
                    tipo === 'transaction'
                      ? 'Descrição'
                      : tipo === 'goal'
                        ? 'Objetivo'
                        : 'Nome'
                  }
                  required
                  maxLength={100}
                  autoFocus
                  value={valores.nome}
                  onChange={atualizarCampo}
                  placeholder={
                    tipo === 'goal' ? 'Ex.: Comprar meus móveis' : 'Digite aqui'
                  }
                />
                {tipo === 'category' ? (
                  <div className='grid gap-5 sm:grid-cols-2'>
                    <CampoSelecao
                      nome='cor'
                      rotulo='Cor'
                      valor={valores.cor}
                      aoAlterar={atualizarCampo}
                    >
                      {paletaCoresFinancas.map((cor, indice) => (
                        <option key={cor} value={cor}>
                          {
                            [
                              'Azul',
                              'Laranja',
                              'Turquesa',
                              'Cinza',
                              'Verde',
                              'Roxo',
                            ][indice]
                          }
                        </option>
                      ))}
                    </CampoSelecao>
                    {campoNumerico('limite', 'Limite mensal (R$)')}
                  </div>
                ) : (
                  <>
                    <div className='grid gap-5 sm:grid-cols-2'>
                      {campoNumerico(
                        'valor',
                        tipo === 'goal' ? 'Valor total (R$)' : 'Valor (R$)'
                      )}
                      <CampoFormulario
                        id='financas-data'
                        name='data'
                        type='date'
                        rotulo={
                          tipo === 'goal'
                            ? 'Prazo (opcional)'
                            : tipo === 'bill'
                              ? 'Vencimento'
                              : 'Data'
                        }
                        required={tipo !== 'goal'}
                        min={tipo === 'goal' ? hojeIso() : undefined}
                        value={valores.data}
                        onChange={atualizarCampo}
                      />
                    </div>
                    {tipo === 'goal' &&
                      campoNumerico('guardado', 'Valor já guardado (R$)')}
                    {tipo === 'transaction' && (
                      <div className='grid gap-5 sm:grid-cols-2'>
                        <CampoSelecao
                          nome='categoriaId'
                          rotulo='Categoria'
                          valor={valores.categoriaId}
                          aoAlterar={atualizarCampo}
                        >
                          <option value=''>Selecionar categoria</option>
                          {dados.categories
                            .filter(cat => cat.type === valores.tipoMovimento)
                            .map(cat => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                        </CampoSelecao>
                        <CampoSelecao
                          nome='pagamento'
                          rotulo='Forma de pagamento'
                          valor={valores.pagamento}
                          aoAlterar={atualizarCampo}
                        >
                          {[
                            'Pix',
                            'Dinheiro',
                            'Débito',
                            'Crédito',
                            'Transferência',
                            'Boleto',
                          ].map(forma => (
                            <option key={forma}>{forma}</option>
                          ))}
                        </CampoSelecao>
                      </div>
                    )}
                    {(tipo === 'bill' ||
                      (tipo === 'transaction' &&
                        valores.tipoMovimento === 'expense' &&
                        !registro?.billId)) && (
                      <label className='flex min-h-14 items-center gap-3 rounded-lg bg-(--azul-fundo) p-4 text-sm'>
                        <input
                          type='checkbox'
                          name='repetir'
                          checked={valores.repetir}
                          onChange={atualizarCampo}
                          className='size-5 accent-(--laranja-principal)'
                        />
                        <span>
                          <strong>Repetir todo mês</strong>
                          <span className='mt-1 block text-(--texto-apoio)'>
                            Você poderá ajustar ou encerrar a recorrência.
                          </span>
                        </span>
                      </label>
                    )}
                  </>
                )}
              </>
            )}
            {erro && (
              <p
                role='alert'
                className='rounded-lg bg-red-50 p-4 text-sm text-[#b42318]'
              >
                {erro}
              </p>
            )}
            <div className='flex flex-wrap gap-3'>
              <AcaoFinancas type='submit'>
                {tipo === 'budget'
                  ? 'Salvar orçamento'
                  : tipo === 'transaction'
                    ? 'Salvar lançamento'
                    : 'Salvar'}
              </AcaoFinancas>
              <AcaoFinancas type='button' secundario onClick={aoVoltar}>
                Cancelar
              </AcaoFinancas>
            </div>
          </form>
        </PainelFinancas>
        <aside className='space-y-5'>
          <PainelFinancas neutro>
            <p className='text-xs font-bold text-(--laranja-principal)'>
              {tipo === 'budget'
                ? 'SEU PLANO DO MÊS'
                : tipo === 'goal'
                  ? 'SUA CONQUISTA'
                  : 'SEU MÊS EM PERSPECTIVA'}
            </p>
            <Titulo classe='mt-4 text-3xl font-extrabold'>
              {tipo === 'budget'
                ? formatarMoeda(renda - alocacoes)
                : tipo === 'transaction'
                  ? formatarMoeda(saldoPrevisto)
                  : valores.nome || 'Um passo de cada vez.'}
            </Titulo>
            <p className='mt-3 text-sm text-(--texto-apoio)'>
              {tipo === 'budget'
                ? 'livres depois de distribuir sua renda'
                : tipo === 'transaction'
                  ? 'Saldo previsto depois de salvar este lançamento.'
                  : tipo === 'goal'
                    ? formatarMoeda(analisarCentavos(valores.guardado) || 0) +
                      ' de ' +
                      formatarMoeda(valorCentavos) +
                      ' guardados'
                    : tipo === 'bill'
                      ? formatarMoeda(valorCentavos) +
                        ' · Confira a data de vencimento.'
                      : 'Ela ficará disponível nos seus próximos lançamentos.'}
            </p>
            {tipo === 'budget' && (
              <div className='mt-5 space-y-3'>
                {camposOrcamento.slice(1).map(([chave, rotulo]) => (
                  <div
                    key={chave}
                    className='flex flex-wrap justify-between gap-2 text-sm'
                  >
                    <span>{rotulo}</span>
                    <strong>
                      {formatarMoeda(analisarCentavos(valores[chave]) || 0)}
                    </strong>
                  </div>
                ))}
              </div>
            )}
          </PainelFinancas>
          <p className='rounded-xl bg-(--azul-fundo) p-5 text-sm leading-relaxed text-(--texto-apoio)'>
            Comece pelo essencial. Você pode revisar seus registros e ajustar o
            planejamento quando precisar.
          </p>
        </aside>
      </div>
    </div>
  );
}
