import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { chaveData } from '../../rotina/utilitarios/datas';
import { obterEventosAgendaMes } from '../conteudo';

const diasSemana = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

function construirGradeDomingo(mes) {
  const ano = mes.getFullYear();
  const indiceMes = mes.getMonth();
  const primeiroDiaSemana = new Date(ano, indiceMes, 1, 12).getDay();
  const totalDiasMes = new Date(ano, indiceMes + 1, 0, 12).getDate();
  const totalCelulas = Math.ceil((primeiroDiaSemana + totalDiasMes) / 7) * 7;

  return Array.from({ length: totalCelulas }, (_, indice) => {
    const data = new Date(
      ano,
      indiceMes,
      1 - primeiroDiaSemana + indice,
      12
    );
    return {
      chave: chaveData(data),
      numero: data.getDate(),
      noMes: data.getMonth() === indiceMes,
    };
  });
}

function partesEtiquetaData(dataIso) {
  const [ano, mes, dia] = dataIso.split('-').map(Number);
  const data = new Date(ano, mes - 1, dia, 12);
  return {
    dia: String(dia).padStart(2, '0'),
    mes: data
      .toLocaleDateString('pt-BR', { month: 'short' })
      .replace('.', '')
      .toUpperCase(),
  };
}

export default function CartaoAgenda() {
  const hoje = chaveData();
  const [mesReferencia, setMesReferencia] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1, 12)
  );
  const [dataSelecionada, setDataSelecionada] = useState('');

  const grade = useMemo(
    () => construirGradeDomingo(mesReferencia),
    [mesReferencia]
  );

  const eventos = useMemo(
    () => obterEventosAgendaMes(mesReferencia),
    [mesReferencia]
  );

  const eventosPorDia = useMemo(() => {
    const mapa = new Map();
    for (const evento of eventos) {
      const lista = mapa.get(evento.data) || [];
      lista.push(evento);
      mapa.set(evento.data, lista);
    }
    return mapa;
  }, [eventos]);

  const listaExibida = dataSelecionada
    ? eventosPorDia.get(dataSelecionada) || []
    : eventos;

  const nomeMes = mesReferencia.toLocaleDateString('pt-BR', {
    month: 'long',
  });
  const nomeMesFormatado =
    nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);

  return (
    <div className='rounded-xl border border-[#eef2f6] bg-white p-4 shadow-[0_2px_16px_rgba(16,42,67,0.05)] sm:p-5'>
      <div className='grid gap-5 md:grid-cols-[1.15fr_1fr]'>
        <div className='min-w-0'>
          <div className='mb-3 flex items-center justify-between gap-2'>
            <p className='text-lg font-extrabold text-(--azul-titulo)'>
              {nomeMesFormatado}{' '}
              <span className='font-normal text-(--texto-apoio)'>
                {mesReferencia.getFullYear()}
              </span>
            </p>
            <div className='flex items-center gap-1.5'>
              <button
                type='button'
                aria-label='Mês anterior'
                onClick={() => {
                  setDataSelecionada('');
                  setMesReferencia(
                    anterior =>
                      new Date(
                        anterior.getFullYear(),
                        anterior.getMonth() - 1,
                        1,
                        12
                      )
                  );
                }}
                className='flex size-8 items-center justify-center rounded-full border border-[#dbe5ed] text-sm font-bold text-(--azul-titulo) hover:bg-(--azul-fundo)'
              >
                ‹
              </button>
              <button
                type='button'
                aria-label='Próximo mês'
                onClick={() => {
                  setDataSelecionada('');
                  setMesReferencia(
                    anterior =>
                      new Date(
                        anterior.getFullYear(),
                        anterior.getMonth() + 1,
                        1,
                        12
                      )
                  );
                }}
                className='flex size-8 items-center justify-center rounded-full border border-[#dbe5ed] text-sm font-bold text-(--azul-titulo) hover:bg-(--azul-fundo)'
              >
                ›
              </button>
            </div>
          </div>

          <div className='grid grid-cols-7 gap-y-1 text-center'>
            {diasSemana.map(dia => (
              <span
                key={dia}
                className='py-1 text-[10px] font-bold tracking-wider text-(--texto-apoio)'
              >
                {dia}
              </span>
            ))}

            {grade.map(celula => {
              const eventosCelula = eventosPorDia.get(celula.chave) || [];
              const ehHoje = celula.chave === hoje;
              const selecionado = celula.chave === dataSelecionada;
              const temFinanceiro = eventosCelula.some(
                item => item.tipo === 'financas'
              );
              const temOutro = eventosCelula.some(
                item => item.tipo !== 'financas'
              );

              return (
                <button
                  key={celula.chave}
                  type='button'
                  disabled={!celula.noMes}
                  onClick={() =>
                    setDataSelecionada(anterior =>
                      anterior === celula.chave ? '' : celula.chave
                    )
                  }
                  aria-label={`${celula.numero}${
                    eventosCelula.length
                      ? `, ${eventosCelula.length} compromisso(s)`
                      : ''
                  }`}
                  className={
                    'relative mx-auto flex size-8 flex-col items-center justify-center rounded-md text-xs font-medium transition-colors ' +
                    (!celula.noMes
                      ? 'cursor-default text-[#b4c0cc]'
                      : selecionado
                        ? 'bg-(--azul-titulo) font-bold text-white'
                        : ehHoje
                          ? 'border border-(--laranja-principal) bg-[#fce8dc] font-bold text-(--laranja-principal)'
                          : 'text-(--azul-titulo) hover:bg-(--azul-fundo)')
                  }
                >
                  <span>{celula.numero}</span>
                  {celula.noMes && (temFinanceiro || temOutro) && (
                    <span
                      aria-hidden='true'
                      className={
                        'mt-0.5 size-1 rounded-full ' +
                        (selecionado
                          ? 'bg-white'
                          : temFinanceiro
                            ? 'bg-(--laranja-principal)'
                            : 'bg-(--azul-titulo)')
                      }
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className='min-w-0 border-t border-[#eef2f6] pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-4'>
          <div className='mb-3 flex items-center justify-between gap-2'>
            <span className='inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-(--laranja-principal)'>
              <span
                aria-hidden='true'
                className='size-1.5 rounded-full bg-(--laranja-principal)'
              />
              COMPROMISSOS
            </span>
            <span className='rounded-full bg-(--azul-fundo) px-2.5 py-0.5 text-[11px] font-bold text-(--azul-titulo)'>
              {listaExibida.length}{' '}
              {listaExibida.length === 1 ? 'evento' : 'eventos'}
            </span>
          </div>

          {listaExibida.length ? (
            <div className='max-h-[210px] space-y-2 overflow-y-auto pr-1'>
              {listaExibida.slice(0, 6).map(evento => {
                const { dia, mes } = partesEtiquetaData(evento.data);
                const destaqueLaranja = evento.tipo === 'financas';
                return (
                  <Link
                    key={evento.id}
                    to={evento.rota}
                    className='flex items-center gap-2.5 rounded-lg border border-[#eef2f6] bg-white p-2 text-left transition-colors hover:bg-(--azul-fundo)'
                  >
                    <span
                      className={
                        'flex w-10 shrink-0 flex-col items-center justify-center rounded-md py-1 leading-tight ' +
                        (destaqueLaranja
                          ? 'bg-[#fce8dc] text-(--laranja-principal)'
                          : 'bg-(--azul-fundo) text-(--azul-titulo)')
                      }
                    >
                      <strong className='text-xs font-extrabold'>{dia}</strong>
                      <span className='text-[9px] font-bold'>{mes}</span>
                    </span>
                    <span className='min-w-0 flex-1'>
                      <strong className='block truncate text-xs font-bold text-(--azul-titulo)'>
                        {evento.titulo}
                      </strong>
                      <span className='block truncate text-[11px] text-(--texto-apoio)'>
                        {evento.subtitulo}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className='rounded-lg bg-(--azul-fundo) p-4 text-center'>
              <p className='text-xs text-(--texto-apoio)'>
                {dataSelecionada
                  ? 'Nenhum compromisso para este dia.'
                  : 'Nenhum evento encontrado neste mês.'}
              </p>
              {dataSelecionada ? (
                <button
                  type='button'
                  onClick={() => setDataSelecionada('')}
                  className='mt-2 text-xs font-bold text-(--laranja-principal)'
                >
                  Ver mês inteiro
                </button>
              ) : (
                <Link
                  to='/rotina?visao=lista'
                  className='mt-2 inline-block text-xs font-bold text-(--laranja-principal)'
                >
                  Adicionar na rotina →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
