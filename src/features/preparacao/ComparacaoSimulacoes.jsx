import { moeda } from '../../app/dados/bancoMvp';
import { Titulo } from '../../shared/ui';
import { painel } from './LayoutPreparacao';
import { resumoMoradia } from './modelo';

const indicadores = [
  ['mensal', 'Custo mensal'],
  ['saldoMensal', 'Saldo mensal'],
  ['inicial', 'Custo inicial'],
  ['saldoInicial', 'Saldo da reserva'],
];

export default function ComparacaoSimulacoes({ simulacoes, itens }) {
  if (simulacoes.length < 2) return null;
  return (
    <section className={painel} aria-labelledby='titulo-comparacao-simulacoes'>
      <Titulo
        como='h2'
        id='titulo-comparacao-simulacoes'
        classe='text-xl font-bold'
      >
        Comparar simulações
      </Titulo>
      <ul className='mt-3 grid gap-3 lg:grid-cols-2'>
        {simulacoes.map(simulacao => {
          const resumo = resumoMoradia(
            simulacao.renda_mensal,
            simulacao.reserva,
            itens.filter(item => item.simulacao_id === simulacao.id)
          );
          return (
            <li className='rounded-lg bg-(--azul-fundo) p-3' key={simulacao.id}>
              <h3 className='font-bold'>{simulacao.nome}</h3>
              <dl className='mt-2 grid grid-cols-2 gap-3'>
                {indicadores.map(([chave, rotulo]) => (
                  <div key={chave}>
                    <dt className='text-xs text-(--texto-apoio)'>{rotulo}</dt>
                    <dd className='font-bold tabular-nums'>
                      {moeda(resumo[chave])}
                    </dd>
                  </div>
                ))}
              </dl>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
