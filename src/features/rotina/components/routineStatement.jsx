import { ChevronRight, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analisarData, chaveData } from '../utils/dates';
import { IconeRotina } from './routineUi';

const diaDaSemana = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' });
const dataCurta = new Intl.DateTimeFormat('pt-BR');
const dataCompleta = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' });

function LinhaExtrato({ item, atrasada = false }) {
  const conteudo = (
    <>
      <span
        className='rotina-extrato-icone'
        data-tipo={item.tipo}
        aria-hidden='true'
      >
        {item.icone ? (
          <IconeRotina nome={item.icone} classe='size-5' />
        ) : (
          <Wallet size={18} aria-hidden='true' />
        )}
      </span>
      <span className='rotina-extrato-nome'>
        <strong>{item.titulo}</strong>
        {item.categoria && <small>{item.categoria}</small>}
        {atrasada ? (
          <small>
            Prevista para{' '}
            <time dateTime={item.data}>
              {dataCurta.format(analisarData(item.data))}
            </time>
          </small>
        ) : (
          item.nota && <small>{item.nota}</small>
        )}
      </span>
      <span className='rotina-extrato-metadados'>
        {item.detalhe && <strong>{item.detalhe}</strong>}
        <small data-status={item.estado}>{item.situacao}</small>
      </span>
      <ChevronRight
        size={16}
        className='rotina-extrato-seta'
        aria-hidden='true'
      />
    </>
  );

  return (
    <li className={atrasada ? 'rotina-extrato-atrasada' : undefined}>
      {item.rota ? (
        <Link className='rotina-extrato-linha' to={item.rota}>
          {conteudo}
        </Link>
      ) : (
        <button
          type='button'
          className='rotina-extrato-linha'
          onClick={item.aoAbrir}
        >
          {conteudo}
        </button>
      )}
      {atrasada && (
        <div className='rotina-extrato-acoes-atrasada'>
          <button
            type='button'
            aria-label={`Reagendar ${item.titulo}`}
            onClick={item.aoReagendar}
          >
            Reagendar
          </button>
          <button
            type='button'
            aria-label={`Concluir ${item.titulo}`}
            onClick={item.aoConcluir}
          >
            Concluir
          </button>
        </div>
      )}
    </li>
  );
}

export default function ExtratoRotina({
  registros,
  atrasadas = [],
  rotulo,
  vazio,
  decrescente = false,
}) {
  const hoje = chaveData();
  const grupos = [...Map.groupBy(registros, item => item.data)].sort(
    ([a], [b]) => (decrescente ? b.localeCompare(a) : a.localeCompare(b))
  );

  return (
    <div
      className='rotina-extrato-lista'
      role='region'
      aria-label={rotulo}
      tabIndex={0}
    >
      {!!atrasadas.length && (
        <section
          className='rotina-extrato-dia rotina-extrato-atrasadas'
          aria-labelledby='rotina-atrasadas-titulo'
        >
          <h3 id='rotina-atrasadas-titulo' className='rotina-extrato-data'>
            Atrasadas <span>{atrasadas.length}</span>
          </h3>
          <ul>
            {atrasadas.map(item => (
              <LinhaExtrato key={item.id} item={item} atrasada />
            ))}
          </ul>
        </section>
      )}
      {grupos.length ? (
        grupos.map(([dia, itens]) => {
          const data = analisarData(dia);
          const ehHoje = dia === hoje;
          return (
            <section
              key={dia}
              aria-label={dataCompleta.format(data)}
              className='rotina-extrato-dia'
              data-hoje={ehHoje}
            >
              <h3 className='rotina-extrato-data'>
                <time dateTime={dia} aria-label={dataCompleta.format(data)}>
                  {dataCurta.format(data)}
                </time>
                <span className='rotina-extrato-dia-semana' aria-hidden='true'>
                  {diaDaSemana.format(data)}
                </span>
                {ehHoje && <span className='rotina-extrato-hoje'>Hoje</span>}
              </h3>
              <ul>
                {itens.map(item => (
                  <LinhaExtrato key={item.id} item={item} />
                ))}
              </ul>
            </section>
          );
        })
      ) : (
        <p className='rotina-extrato-vazio'>{vazio}</p>
      )}
    </div>
  );
}
