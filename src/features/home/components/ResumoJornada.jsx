import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dataCurta, moeda } from '../../../app/dados/bancoMvp';
import { acessoLocal } from '../../../app/dados/acessoLocal';
import { lerGuia } from '../../minha-jornada/guiaMudanca';
import { estimarReserva, listar, resumoMoradia } from '../../preparacao/modelo';

export default function ResumoJornada({ banco }) {
  const { b, perfil } = banco;
  const usuario = perfil?.user_id;
  const guia = lerGuia(b, acessoLocal ? usuario : undefined);
  const planos = listar(b, 'plano_moradia', usuario);
  const plano = planos.find(item => item.status === 'ativo');
  const custos = plano ? listar(b, 'custo_moradia', usuario, plano.id) : [];
  const saldo =
    plano && resumoMoradia(plano.renda_mensal, plano.reserva_atual, custos);
  const estimativa = saldo && estimarReserva(plano.reserva_atual, saldo, 3);
  const temCustoMensal = custos.some(item => item.tipo === 'mensal');
  const temCustoInicial = custos.some(item => item.tipo === 'inicial');
  const proximaTarefa = guia.proxima?.tarefas.find(item => !item.concluida);
  const rotaGuia = guia.proxima
    ? '/minhajornada?etapa=' + guia.proxima.id
    : '/minhajornada';
  const rotaPlano = plano ? '/financas-b?plano=' + plano.id : '/financas-b';

  return (
    <section
      className='inicio-jornada-resumo'
      aria-labelledby='inicio-jornada-titulo'
    >
      <header>
        <h2 id='inicio-jornada-titulo'>Progresso da mudança</h2>
        <span>
          {guia.feitas}/{guia.total} itens
        </span>
      </header>
      <progress
        aria-label='Itens concluídos do guia de mudança'
        value={guia.feitas}
        max={guia.total || 1}
      />
      <Link to={rotaGuia} className='inicio-jornada-proxima'>
        {guia.proxima && <img src={guia.proxima.foto} alt='' />}
        <span>
          <strong>
            {guia.proxima?.titulo ??
              (guia.total ? 'Guia concluído' : 'Organize suas etapas')}
          </strong>
          <span>
            {proximaTarefa?.titulo ??
              (guia.total
                ? 'Revise as etapas quando precisar.'
                : 'Adicione um item ao seu checklist.')}
          </span>
        </span>
        <ChevronRight size={20} aria-hidden='true' />
      </Link>
      <div className='inicio-jornada-financas'>
        {plano && custos.length ? (
          <>
            <dl>
              <div>
                <dt>Custo mensal previsto</dt>
                <dd>{temCustoMensal ? moeda(saldo.mensal) : 'A estimar'}</dd>
              </div>
              <div>
                <dt>Falta na reserva · cenário de 3 meses</dt>
                <dd>
                  {temCustoMensal ? moeda(estimativa.falta) : 'A estimar'}
                </dd>
              </div>
            </dl>
            {(!temCustoMensal || !temCustoInicial) && (
              <p>
                Inclua os gastos {temCustoMensal ? 'iniciais' : 'mensais'} para
                completar a estimativa.
              </p>
            )}
            {saldo.saldoMensal < 0 && (
              <p className='text-(--vermelho-alerta)'>
                Os gastos mensais excedem a renda em {moeda(-saldo.saldoMensal)}
                .
              </p>
            )}
          </>
        ) : (
          <p>
            {plano
              ? 'Cadastre custos para estimar quanto a mudança vai exigir.'
              : 'Crie um plano de moradia para estimar custos e reserva.'}
          </p>
        )}
        <Link to={rotaPlano}>
          {plano?.mudanca_prevista
            ? 'Mudança prevista para ' + dataCurta(plano.mudanca_prevista)
            : 'Abrir planejamento'}{' '}
          <ChevronRight size={16} aria-hidden='true' />
        </Link>
      </div>
    </section>
  );
}
