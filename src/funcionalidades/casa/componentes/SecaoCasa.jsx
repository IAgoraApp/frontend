import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Container, Titulo } from '../../../compartilhado/interface/indice';
import Rodape from '../../../compartilhado/Rodape';
import {
  CHAVE_CASA,
  concluirManutencao,
  lerEstadoCasa,
  visoesCasa,
} from '../conteudo';
import {
  chaveMes,
  dataCurta,
  formatarMoeda,
  lerEstadoFinancas,
  statusConta,
  vencimentoConta,
} from '../../financas/conteudo';
import { BotaoCasa, CartaoCasa, DialogoCasa } from './InterfaceCasa';
import VisaoCasaHub from './VisaoCasaHub';
import FormularioResidencia from './FormularioResidencia';
import FormularioManutencao from './FormularioManutencao';
import fotoResidencia from '../../../ativos/imagens/fotografias/residencia-minha.png';

export default function SecaoCasa() {
  const [carregado] = useState(lerEstadoCasa);
  const [dados, setDados] = useState(carregado.dados);
  const [erroArmazenamento, setErroArmazenamento] = useState(
    carregado.erro
      ? 'Não foi possível carregar sua casa. Os dados anteriores foram preservados; esta é uma prévia de exemplo.'
      : ''
  );
  const [parametros, definirParametros] = useSearchParams();
  const solicitada = parametros.get('visao');
  const visao = Object.hasOwn(visoesCasa, solicitada) ? solicitada : 'hub';
  const [dialogo, setDialogo] = useState(null);
  const [aviso, setAviso] = useState('');
  const [filtro, setFiltro] = useState('pendentes');
  const [busca, setBusca] = useState('');
  const [servico, setServico] = useState(() =>
    parametros.get('categoria') === 'limpeza' ? 'Limpeza' : 'Manutenção'
  );
  const [mes, setMes] = useState(chaveMes);

  const ehFormulario = visao === 'cadastrar' || visao === 'editar';
  const financas = lerEstadoFinancas();
  const categoriasCasa = financas.dados.categories
    .filter(cat => /moradia|habita|contas/i.test(cat.name))
    .map(cat => cat.id);
  const despesas = financas.dados.transactions.filter(
    item =>
      item.type === 'expense' &&
      categoriasCasa.includes(item.categoryId) &&
      item.date.startsWith(mes)
  );
  const totalDespesas = despesas.reduce((soma, item) => soma + item.amount, 0);
  const contas = financas.dados.bills.filter(
    conta =>
      (conta.repeat
        ? conta.date.slice(0, 7) <= mes
        : conta.date.startsWith(mes)) &&
      statusConta(conta, mes, financas.dados.payments) !== 'paga'
  );
  const pendentes = dados.maintenance.filter(item => !item.completedAt);
  const historico = visao === 'historico' || filtro === 'concluidas';
  const registros = dados.maintenance
    .filter(
      item =>
        (historico ? Boolean(item.completedAt) : !item.completedAt) &&
        item.title
          .toLocaleLowerCase('pt-BR')
          .includes(busca.toLocaleLowerCase('pt-BR'))
    )
    .sort((a, b) =>
      historico
        ? b.completedAt.localeCompare(a.completedAt)
        : a.date.localeCompare(b.date)
    );

  useEffect(() => {
    if (carregado.erro) return;
    try {
      localStorage.setItem(CHAVE_CASA, JSON.stringify(dados));
    } catch {
      const temporizador = setTimeout(
        () =>
          setErroArmazenamento(
            'Não foi possível salvar no navegador. As alterações ficam disponíveis nesta sessão.'
          ),
        0
      );
      return () => clearTimeout(temporizador);
    }
  }, [dados, carregado.erro]);

  useEffect(() => {
    if (!aviso) return;
    const temporizador = setTimeout(() => setAviso(''), 5000);
    return () => clearTimeout(temporizador);
  }, [aviso]);

  useEffect(() => {
    if (ehFormulario) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [ehFormulario]);

  function navegar(proxima) {
    definirParametros(
      anterior => {
        const atualizado = new URLSearchParams(anterior);
        if (proxima === 'hub') atualizado.delete('visao');
        else atualizado.set('visao', proxima);
        return atualizado;
      },
      { preventScrollReset: true }
    );
    setDialogo(null);
  }

  function salvarManutencao(item) {
    setDados(anterior => ({
      ...anterior,
      example: false,
      maintenance: anterior.maintenance.some(entrada => entrada.id === item.id)
        ? anterior.maintenance.map(entrada =>
            entrada.id === item.id ? item : entrada
          )
        : [...anterior.maintenance, item],
    }));
    setDialogo(null);
    setAviso('Manutenção salva.');
  }

  function alternarMarcacao(chave, valor) {
    setDados(anterior => ({
      ...anterior,
      checks: { ...anterior.checks, [chave]: valor },
    }));
  }

  const abrirManutencao = item => setDialogo({ tipo: 'detalhe', item });

  const irParaManutencoes = () => {
    setFiltro('pendentes');
    setBusca('');
    navegar('manutencoes');
  };

  return (
    <div
      lang='pt-BR'
      className='min-w-0 flex-1 bg-white font-corpo leading-normal text-(--azul-titulo) wrap-anywhere [overflow-anchor:none] [&_:is(button,summary)]:cursor-pointer [&_:is(a,button,input,select,textarea):focus-visible]:outline-2 [&_:is(a,button,input,select,textarea):focus-visible]:outline-offset-3 [&_:is(a,button,input,select,textarea):focus-visible]:outline-(--laranja-principal)'
    >
      <main>
        <Container classe='pt-4'>
          {erroArmazenamento && (
            <p
              role='alert'
              className='mb-4 rounded-lg bg-amber-50 p-4 text-sm text-amber-900'
            >
              {erroArmazenamento}
            </p>
          )}
        </Container>
        {visao === 'hub' ? (
          <VisaoCasaHub
            aoNavegar={navegar}
            marcacoes={dados.checks}
            aoMarcar={alternarMarcacao}
          />
        ) : (
          <Container classe='py-7 sm:py-9'>
            <button
              type='button'
              onClick={() => navegar(ehFormulario ? 'residencia' : 'hub')}
              className='mb-4 min-h-11 text-sm font-bold text-(--texto-apoio)'
            >
 Voltar
            </button>
            <div className='mb-7'>
              <span className='inline-block rotate-[1.4deg] bg-(--laranja-principal) px-3 py-1.5 text-xs font-bold text-white'>
                MINHA CASA
              </span>
              <Titulo
                como='h1'
                classe='mt-4 text-3xl leading-tight font-extrabold sm:text-4xl lg:text-5xl'
              >
                {visoesCasa[visao][0]}
              </Titulo>
              <p className='mt-3 max-w-3xl text-(--texto-apoio)'>
                {visoesCasa[visao][1]}
              </p>
              {dados.example && !ehFormulario && (
                <p className='mt-3 text-xs text-(--texto-apoio)'>
                  Dados de exemplo da residência e das manutenções. Edite para
                  personalizar.
                </p>
              )}
            </div>
            {ehFormulario && (
              <FormularioResidencia
                key={visao}
                residencia={visao === 'editar' ? dados.residence : null}
                aoCancelar={() => navegar('residencia')}
                aoSalvar={residencia => {
                  setDados(anterior => ({
                    ...anterior,
                    example: false,
                    residence: residencia,
                  }));
                  navegar('residencia');
                  setAviso('Sua casa foi salva.');
                }}
              />
            )}
            {visao === 'residencia' &&
              (dados.residence ? (
                <div className='space-y-6'>
                  <CartaoCasa>
                    <div className='grid items-center gap-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]'>
                      <img
                        src={fotoResidencia}
                        alt='Ambiente ilustrativo de uma residência'
                        className='aspect-[1.65] w-full rounded-lg object-cover'
                      />
                      <div>
                        <p className='text-xs text-(--texto-apoio)'>
                          Imagem ilustrativa
                        </p>
                        <Titulo classe='mt-2 text-3xl font-extrabold'>
                          {dados.residence.name}
                        </Titulo>
                        <p className='mt-3 text-(--texto-apoio)'>
                          {dados.residence.type} · {dados.residence.location}
                        </p>
                        <p className='mt-2 text-sm'>
                          {dados.residence.rooms.join(' · ')}
                        </p>
                        <div className='mt-5 flex flex-wrap gap-3'>
                          <BotaoCasa
                            secundario
                            onClick={() => navegar('editar')}
                          >
                            Editar minha casa
                          </BotaoCasa>
                          <button
                            type='button'
                            onClick={() => setDialogo({ tipo: 'remover' })}
                            className='min-h-12 px-4 text-sm font-bold text-[#b42318]'
                          >
                            Remover residência
                          </button>
                        </div>
                      </div>
                    </div>
                  </CartaoCasa>
                  <div className='grid gap-4 sm:grid-cols-3'>
                    {[
                      ['Cômodos', dados.residence.rooms.length],
                      ['Manutenções pendentes', pendentes.length],
                      ['Despesas da casa / mês', formatarMoeda(totalDespesas)],
                    ].map(([rotulo, valor]) => (
                      <CartaoCasa key={rotulo}>
                        <p className='text-sm text-(--texto-apoio)'>{rotulo}</p>
                        <p className='mt-3 font-titulo text-3xl font-extrabold'>
                          {valor}
                        </p>
                      </CartaoCasa>
                    ))}
                  </div>
                  <div className='flex flex-wrap gap-3'>
                    <BotaoCasa onClick={irParaManutencoes}>
                      Manutenções
                    </BotaoCasa>
                    <BotaoCasa secundario onClick={() => navegar('despesas')}>
                      Despesas do imóvel
                    </BotaoCasa>
                    <BotaoCasa secundario como={Link} to='/limpeza'>
                      Cuidar da limpeza
                    </BotaoCasa>
                    <BotaoCasa secundario como={Link} to='/rotina'>
                      Ver minha rotina
                    </BotaoCasa>
                  </div>
                </div>
              ) : (
                <CartaoCasa titulo='Seu canto começa aqui'>
                  <p className='mb-5 text-(--texto-apoio)'>
                    Cadastre sua residência para organizar seus cômodos e
                    cuidados.
                  </p>
                  <BotaoCasa onClick={() => navegar('cadastrar')}>
                    Cadastrar residência
                  </BotaoCasa>
                </CartaoCasa>
              ))}
            {(visao === 'manutencoes' || visao === 'historico') && (
              <div className='space-y-5'>
                <div className='flex flex-wrap items-center justify-between gap-4'>
                  <div
                    className='flex flex-wrap gap-2'
                    role='group'
                    aria-label='Status da manutenção'
                  >
                    {[
                      ['pendentes', 'Pendentes'],
                      ['concluidas', 'Concluídas'],
                    ].map(([chave, rotulo]) => (
                      <BotaoCasa
                        key={chave}
                        secundario={
                          (historico ? 'concluidas' : 'pendentes') !== chave
                        }
                        aria-pressed={
                          (historico ? 'concluidas' : 'pendentes') === chave
                        }
                        onClick={() => {
                          setFiltro(chave);
                          if (visao === 'historico') navegar('manutencoes');
                        }}
                      >
                        {rotulo}
                      </BotaoCasa>
                    ))}
                  </div>
                  <BotaoCasa onClick={() => setDialogo({ tipo: 'formulario' })}>
                    + Nova manutenção
                  </BotaoCasa>
                </div>
                <CartaoCasa>
                  <input
                    type='search'
                    aria-label='Buscar manutenção'
                    placeholder='Buscar manutenção...'
                    value={busca}
                    onChange={evento => setBusca(evento.target.value)}
                    className='mb-5 min-h-12 w-full rounded-lg border border-[#dbe5ed] px-4'
                  />
                  {registros.length ? (
                    <ul className='divide-y divide-[#e6edf2]'>
                      {registros.map(item => (
                        <li key={item.id}>
                          <button
                            type='button'
                            onClick={() => abrirManutencao(item)}
                            className='flex min-h-24 w-full items-center justify-between gap-4 rounded-lg py-4 text-left hover:bg-(--azul-fundo)'
                          >
                            <span className='min-w-0'>
                              <strong className='block'>{item.title}</strong>
                              <span className='mt-2 block text-sm text-(--texto-apoio)'>
                                {item.room} · {dataCurta(item.date)}
                                {item.frequency === 'monthly'
                                  ? ' · Mensal'
                                  : ''}
                              </span>
                              {item.completedAt && (
                                <span className='mt-1 block text-xs text-[#18794e]'>
                                  Concluída em{' '}
                                  {new Date(
                                    item.completedAt
                                  ).toLocaleDateString('pt-BR')}
                                </span>
                              )}
                            </span>
                            <span
                              className={
                                'shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ' +
                                (item.completedAt
                                  ? 'bg-[#ecfdf3] text-[#18794e]'
                                  : item.priority === 'Alta'
                                    ? 'bg-[#fef3f2] text-[#b42318]'
                                    : 'bg-(--azul-fundo) text-(--texto-apoio)')
                              }
                            >
                              {item.completedAt ? 'Concluída' : item.priority}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p
                      role='status'
                      className='py-10 text-center text-(--texto-apoio)'
                    >
                      {historico
                        ? 'Nenhuma manutenção concluída encontrada.'
                        : 'Nenhuma manutenção pendente encontrada.'}
                    </p>
                  )}
                </CartaoCasa>
                <div className='flex flex-wrap gap-3'>
                  <BotaoCasa secundario onClick={() => navegar('historico')}>
                    Ver histórico
                  </BotaoCasa>
                  <BotaoCasa secundario onClick={() => navegar('servicos')}>
                    Encontrar uma empresa
                  </BotaoCasa>
                </div>
              </div>
            )}
            {visao === 'despesas' && (
              <div className='space-y-5'>
                {financas.erro && (
                  <p
                    role='alert'
                    className='rounded-lg bg-amber-50 p-4 text-sm'
                  >
                    Não foi possível ler suas finanças. Abra Finanças para
                    revisar os dados; os valores abaixo são demonstrativos.
                  </p>
                )}
                <div className='flex flex-wrap items-center justify-between gap-4'>
                  <label className='text-sm font-bold' htmlFor='casa-mes'>
                    Mês de referência{' '}
                    <input
                      id='casa-mes'
                      type='month'
                      value={mes}
                      onChange={evento => {
                        if (evento.target.value) setMes(evento.target.value);
                      }}
                      className='ml-2 min-h-12 max-w-full rounded-lg border border-[#dbe5ed] px-3'
                    />
                  </label>
                  <div className='flex flex-wrap gap-3'>
                    <BotaoCasa
                      como={Link}
                      to='/financas?visao=lancamentos&acao=transaction'
                    >
                      + Registrar despesa
                    </BotaoCasa>
                    <BotaoCasa secundario como={Link} to='/financas'>
                      Abrir Finanças
                    </BotaoCasa>
                  </div>
                </div>
                <div className='grid gap-4 sm:grid-cols-3'>
                  {[
                    ['Registrado no mês', formatarMoeda(totalDespesas)],
                    ['Contas a acompanhar', contas.length],
                    ['Categorias', 'Moradia e contas'],
                  ].map(([rotulo, valor]) => (
                    <CartaoCasa key={rotulo}>
                      <p className='text-sm text-(--texto-apoio)'>{rotulo}</p>
                      <p className='mt-3 font-titulo text-2xl font-extrabold'>
                        {valor}
                      </p>
                    </CartaoCasa>
                  ))}
                </div>
                <CartaoCasa titulo='Despesas da casa'>
                  <p className='mb-4 text-xs text-(--texto-apoio)'>
                    {financas.dados.example
                      ? 'Dados de exemplo de Finanças.'
                      : 'Registros de Finanças deste navegador.'}{' '}
                    Categorias de moradia e contas.
                  </p>
                  {despesas.length ? (
                    <ul className='divide-y divide-[#e6edf2]'>
                      {despesas.map(item => (
                        <li
                          key={item.id}
                          className='flex flex-wrap justify-between gap-3 py-4'
                        >
                          <span>
                            {item.name}
                            <span className='mt-1 block text-xs text-(--texto-apoio)'>
                              {dataCurta(item.date)}
                            </span>
                          </span>
                          <strong>{formatarMoeda(item.amount)}</strong>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className='py-6 text-(--texto-apoio)'>
                      Nenhuma despesa da casa registrada neste mês.
                    </p>
                  )}
                </CartaoCasa>
                {contas.length > 0 && (
                  <CartaoCasa titulo='Contas a acompanhar'>
                    <ul className='divide-y divide-[#e6edf2]'>
                      {contas.map(conta => (
                        <li
                          key={conta.id}
                          className='flex flex-wrap justify-between gap-3 py-4'
                        >
                          <span>
                            {conta.name}
                            <span className='mt-1 block text-xs text-(--texto-apoio)'>
                              Vencimento:{' '}
                              {dataCurta(vencimentoConta(conta, mes))}
                            </span>
                          </span>
                          <strong>{formatarMoeda(conta.amount)}</strong>
                        </li>
                      ))}
                    </ul>
                    <BotaoCasa
                      secundario
                      como={Link}
                      to='/financas?visao=contas'
                      classe='mt-4'
                    >
                      Gerenciar pagamentos
                    </BotaoCasa>
                  </CartaoCasa>
                )}
              </div>
            )}
            {visao === 'servicos' && (
              <CartaoCasa titulo='De que ajuda você precisa?'>
                <div className='mb-5 flex flex-wrap gap-3'>
                  {['Limpeza', 'Manutenção', 'Mudança'].map(categoria => (
                    <BotaoCasa
                      key={categoria}
                      secundario={servico !== categoria}
                      aria-pressed={servico === categoria}
                      onClick={() => setServico(categoria)}
                    >
                      {categoria}
                    </BotaoCasa>
                  ))}
                </div>
                <p
                  role='status'
                  className='rounded-lg bg-(--azul-fundo) p-5 text-(--texto-apoio)'
                >
                  Explore empresas de {servico.toLocaleLowerCase('pt-BR')} no
                  marketplace Iagora ou registre o cuidado para acompanhar o que
                  precisa resolver em casa.
                </p>
                <div className='mt-5 flex flex-wrap gap-3'>
                  <BotaoCasa como={Link} to='/marketplace'>
                    Explorar marketplace
                  </BotaoCasa>
                  <BotaoCasa
                    secundario
                    onClick={() => setDialogo({ tipo: 'formulario' })}
                  >
                    Registrar manutenção
                  </BotaoCasa>
                </div>
              </CartaoCasa>
            )}
          </Container>
        )}
      </main>
      <Rodape />
      {aviso && (
        <div
          role='status'
          className='fixed right-4 bottom-4 left-4 z-40 flex items-center justify-between gap-3 rounded-xl bg-(--azul-titulo) p-4 text-sm text-white shadow-lg sm:left-auto sm:max-w-md'
        >
          {aviso}
          <button
            type='button'
            onClick={() => setAviso('')}
            aria-label='Fechar aviso'
            className='size-11 text-xl'
          >
            ×
          </button>
        </div>
      )}
      {dialogo && (
        <DialogoCasa
          titulo={
            dialogo.tipo === 'formulario'
              ? dialogo.item
                ? 'Editar manutenção'
                : 'Um cuidado para lembrar'
              : dialogo.tipo === 'remover'
                ? 'Remover residência?'
                : dialogo.tipo === 'excluir'
                  ? 'Excluir manutenção?'
                  : dialogo.item.title
          }
          aoFechar={() => setDialogo(null)}
        >
          {dialogo.tipo === 'formulario' ? (
            <FormularioManutencao
              key={dialogo.item?.id ?? 'novo'}
              item={dialogo.item}
              aoCancelar={() => setDialogo(null)}
              aoSalvar={salvarManutencao}
            />
          ) : dialogo.tipo === 'remover' ? (
            <>
              <p className='mb-6 text-(--texto-apoio)'>
                As informações da residência serão removidas. Suas manutenções
                e despesas serão preservadas.
              </p>
              <div className='flex flex-wrap gap-3'>
                <BotaoCasa
                  onClick={() => {
                    setDados(anterior => ({
                      ...anterior,
                      example: false,
                      residence: null,
                    }));
                    setDialogo(null);
                    setAviso('Residência removida.');
                  }}
                >
                  Remover residência
                </BotaoCasa>
                <BotaoCasa secundario onClick={() => setDialogo(null)}>
                  Cancelar
                </BotaoCasa>
              </div>
            </>
          ) : dialogo.tipo === 'excluir' ? (
            <>
              <p className='mb-6'>
                Excluir “{dialogo.item.title}”? Esta ação não pode ser desfeita.
              </p>
              <div className='flex flex-wrap gap-3'>
                <BotaoCasa
                  onClick={() => {
                    setDados(anterior => ({
                      ...anterior,
                      example: false,
                      maintenance: anterior.maintenance.filter(
                        item => item.id !== dialogo.item.id
                      ),
                    }));
                    setDialogo(null);
                    setAviso('Manutenção excluída.');
                  }}
                >
                  Excluir
                </BotaoCasa>
                <BotaoCasa
                  secundario
                  onClick={() => setDialogo({ ...dialogo, tipo: 'detalhe' })}
                >
                  Cancelar
                </BotaoCasa>
              </div>
            </>
          ) : (
            <div className='space-y-5'>
              <p className='text-sm text-(--texto-apoio)'>
                {dialogo.item.priority} prioridade ·{' '}
                {dataCurta(dialogo.item.date)} · {dialogo.item.room}
              </p>
              {dialogo.item.notes && (
                <p className='whitespace-pre-wrap'>{dialogo.item.notes}</p>
              )}
              <div className='flex flex-wrap gap-3'>
                <BotaoCasa
                  secundario
                  onClick={() => setDialogo({ ...dialogo, tipo: 'formulario' })}
                >
                  Editar
                </BotaoCasa>
                {!dialogo.item.completedAt && (
                  <BotaoCasa
                    onClick={() => {
                      setDados(anterior =>
                        concluirManutencao(anterior, dialogo.item)
                      );
                      setDialogo(null);
                      setAviso(
                        dialogo.item.frequency === 'monthly'
                          ? 'Concluída! O próximo cuidado mensal foi agendado.'
                          : 'Manutenção concluída.'
                      );
                    }}
                  >
                    Marcar concluída
                  </BotaoCasa>
                )}
                <BotaoCasa secundario onClick={() => navegar('servicos')}>
                  Buscar empresa
                </BotaoCasa>
                <button
                  type='button'
                  className='min-h-12 px-4 text-sm font-bold text-[#b42318]'
                  onClick={() => setDialogo({ ...dialogo, tipo: 'excluir' })}
                >
                  Excluir
                </button>
              </div>
            </div>
          )}
        </DialogoCasa>
      )}
    </div>
  );
}
