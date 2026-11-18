import { Gamepad2, Wallet, X } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';
import { Botao, Titulo } from '../../../shared/ui/index';
import './financeDialog.css';
import iconeMoedaEconomia from '../assets/imgBudgetCtaSavingsCoin.svg';
import iconeDadosExemplo from '../assets/imgExampleDataInfo.svg';
import iconeSino from '../assets/imgIconBell.svg';
import iconeRaio from '../assets/imgIconBolt.svg';
import iconePredio from '../assets/imgIconBuilding.svg';
import iconeOnibus from '../assets/imgIconBus.svg';
import iconeCalendario from '../assets/imgIconCalendar.svg';
import iconeCarrinho from '../assets/imgIconCart.svg';
import iconeFiltro from '../assets/imgIconFilter.svg';
import iconeEngrenagem from '../assets/imgIconGear.svg';
import iconeEducacao from '../assets/imgIconGraduation.svg';
import iconeSaude from '../assets/imgIconHeart.svg';
import iconeCasa from '../assets/imgIconHome.svg';
import iconeAviao from '../assets/imgIconPlane.svg';
import iconeRecibo from '../assets/imgIconReceipt.svg';
import iconeBusca from '../assets/imgIconSearch.svg';
import iconeSofa from '../assets/imgIconSofa.svg';
import iconeTalheres from '../assets/imgIconUtensils.svg';
import iconeWifi from '../assets/imgIconWifi.svg';
import ilustracaoLivro from '../assets/imgIllustrationOpenBook.svg';
import indicadorEntradas from '../assets/imgIndicatorEntradasIcon.svg';
import indicadorSaidas from '../assets/imgIndicatorSaidasIcon.svg';
import indicadorSaldo from '../assets/imgIndicatorSaldoIcon.svg';
import botaoEnviar from '../assets/imgInputSendButton.svg';
import indicadorAluguel from '../assets/imgTransactionIndicatorAluguel.svg';
import indicadorSalario from '../assets/imgTransactionIndicatorSalario.svg';

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

const iconesVetoriais = { Gamepad2, Wallet };

export function IconeFinancas({ nome, classe = '' }) {
  const Vetor = iconesVetoriais[nome];
  if (Vetor) return <Vetor className={classe} aria-hidden='true' />;
  const origem = mapaIcones[nome] ?? mapaIcones[nome.replace(/^Icon/, '')];
  return origem ? (
    <span
      aria-hidden='true'
      className={'inline-flex shrink-0 items-center justify-center ' + classe}
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
        'min-w-0 rounded-2xl border border-(--borda-suave) p-5 sm:p-6 ' +
        (neutro ? 'bg-(--azul-fundo) ' : 'bg-white ') +
        classe
      }
    >
      {titulo && (
        <div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
          <Titulo classe='text-xl leading-tight font-extrabold sm:text-2xl'>
            {titulo}
          </Titulo>
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

export function DialogoFinancas({
  titulo,
  children,
  aoFechar,
  Icone,
  rotulo,
  destrutivo = false,
}) {
  const tituloId = useId();
  const referencia = useRef(null);
  const referenciaTitulo = useRef(null);
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

  useEffect(() => {
    referencia.current.scrollTop = 0;
    referenciaTitulo.current.focus({ preventScroll: true });
  }, [titulo]);

  return (
    <dialog
      ref={referencia}
      onSubmit={evento => evento.stopPropagation()}
      onCancel={evento => {
        evento.stopPropagation();
        evento.preventDefault();
        aoFecharAtual.current();
      }}
      onClick={evento => {
        if (evento.target === evento.currentTarget) aoFecharAtual.current();
      }}
      aria-labelledby={tituloId}
      className='finance-dialog fixed inset-0 m-auto max-h-[min(90dvh,48rem)] w-[calc(100%-1.5rem)] max-w-xl overflow-y-auto overscroll-contain rounded-2xl border border-(--borda-suave) bg-white text-(--azul-titulo) shadow-2xl backdrop:bg-[#102a43]/55'
    >
      <header
        className={
          'finance-dialog-head flex items-center gap-3 border-b border-(--borda-suave) px-4 py-4 sm:gap-4 sm:px-7 sm:py-5 ' +
          (destrutivo ? 'bg-[#fff5f2]' : 'bg-white')
        }
      >
        {Icone && (
          <span
            className={
              'grid size-11 shrink-0 place-items-center rounded-lg ' +
              (destrutivo
                ? 'bg-[#fce0dc] text-(--vermelho-alerta)'
                : 'bg-(--laranja-fundo) text-[#a52f08]')
            }
          >
            <Icone size={22} aria-hidden='true' />
          </span>
        )}
        <div className='min-w-0 flex-1'>
          {rotulo && (
            <p className='mb-1 text-xs font-bold text-(--texto-apoio)'>
              {rotulo}
            </p>
          )}
          <Titulo
            como='h2'
            id={tituloId}
            classe='text-xl leading-tight font-extrabold wrap-anywhere sm:text-2xl'
          >
            <span
              ref={referenciaTitulo}
              tabIndex={-1}
              className='focus:outline-none'
            >
              {titulo}
            </span>
          </Titulo>
        </div>
        <button
          type='button'
          aria-label='Fechar'
          onClick={aoFechar}
          className='grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-(--borda-suave) bg-white hover:bg-(--azul-fundo)'
        >
          <X size={20} aria-hidden='true' />
        </button>
      </header>
      <div className='finance-dialog-body p-4 sm:p-7'>{children}</div>
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
