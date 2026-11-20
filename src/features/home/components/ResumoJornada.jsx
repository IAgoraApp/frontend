import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dataCurta, moeda } from '../../../app/dados/bancoMvp';
import { acessoLocal } from '../../../app/dados/acessoLocal';
import { lerGuia } from '../../minha-jornada/guiaMudanca';
import { estimarReserva, listar } from '../../preparacao/modelo';
import { resumirOrcamento } from '../../financas-B/dinheiroDados';
import { lerPrevisaoMudanca } from '../../preparacao/previsaoMudanca';

export default function ResumoJornada({ banco }) {
  const { b, perfil } = banco;
  const usuario = perfil?.user_id;
  const guia = lerGuia(b, acessoLocal ? usuario : undefined);
  const imovel = listar(b, 'casa_desejada', usuario)[0];
  const resumo = resumirOrcamento(b, usuario, imovel);
  const { temCustoMensal, temCustoInicial } = resumo;
  const estimativa = estimarReserva(
    resumo.reserva,
    {
      mensal: resumo.gastosFuturos,
      inicial: resumo.custosIniciais,
    },
    3
  );
  const dataMudanca = lerPrevisaoMudanca(b, usuario);
  const proximaTarefa = guia.proxima?.tarefas.find(item => !item.concluida);
  const rotaGuia = guia.proxima
    ? '/minhajornada?etapa=' + guia.proxima.id
    : '/minhajornada';
  const rotaPlano = imovel ? '/financas-b?imovel=' + imovel.id : '/financas-b';

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
        {resumo.temPlano ? (
          <>
            <dl>
              <div>
                <dt>Custo mensal previsto</dt>
                <dd>
                  {temCustoMensal ? moeda(resumo.gastosFuturos) : 'A estimar'}
                </dd>
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
            {resumo.depois < 0 && (
              <p className='text-(--vermelho-alerta)'>
                Os gastos mensais excedem a renda em {moeda(-resumo.depois)}.
              </p>
            )}
          </>
        ) : (
          <p>
            {imovel
              ? 'Cadastre custos para estimar quanto a mudança vai exigir.'
              : 'Crie um plano de moradia para estimar custos e reserva.'}
          </p>
        )}
        <Link to={rotaPlano}>
          {dataMudanca
            ? 'Mudança prevista para ' + dataCurta(dataMudanca)
            : 'Abrir planejamento'}{' '}
          <ChevronRight size={16} aria-hidden='true' />
        </Link>
      </div>
    </section>
  );
}
