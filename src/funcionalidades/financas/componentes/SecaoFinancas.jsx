import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Titulo } from '../../../compartilhado/interface/indice';
import Rodape from '../../../compartilhado/Rodape';
import DetalheFinancas from './DetalheFinancas';
import FormularioFinancas from './FormularioFinancas';
import AssistenteFinancas from './AssistenteFinancas';
import {
  AcaoFinancas,
  DialogoFinancas,
  IconeFinancas,
  PainelFinancas,
  PainelVisaoFinancas,
} from './InterfaceFinancas';
import {
  GraficoCategorias,
  LinhasLancamentos,
  ListaCategorias,
  ListaContas,
  ListaLancamentos,
  ListaMetas,
  RelatoriosFinancas,
  ResumoFinancas,
  VisaoOrcamento,
} from './VisoesFinancas';
import {
  abasFinancas,
  CHAVE_FINANCAS,
  calcularTotais,
  chaveMes,
  criarIdFinancas,
  exportarArquivoFinancas,
  formatarDecimal,
  formatarMoeda,
  lerEstadoFinancas,
  registrarPagamentoConta,
  salvarRegistroFinancas,
  statusConta,
  vencimentoConta,
  visoesFinancas,
} from '../conteudo';

const colecoesFinancas = {
  transaction: 'transactions',
  category: 'categories',
  bill: 'bills',
  goal: 'goals',
};

const apelidosAcao = {
  lancamento: 'transaction',
  categoria: 'category',
  conta: 'bill',
  meta: 'goal',
  orcamento: 'budget',
};

const tiposFormulario = [...Object.keys(colecoesFinancas), 'budget'];

const classePagina =
  'font-corpo text-(--azul-titulo) leading-normal wrap-anywhere [overflow-anchor:none] [font-optical-sizing:none] [&_:is(button,summary)]:cursor-pointer [&_button:disabled]:cursor-default [&_:is(a,button,input,select,summary):focus-visible]:outline-2 [&_:is(a,button,input,select,summary):focus-visible]:outline-offset-3 [&_:is(a,button,input,select,summary):focus-visible]:outline-(--laranja-principal)';

export default function SecaoFinancas() {
  const [carregado] = useState(lerEstadoFinancas);
  const [dados, setDados] = useState(carregado.dados);
  const [erroArmazenamento, setErroArmazenamento] = useState(
    carregado.erro
      ? 'Não foi possível carregar os dados salvos. Uma prévia de exemplo foi aberta; os dados anteriores não serão sobrescritos.'
      : ''
  );
  const [permitirSalvar, setPermitirSalvar] = useState(!carregado.erro);
  const [parametros, definirParametros] = useSearchParams();
  const visaoSolicitada = parametros.get('visao');
  const visao = Object.hasOwn(visoesFinancas, visaoSolicitada)
    ? visaoSolicitada
    : 'geral';
  const acaoBruta = parametros.get('acao');
  const acaoNormalizada = apelidosAcao[acaoBruta] ?? acaoBruta;
  const tipoFormulario = tiposFormulario.includes(acaoNormalizada)
    ? acaoNormalizada
    : null;
  const idEdicao = parametros.get('editar');
  const registro =
    tipoFormulario && colecoesFinancas[tipoFormulario] && idEdicao
      ? dados[colecoesFinancas[tipoFormulario]].find(
          item => item.id === idEdicao
        )
      : null;

  const [mes, setMes] = useState(chaveMes);
  const [dialogo, setDialogo] = useState(null);
  const [aviso, setAviso] = useState('');
  const refFerramentas = useRef(null);

  const itensMes = dados.transactions.filter(item =>
    item.date.startsWith(mes)
  );
  const resultado = calcularTotais(itensMes);
  const tipoPrincipal =
    {
      categorias: 'category',
      metas: 'goal',
      contas: 'bill',
      orcamento: 'budget',
    }[visao] ?? 'transaction';

  const rotuloPrincipal = {
    category: 'Nova categoria',
    goal: 'Nova meta',
    bill: 'Nova conta',
    budget: dados.budget ? 'Editar orçamento' : 'Montar orçamento',
    transaction: 'Adicionar lançamento',
  }[tipoPrincipal];

  useEffect(() => {
    if (!permitirSalvar) return;
    try {
      localStorage.setItem(CHAVE_FINANCAS, JSON.stringify(dados));
    } catch {
      const temporizador = window.setTimeout(
        () =>
          setErroArmazenamento(
            'Não foi possível salvar no navegador. Suas alterações continuam nesta sessão.'
          ),
        0
      );
      return () => window.clearTimeout(temporizador);
    }
  }, [dados, permitirSalvar]);

  useEffect(() => {
    if (!aviso) return;
    const temporizador = window.setTimeout(() => setAviso(''), 5000);
    return () => window.clearTimeout(temporizador);
  }, [aviso]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [tipoFormulario, idEdicao]);

  function navegar(proxima) {
    definirParametros(anterior => {
      const atualizado = new URLSearchParams(anterior);
      atualizado.set('visao', proxima);
      atualizado.delete('acao');
      atualizado.delete('editar');
      return atualizado;
    });
    if (refFerramentas.current) refFerramentas.current.open = false;
    setDialogo(null);
  }

  function abrirFormulario(proximoTipo, item) {
    setDialogo(null);
    definirParametros(anterior => {
      const atualizado = new URLSearchParams(anterior);
      atualizado.set('acao', proximoTipo);
      if (item) atualizado.set('editar', item.id);
      else atualizado.delete('editar');
      return atualizado;
    });
  }

  function fecharFormulario() {
    definirParametros(anterior => {
      const atualizado = new URLSearchParams(anterior);
      atualizado.delete('acao');
      atualizado.delete('editar');
      return atualizado;
    });
  }

  function salvar(valores) {
    if (tipoFormulario === 'budget') {
      setDados(anterior => ({ ...anterior, example: false, budget: valores }));
    } else {
      setDados(anterior => {
        let proximo = salvarRegistroFinancas(
          anterior,
          colecoesFinancas[tipoFormulario],
          valores
        );
        if (tipoFormulario === 'transaction') {
          const vinculada = anterior.bills.find(
            conta => conta.sourceTransactionId === valores.id
          );
          if (valores.repeat && valores.type === 'expense') {
            const conta = {
              id: vinculada?.id ?? criarIdFinancas(),
              name: valores.name,
              amount: valores.amount,
              date: valores.date,
              repeat: true,
              icon: 'Receipt',
              categoryId: valores.categoryId,
              sourceTransactionId: valores.id,
            };
            proximo = salvarRegistroFinancas(proximo, 'bills', conta);
            if (!vinculada) {
              proximo.payments = [
                ...proximo.payments,
                {
                  billId: conta.id,
                  month: chaveMes(valores.date),
                  transactionId: valores.id,
                },
              ];
            }
          } else if (vinculada) {
            proximo = {
              ...proximo,
              bills: proximo.bills.filter(conta => conta.id !== vinculada.id),
              payments: proximo.payments.filter(
                pagamento => pagamento.billId !== vinculada.id
              ),
            };
          }
        }
        return proximo;
      });
    }
    if (tipoFormulario === 'transaction') setMes(chaveMes(valores.date));
    fecharFormulario();
    setAviso('Salvo! Seu planejamento foi atualizado.');
  }

  function remover(tipoItem, item) {
    setDados(anterior => {
      const proximo = {
        ...anterior,
        example: false,
        [colecoesFinancas[tipoItem]]: anterior[
          colecoesFinancas[tipoItem]
        ].filter(entrada => entrada.id !== item.id),
      };
      if (tipoItem === 'transaction') {
        proximo.payments = anterior.payments.filter(
          pagamento => pagamento.transactionId !== item.id
        );
      }
      if (tipoItem === 'bill') {
        proximo.payments = anterior.payments.filter(
          pagamento => pagamento.billId !== item.id
        );
      }
      return proximo;
    });
    setDialogo(null);
    setAviso('Registro excluído.');
  }

  function exportarCsv() {
    const citar = valor =>
      '"' +
      String(valor)
        .replaceAll('"', '""')
        .replace(/^[=+@-]/, "'$&") +
      '"';
    const linhas = [
      ['Descrição', 'Tipo', 'Valor (R$)', 'Data', 'Categoria'],
      ...itensMes.map(item => [
        item.name,
        item.type === 'income' ? 'Entrada' : 'Saída',
        formatarDecimal(item.amount),
        item.date,
        dados.categories.find(cat => cat.id === item.categoryId)?.name ?? '',
      ]),
    ];
    exportarArquivoFinancas(
      'financas-' + mes + '.csv',
      '\uFEFF' + linhas.map(linha => linha.map(citar).join(';')).join('\r\n'),
      'text/csv;charset=utf-8'
    );
    setAviso('Relatório exportado.');
  }

  function exportarAgenda() {
    const escapar = texto =>
      texto
        .replaceAll('\\', '\\\\')
        .replaceAll(';', '\\;')
        .replaceAll(',', '\\,')
        .replace(/\r?\n/g, '\\n');
    const eventos = dados.bills
      .filter(conta =>
        conta.repeat
          ? conta.date.slice(0, 7) <= mes
          : conta.date.startsWith(mes)
      )
      .map(conta =>
        [
          'BEGIN:VEVENT',
          'UID:' + conta.id + '-' + mes + '@iagora.local',
          'DTSTAMP:' +
            new Date()
              .toISOString()
              .replace(/[-:]/g, '')
              .replace(/\.\d{3}/, ''),
          'DTSTART;VALUE=DATE:' + vencimentoConta(conta, mes).replaceAll('-', ''),
          'SUMMARY:' + escapar(conta.name),
          'DESCRIPTION:' +
            escapar('Vencimento: ' + formatarMoeda(conta.amount)),
          'END:VEVENT',
        ].join('\r\n')
      );
    exportarArquivoFinancas(
      'vencimentos-' + mes + '.ics',
      [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Iagora//Financas//PT-BR',
        ...eventos,
        'END:VCALENDAR',
      ].join('\r\n'),
      'text/calendar;charset=utf-8'
    );
    setAviso('Arquivo de vencimentos exportado para importar na sua agenda.');
  }

  const abrirDetalhe = (tipoItem, item) =>
    setDialogo({ tipoDialogo: 'detalhe', tipo: tipoItem, item });

  const contasPendentes = dados.bills.filter(
    conta =>
      (conta.repeat
        ? conta.date.slice(0, 7) <= mes
        : conta.date.startsWith(mes)) &&
      statusConta(conta, mes, dados.payments) !== 'paga'
  ).length;

  return (
    <div lang='pt-BR' className={'min-w-0 flex-1 bg-white ' + classePagina}>
      <main className='min-w-0'>
        <Container classe='pt-6 pb-8 sm:pt-9'>
          {erroArmazenamento && (
            <div
              role='alert'
              className='mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950'
            >
              <p>{erroArmazenamento}</p>
              {!permitirSalvar && (
                <button
                  type='button'
                  className='mt-2 min-h-11 font-bold underline'
                  onClick={() => setDialogo({ tipoDialogo: 'reiniciar' })}
                >
                  Iniciar novos dados neste navegador
                </button>
              )}
            </div>
          )}
          {tipoFormulario ? (
            idEdicao && !registro && tipoFormulario !== 'budget' ? (
              <PainelFinancas titulo='Registro não encontrado'>
                <p className='mb-4 text-(--texto-apoio)'>
                  Este registro pode ter sido excluído.
                </p>
                <AcaoFinancas onClick={fecharFormulario}>Voltar</AcaoFinancas>
              </PainelFinancas>
            ) : (
              <FormularioFinancas
                key={tipoFormulario + ':' + (registro?.id ?? 'novo')}
                tipo={tipoFormulario}
                registro={registro}
                dados={dados}
                saldo={
                  calcularTotais(
                    dados.transactions.filter(item =>
                      item.date.startsWith(
                        registro?.date?.slice(0, 7) ?? chaveMes()
                      )
                    )
                  ).saldo
                }
                aoSalvar={salvar}
                aoVoltar={fecharFormulario}
              />
            )
          ) : (
            <>
              <div className='flex flex-col justify-between gap-6 lg:flex-row lg:items-center'>
                <div className='min-w-0 flex-1'>
                  <span className='inline-block rotate-[1.4deg] bg-(--laranja-principal) px-3 py-1.5 text-xs font-bold text-white'>
                    {visao === 'geral'
                      ? 'SEU DINHEIRO EM PERSPECTIVA'
                      : 'FINANÇAS'}
                  </span>
                  <Titulo
                    como='h1'
                    classe='mt-3 grid text-4xl leading-[1.08] font-extrabold tracking-tight sm:text-5xl'
                  >
                    {Object.entries(visoesFinancas).map(([chave, textos]) => (
                      <span
                        key={chave}
                        aria-hidden={visao !== chave}
                        className={
                          'col-start-1 row-start-1 ' +
                          (visao === chave ? '' : 'invisible')
                        }
                      >
                        {textos[0]}
                      </span>
                    ))}
                  </Titulo>
                  <p className='mt-3 grid text-base text-(--texto-apoio) sm:text-lg'>
                    {Object.entries(visoesFinancas).map(([chave, textos]) => (
                      <span
                        key={chave}
                        aria-hidden={visao !== chave}
                        className={
                          'col-start-1 row-start-1 ' +
                          (visao === chave ? '' : 'invisible')
                        }
                      >
                        {textos[1]}
                      </span>
                    ))}
                  </p>
                </div>
                <div className='flex min-h-[6.75rem] flex-wrap content-start items-center gap-3 sm:min-h-12 lg:w-[27rem] lg:shrink-0'>
                  {!['metas', 'configuracoes', 'orcamento'].includes(visao) && (
                    <label className='flex min-h-12 min-w-0 items-center gap-2 rounded-lg border border-[#d9e2ec] px-3 text-sm font-bold'>
                      <span className='sr-only'>Mês de referência</span>
                      <input
                        type='month'
                        aria-label='Mês de referência'
                        value={mes}
                        onChange={evento => {
                          if (/^\d{4}-\d{2}$/.test(evento.target.value)) {
                            setMes(evento.target.value);
                          }
                        }}
                        className='max-w-full bg-transparent py-2'
                      />
                    </label>
                  )}
                  {visao !== 'configuracoes' && visao !== 'relatorios' && (
                    <AcaoFinancas onClick={() => abrirFormulario(tipoPrincipal)}>
                      + {rotuloPrincipal}
                    </AcaoFinancas>
                  )}
                  {visao === 'relatorios' && (
                    <AcaoFinancas onClick={exportarCsv}>
                      Exportar CSV
                    </AcaoFinancas>
                  )}
                </div>
              </div>
              <div className='mt-7 flex flex-wrap items-end gap-x-4 gap-y-3 border-b border-[#e6edf2]'>
                <nav
                  aria-label='Áreas de finanças'
                  className='flex min-w-0 max-w-full gap-5 overflow-x-auto sm:gap-8'
                >
                  {abasFinancas.map(([chave, rotulo]) => (
                    <button
                      type='button'
                      key={chave}
                      onClick={() => navegar(chave)}
                      aria-current={visao === chave ? 'page' : undefined}
                      className={
                        'min-h-13 shrink-0 border-b-[3px] px-1 py-4 text-sm ' +
                        (visao === chave
                          ? 'border-(--laranja-principal) font-bold text-(--laranja-principal)'
                          : 'border-transparent text-(--texto-apoio) hover:text-(--laranja-principal)')
                      }
                    >
                      {rotulo}
                    </button>
                  ))}
                </nav>
                <details
                  ref={refFerramentas}
                  className='relative mb-1 ml-auto'
                  onKeyDown={evento => {
                    if (evento.key === 'Escape') {
                      evento.currentTarget.open = false;
                      evento.currentTarget.querySelector('summary')?.focus();
                    }
                  }}
                >
                  <summary className='flex min-h-11 list-none items-center gap-2 rounded-lg px-3 text-sm font-bold hover:bg-(--azul-fundo)'>
                    Ferramentas <span aria-hidden='true'>⌄</span>
                  </summary>
                  <div className='absolute right-0 z-20 mt-2 w-60 rounded-xl border border-[#d9e4ec] bg-white p-2 shadow-lg'>
                    {[
                      ['contas', 'Contas e boletos'],
                      ['orcamento', 'Meu orçamento'],
                      ['relatorios', 'Relatórios'],
                      ['configuracoes', 'Configurações'],
                    ].map(([chave, rotulo]) => (
                      <button
                        type='button'
                        key={chave}
                        onClick={() => navegar(chave)}
                        className='flex min-h-11 w-full items-center rounded-lg px-3 text-left text-sm hover:bg-(--azul-fundo)'
                      >
                        {rotulo}
                        {chave === 'contas' && contasPendentes > 0 && (
                          <span className='ml-auto rounded-full bg-(--laranja-fundo) px-2 text-xs text-(--laranja-principal)'>
                            {contasPendentes}
                          </span>
                        )}
                      </button>
                    ))}
                    {dados.example && (
                      <button
                        type='button'
                        onClick={() => {
                          refFerramentas.current.open = false;
                          setDialogo({ tipoDialogo: 'reiniciar' });
                        }}
                        className='min-h-11 w-full rounded-lg px-3 text-left text-sm hover:bg-(--azul-fundo)'
                      >
                        Começar sem exemplos
                      </button>
                    )}
                  </div>
                </details>
                <p className='mb-4 flex items-center gap-2 text-xs text-(--texto-apoio)'>
                  <span className='relative inline-flex size-4 shrink-0 items-center justify-center'>
                    <IconeFinancas nome='DadosExemplo' classe='size-4' />
                    <span
                      aria-hidden='true'
                      className='absolute text-[10px] font-bold text-(--laranja-principal)'
                    >
                      i
                    </span>
                  </span>
                  {dados.example
                    ? 'Dados de exemplo'
                    : 'Salvo neste navegador'}
                </p>
              </div>
              <div className='min-w-0'>
                <PainelVisaoFinancas ativo={visao === 'geral'} semRecuo>
                  <>
                    <ResumoFinancas lancamentos={itensMes} />
                    <div className='grid gap-6 lg:grid-cols-2'>
                      <GraficoCategorias
                        dados={dados}
                        lancamentos={itensMes}
                      />
                      <PainelFinancas
                        titulo='Últimos lançamentos'
                        acao={
                          <button
                            type='button'
                            className='min-h-11 text-sm font-bold text-(--laranja-principal)'
                            onClick={() => navegar('lancamentos')}
                          >
                            Ver todos
                          </button>
                        }
                      >
                        <LinhasLancamentos
                          itens={itensMes.slice(-4)}
                          categorias={dados.categories}
                          compacto
                          aoAbrir={item => abrirDetalhe('transaction', item)}
                          aoCriar={() => abrirFormulario('transaction')}
                        />
                      </PainelFinancas>
                    </div>
                    <div className='mt-6 space-y-3'>
                      {dados.preferences.reminders && contasPendentes > 0 && (
                        <button
                          type='button'
                          onClick={() => navegar('contas')}
                          className='flex min-h-12 w-full flex-wrap items-center justify-between gap-2 rounded-lg bg-(--laranja-fundo) px-4 py-3 text-left text-sm'
                        >
                          <span>
                            {contasPendentes} conta(s) para acompanhar neste mês.
                          </span>
                          <strong className='text-(--laranja-principal)'>
                            Ver contas
                          </strong>
                        </button>
                      )}
                      {dados.preferences.summary && (
                        <p className='rounded-lg bg-(--azul-fundo) p-4 text-sm'>
                          Resumo do mês: {itensMes.length} lançamento(s),{' '}
                          {formatarMoeda(resultado.entradas)} em entradas e{' '}
                          {formatarMoeda(resultado.saidas)} em saídas.
                        </p>
                      )}
                      {dados.preferences.limits &&
                        dados.categories
                          .filter(
                            cat =>
                              cat.limit > 0 &&
                              itensMes
                                .filter(
                                  item =>
                                    item.categoryId === cat.id &&
                                    item.type === 'expense'
                                )
                                .reduce((soma, item) => soma + item.amount, 0) >=
                                cat.limit * 0.8
                          )
                          .map(cat => (
                            <button
                              type='button'
                              key={cat.id}
                              onClick={() => navegar('categorias')}
                              className='block min-h-12 w-full rounded-lg bg-amber-50 p-4 text-left text-sm'
                            >
                              {cat.name} chegou a 80% ou mais do limite.{' '}
                              <strong>Revisar categoria</strong>
                            </button>
                          ))}
                    </div>
                  </>
                </PainelVisaoFinancas>
                <PainelVisaoFinancas ativo={visao === 'lancamentos'}>
                  <ListaLancamentos
                    itens={itensMes}
                    categorias={dados.categories}
                    aoAbrir={item => abrirDetalhe('transaction', item)}
                    aoCriar={() => abrirFormulario('transaction')}
                  />
                </PainelVisaoFinancas>
                <PainelVisaoFinancas ativo={visao === 'categorias'}>
                  <ListaCategorias
                    dados={dados}
                    lancamentos={itensMes}
                    aoAbrir={item => abrirFormulario('category', item)}
                  />
                </PainelVisaoFinancas>
                <PainelVisaoFinancas ativo={visao === 'metas'}>
                  <ListaMetas
                    dados={dados}
                    aoAbrir={item => abrirDetalhe('goal', item)}
                    aoCriar={() => abrirFormulario('goal')}
                  />
                </PainelVisaoFinancas>
                <PainelVisaoFinancas ativo={visao === 'contas'}>
                  <ListaContas
                    dados={dados}
                    mes={mes}
                    aoAbrir={item => abrirDetalhe('bill', item)}
                    aoCriar={() => abrirFormulario('bill')}
                  />
                </PainelVisaoFinancas>
                <PainelVisaoFinancas ativo={visao === 'relatorios'}>
                  <RelatoriosFinancas dados={dados} mes={mes} />
                </PainelVisaoFinancas>
                <PainelVisaoFinancas ativo={visao === 'orcamento'}>
                  <VisaoOrcamento
                    orcamento={dados.budget}
                    aoEditar={() => abrirFormulario('budget')}
                  />
                </PainelVisaoFinancas>
                <PainelVisaoFinancas ativo={visao === 'configuracoes'}>
                  <PainelFinancas titulo='Suas finanças, do seu jeito'>
                    <div className='divide-y divide-[#e6edf2]'>
                      {[
                        [
                          'reminders',
                          'Lembrar vencimentos',
                          'Exibir avisos de contas pendentes nesta página.',
                        ],
                        [
                          'limits',
                          'Avisar ao chegar perto do limite',
                          'Exibir categorias que alcançaram 80% do limite mensal.',
                        ],
                        [
                          'summary',
                          'Resumo mensal',
                          'Exibir um resumo ao abrir a visão geral.',
                        ],
                      ].map(([chave, rotulo, descricao]) => (
                        <label
                          key={chave}
                          className='flex min-h-24 items-center justify-between gap-5 py-5'
                        >
                          <span>
                            <strong className='block'>{rotulo}</strong>
                            <span className='mt-1 block text-sm text-(--texto-apoio)'>
                              {descricao}
                            </span>
                          </span>
                          <input
                            type='checkbox'
                            role='switch'
                            checked={Boolean(dados.preferences[chave])}
                            onChange={evento =>
                              setDados(anterior => ({
                                ...anterior,
                                preferences: {
                                  ...anterior.preferences,
                                  [chave]: evento.target.checked,
                                },
                              }))
                            }
                            className='size-6 shrink-0 accent-(--laranja-principal)'
                          />
                        </label>
                      ))}
                      <button
                        type='button'
                        onClick={exportarAgenda}
                        className='flex min-h-24 w-full items-center gap-4 py-5 text-left'
                      >
                        <IconeFinancas nome='Calendar' classe='size-6' />
                        <span>
                          <strong className='block'>
                            Exportar vencimentos para a agenda
                          </strong>
                          <span className='mt-1 block text-sm text-(--texto-apoio)'>
                            Baixe o arquivo do mês e importe no Google Agenda.
                          </span>
                        </span>

                      </button>
                      <button
                        type='button'
                        onClick={() => setDialogo({ tipoDialogo: 'banco' })}
                        className='flex min-h-24 w-full items-center gap-4 py-5 text-left'
                      >
                        <IconeFinancas nome='Building' classe='size-6' />
                        <span>
                          <strong className='block'>Integração bancária</strong>
                          <span className='mt-1 block text-sm text-(--texto-apoio)'>
                            Saiba mais sobre as conexões opcionais.
                          </span>
                        </span>

                      </button>
                    </div>
                  </PainelFinancas>
                </PainelVisaoFinancas>
              </div>
              <AssistenteFinancas />
            </>
          )}
        </Container>
        {!tipoFormulario && (
          <section className='bg-(--laranja-principal) py-10 text-white sm:py-14'>
            <Container classe='flex flex-col items-start justify-between gap-7 lg:flex-row lg:items-center'>
              <div>
                <p className='text-xs font-bold tracking-[0.08em]'>
                  QUE TAL MONTAR SEU ORÇAMENTO?
                </p>
                <Titulo classe='mt-4 max-w-2xl text-3xl leading-tight font-extrabold text-white! sm:text-[clamp(2rem,3.5vw,3rem)]'>
                  Bora fazer seu dinheiro
                  <br className='hidden sm:block' /> render melhor?
                </Titulo>
                <p className='mt-4'>
                  Organize suas contas e descubra seus próximos passos.
                </p>
              </div>
              <div className='flex flex-wrap items-center gap-6'>
                <AcaoFinancas
                  onClick={() => abrirFormulario('budget')}
                  marinho
                  classe='px-8'
                >
                  Montar meu orçamento
                </AcaoFinancas>
                <span className='relative inline-flex h-20 w-20 shrink-0 items-center justify-center'>
                  <IconeFinancas nome='MoedaEconomia' />
                  <strong className='absolute -rotate-12 font-titulo text-xl font-extrabold text-(--azul-titulo)'>
                    R$
                  </strong>
                </span>
              </div>
            </Container>
          </section>
        )}
      </main>
      <Rodape />
      {aviso && (
        <div
          role='status'
          className='fixed right-4 bottom-4 left-4 z-40 flex items-center justify-between gap-3 rounded-xl bg-(--azul-titulo) p-4 text-sm text-white shadow-lg sm:left-auto sm:max-w-md'
        >
          <span>{aviso}</span>
          <button
            type='button'
            onClick={() => setAviso('')}
            aria-label='Fechar aviso'
            className='size-11 shrink-0 text-xl'
          >
            ×
          </button>
        </div>
      )}
      {dialogo && (
        <DialogoFinancas
          titulo={
            dialogo.tipoDialogo === 'excluir'
              ? 'Excluir registro?'
              : dialogo.tipoDialogo === 'banco'
                ? 'Integração bancária'
                : dialogo.tipoDialogo === 'reiniciar'
                  ? 'Iniciar novos dados?'
                  : (dialogo.item?.name ?? 'Detalhes')
          }
          aoFechar={() => setDialogo(null)}
        >
          {dialogo.tipoDialogo === 'excluir' ? (
            <>
              <p className='mb-6 text-(--texto-apoio)'>
                Deseja excluir “{dialogo.item.name}”? Esta ação não pode ser
                desfeita.
                {dialogo.tipo === 'bill'
                  ? ' Os pagamentos já registrados serão mantidos nos lançamentos.'
                  : ''}
              </p>
              <div className='flex flex-wrap gap-3'>
                <AcaoFinancas
                  onClick={() => remover(dialogo.tipo, dialogo.item)}
                >
                  Excluir
                </AcaoFinancas>
                <AcaoFinancas
                  secundario
                  onClick={() =>
                    setDialogo({ ...dialogo, tipoDialogo: 'detalhe' })
                  }
                >
                  Cancelar
                </AcaoFinancas>
              </div>
            </>
          ) : dialogo.tipoDialogo === 'banco' ? (
            <>
              <p className='mb-6 leading-relaxed text-(--texto-apoio)'>
                A conexão com bancos ainda não está disponível. Você pode
                registrar entradas e saídas manualmente e acompanhar seu
                planejamento.
              </p>
              <AcaoFinancas
                onClick={() => {
                  setDialogo(null);
                  abrirFormulario('transaction');
                }}
              >
                Adicionar lançamento
              </AcaoFinancas>
            </>
          ) : dialogo.tipoDialogo === 'reiniciar' ? (
            <>
              <p className='mb-6 text-(--texto-apoio)'>
                Os registros atuais serão substituídos por um planejamento
                vazio. Deseja continuar?
              </p>
              <div className='flex flex-wrap gap-3'>
                <AcaoFinancas
                  onClick={() => {
                    setDados(anterior => ({
                      ...anterior,
                      example: false,
                      transactions: [],
                      bills: [],
                      goals: [],
                      payments: [],
                      budget: null,
                    }));
                    setPermitirSalvar(true);
                    setErroArmazenamento('');
                    setDialogo(null);
                  }}
                >
                  Iniciar planejamento
                </AcaoFinancas>
                <AcaoFinancas secundario onClick={() => setDialogo(null)}>
                  Cancelar
                </AcaoFinancas>
              </div>
            </>
          ) : (
            <DetalheFinancas
              dialogo={dialogo}
              dados={dados}
              mes={mes}
              aoEditar={() => abrirFormulario(dialogo.tipo, dialogo.item)}
              aoExcluir={() =>
                setDialogo({ ...dialogo, tipoDialogo: 'excluir' })
              }
              aoPagar={() => {
                setDados(anterior =>
                  registrarPagamentoConta(anterior, dialogo.item, mes)
                );
                setDialogo(null);
                setAviso(
                  'Conta paga! A saída foi adicionada aos lançamentos.'
                );
              }}
              aoDepositar={valor => {
                setDados(anterior => ({
                  ...anterior,
                  example: false,
                  goals: anterior.goals.map(meta =>
                    meta.id === dialogo.item.id
                      ? { ...meta, saved: meta.saved + valor }
                      : meta
                  ),
                }));
                setDialogo(null);
                setAviso('Meta atualizada!');
              }}
            />
          )}
        </DialogoFinancas>
      )}
    </div>
  );
}
