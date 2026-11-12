import { useEffect, useRef } from 'react';
import { Botao, Titulo } from '../../../compartilhado/interface/indice';
import iconeMoedaEconomia from '../../../ativos/vetores/financas/moeda-poupanca.svg';
import iconeDadosExemplo from '../../../ativos/vetores/financas/info-exemplo.svg';
import iconeSino from '../../../ativos/vetores/financas/icone-sino.svg';
import iconeRaio from '../../../ativos/vetores/financas/icone-raio.svg';
import iconePredio from '../../../ativos/vetores/financas/icone-predio.svg';
import iconeOnibus from '../../../ativos/vetores/financas/icone-onibus.svg';
import iconeCalendario from '../../../ativos/vetores/financas/icone-calendario.svg';
import iconeCarrinho from '../../../ativos/vetores/financas/icone-carrinho.svg';
import iconeFiltro from '../../../ativos/vetores/financas/icone-filtro.svg';
import iconeEngrenagem from '../../../ativos/vetores/financas/icone-engrenagem.svg';
import iconeEducacao from '../../../ativos/vetores/financas/icone-formatura.svg';
import iconeSaude from '../../../ativos/vetores/financas/icone-coracao.svg';
import iconeCasa from '../../../ativos/vetores/financas/icone-casa.svg';
import iconeAviao from '../../../ativos/vetores/financas/icone-aviao.svg';
import iconeRecibo from '../../../ativos/vetores/financas/icone-recibo.svg';
import iconeBusca from '../../../ativos/vetores/financas/icone-busca.svg';
import iconeSofa from '../../../ativos/vetores/financas/icone-sofa.svg';
import iconeTalheres from '../../../ativos/vetores/financas/icone-talheres.svg';
import iconeWifi from '../../../ativos/vetores/financas/icone-wifi.svg';
import ilustracaoLivro from '../../../ativos/vetores/financas/ilustracao-livro-aberto.svg';
import indicadorEntradas from '../../../ativos/vetores/financas/indicador-entradas.svg';
import indicadorSaidas from '../../../ativos/vetores/financas/indicador-saidas.svg';
import indicadorSaldo from '../../../ativos/vetores/financas/indicador-saldo.svg';
import botaoEnviar from '../../../ativos/vetores/financas/botao-enviar.svg';
import indicadorAluguel from '../../../ativos/vetores/financas/transacao-aluguel.svg';
import indicadorSalario from '../../../ativos/vetores/financas/transacao-salario.svg';

const mapaIcones = {
  MoedaEconomia: iconeMoedaEconomia,
  DadosExemplo: iconeDadosExemplo,
  LivroAberto: ilustracaoLivro,
  IndicadorEntradas: indicadorEntradas,
  IndicadorSaidas: indicadorSaidas,
  IndicadorSaldo: indicadorSaldo,
  BotaoEnviar: botaoEnviar,
  IndicadorAluguel: indicadorAluguel,
  IndicadorSalario: indicadorSalario,
  Bell: iconeSino,
  Bolt: iconeRaio,
  Building: iconePredio,
  Bus: iconeOnibus,
  Calendar: iconeCalendario,
  Cart: iconeCarrinho,
  Filter: iconeFiltro,
  Gear: iconeEngrenagem,
  Graduation: iconeEducacao,
  Heart: iconeSaude,
  Home: iconeCasa,
  Plane: iconeAviao,
  Receipt: iconeRecibo,
  Search: iconeBusca,
  Sofa: iconeSofa,
  Utensils: iconeTalheres,
  Wifi: iconeWifi,
};

export function IconeFinancas({ nome, classe = '' }) {
  const origem = mapaIcones[nome] ?? mapaIcones[nome.replace(/^Icon/, '')];
  return origem ? (
    <span
      aria-hidden='true'
      className={
        'inline-flex shrink-0 items-center justify-center ' + classe
      }
    >
      <img src={origem} alt='' className='block max-h-full max-w-full' />
    </span>
  ) : null;
}

export function AcaoFinancas({
  children,
  secundario = false,
  marinho = false,
  classe = '',
  ...propriedades
}) {
  return (
    <Botao
      semEstilo
      classe={
        'min-h-11 gap-2 rounded-full px-6 py-3 text-sm font-bold disabled:opacity-50 ' +
        (secundario
          ? 'border border-[#dbe5ed] bg-(--azul-fundo) text-(--azul-titulo) hover:bg-[#e6edf2] '
          : marinho
            ? 'bg-(--azul-titulo) text-white hover:opacity-85 '
            : 'bg-(--laranja-principal) text-white hover:bg-[#c43300] ') +
        classe
      }
      {...propriedades}
    >
      {children}
    </Botao>
  );
}

export function PainelFinancas({
  titulo,
  children,
  classe = '',
  acao,
  neutro = false,
}) {
  return (
    <section
      className={
        'min-w-0 rounded-xl border border-[#d9e4ec] p-5 sm:p-6 ' +
        (neutro ? 'bg-(--azul-fundo) ' : 'bg-white ') +
        classe
      }
    >
      {titulo && (
        <div className='mb-5 flex flex-wrap items-center justify-between gap-3'>
          <Titulo classe='text-xl font-extrabold'>{titulo}</Titulo>
          {acao}
        </div>
      )}
      {children}
    </section>
  );
}

export function EstadoVazioFinancas({
  children = 'Nenhum registro por aqui.',
  aoCriar,
}) {
  return (
    <div className='flex min-h-40 flex-col items-center justify-center gap-4 p-5 text-center text-(--texto-apoio)'>
      <p>{children}</p>
      {aoCriar && (
        <AcaoFinancas onClick={aoCriar}>Criar primeiro registro</AcaoFinancas>
      )}
    </div>
  );
}

export function SegmentosFinancas({ opcoes, valor, aoAlterar, rotulo }) {
  return (
    <div className='flex flex-wrap gap-2' role='group' aria-label={rotulo}>
      {opcoes.map(([chave, texto]) => (
        <button
          type='button'
          key={chave}
          aria-pressed={valor === chave}
          onClick={() => aoAlterar(chave)}
          className={
            'min-h-11 rounded-full px-5 py-2 text-sm font-bold ' +
            (valor === chave
              ? 'bg-(--azul-titulo) text-white'
              : 'bg-(--azul-fundo) text-(--texto-apoio) hover:bg-[#e6edf2]')
          }
        >
          {texto}
        </button>
      ))}
    </div>
  );
}

export function BarraProgressoFinancas({ valor, rotulo, cor = '#e03b00' }) {
  return (
    <div
      role='progressbar'
      aria-label={rotulo}
      aria-valuenow={Math.round(Math.min(100, valor))}
      aria-valuemin={0}
      aria-valuemax={100}
      className='h-2 overflow-hidden rounded-full bg-[#e6edf2]'
    >
      <div
        className='h-full rounded-full transition-[width] motion-reduce:transition-none'
        style={{
          width: Math.min(100, Math.max(0, valor)) + '%',
          backgroundColor: cor,
        }}
      />
    </div>
  );
}

export function DialogoFinancas({ titulo, children, aoFechar }) {
  const referencia = useRef(null);
  const aoFecharAtual = useRef(aoFechar);

  useEffect(() => {
    aoFecharAtual.current = aoFechar;
  }, [aoFechar]);

  useEffect(() => {
    const dialogo = referencia.current;
    const anterior = document.activeElement;
    dialogo.showModal();
    const rolagem = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialogo.close();
      document.body.style.overflow = rolagem;
      anterior?.focus();
    };
  }, []);

  return (
    <dialog
      ref={referencia}
      onCancel={evento => {
        evento.preventDefault();
        aoFecharAtual.current();
      }}
      onClick={evento => {
        if (evento.target === evento.currentTarget) aoFecharAtual.current();
      }}
      aria-labelledby='titulo-dialogo-financas'
      className='fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl border border-[#dbe5ed] bg-white p-5 text-(--azul-titulo) shadow-xl backdrop:bg-[#102a43]/40 sm:p-8'
    >
      <div className='mb-6 flex items-start justify-between gap-4'>
        <Titulo
          como='h2'
          id='titulo-dialogo-financas'
          classe='text-2xl font-extrabold'
        >
          {titulo}
        </Titulo>
        <button
          type='button'
          aria-label='Fechar'
          onClick={aoFechar}
          className='-mt-2 -mr-2 flex size-11 shrink-0 items-center justify-center rounded-full text-2xl hover:bg-(--azul-fundo)'
        >
          ×
        </button>
      </div>
      {children}
    </dialog>
  );
}

export function PainelVisaoFinancas({ ativo, semRecuo = false, children }) {
  return (
    <div hidden={!ativo} className={'min-w-0 ' + (semRecuo ? '' : 'pt-6')}>
      {children}
    </div>
  );
}
