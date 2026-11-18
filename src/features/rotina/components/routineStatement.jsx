import { ChevronRight, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analisarData, chaveData } from '../utils/dates';
import { IconeRotina } from './routineUi';

const diaDaSemana = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' });
const dataCurta = new Intl.DateTimeFormat('pt-BR');
const dataCompleta = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' });

export default function ExtratoRotina({
  registros,
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
      {grupos.length ? (
        grupos.map(([dia, itens]) => {
          const data = analisarData(dia);
          const ehHoje = dia === hoje;
          return (
            <section
              key={dia}
              aria-label={dataCompleta.format(data)}
              className='rotina-extrato-dia'
              data-hoje={dia === hoje}
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
                {itens.map(item => {
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
                    <li key={item.id}>
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
                    </li>
                  );
                })}
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
