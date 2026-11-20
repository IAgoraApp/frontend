import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Plus,
  Trash2,
  Wallet,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAvisoPerfilA } from '../../../app/avisos/avisosPerfilA';
import { dataCurta, moeda } from '../../../app/dados/bancoMvp';
import { BotaoCasa } from '../../casa/components/casaUi';
import {
  AcaoFinancas,
  DialogoFinancas,
} from '../../financas/components/financeUi';
import { useDadosServidor } from '../../../app/dados/contextoServidor';
import { salvarMetaMudanca } from '../planejamentoApi';
import { proximoId } from '../../preparacao/modelo';
import { alterarDinheiro, centavos, validarValor } from '../dinheiroDados';
import cofrinho from '../../financas/assets/porquinho-metas.webp';

const fonteCaixa =
  'https://www.caixa.gov.br/voce/habitacao/perguntas-frequentes-novos-financiamentos/Paginas/default.aspx';
const fonteCvm =
  'https://www.gov.br/investidor/pt-br/investir/antes-de-investir/defina-seus-objetivos/emergencias-e-aposentadoria';
const fonteLocacao =
  'https://www.planalto.gov.br/ccivil_03/leis/l8245.htm#art38';

function NotaEstimativa({ estimativa, rotaCustos }) {
  const { compra, precoCompra, custosIniciais, margem, meses } = estimativa;
  return (
    <aside
      className='meta-nota-estimativa'
      aria-label='Como calculamos a meta da mudança'
    >
      <strong>
        {compra ? 'Estimativa para comprar' : 'Estimativa para começar a morar'}
      </strong>
      {compra ? (
        <p>
          Preço do imóvel ({moeda(precoCompra)}) + custos iniciais cadastrados (
          {moeda(custosIniciais)}) + reserva de {meses} meses de gastos
          previstos ({moeda(margem)}). Inclua ITBI, registro e mudança nos
          custos iniciais.
        </p>
      ) : (
        <p>
          {estimativa.valorCadastrado
            ? 'Primeiro mês com o valor já cadastrado'
            : 'Primeiro mês conforme os gastos mensais do plano'}{' '}
          ({moeda(margem)}).
          {custosIniciais > 0
            ? ' Custos iniciais adicionais: ' + moeda(custosIniciais) + '.'
            : ' Nenhum custo inicial adicional neste plano.'}{' '}
          Inclua frete e a caução em dinheiro, se prevista no contrato. A lei
          limita essa caução a três aluguéis.
        </p>
      )}
      {rotaCustos && (
        <p>
          <Link to={rotaCustos}>Conferir custos previstos do plano</Link>
        </p>
      )}
      {rotaCustos && margem === 0 && (
        <p>Cadastre os gastos mensais para completar esta estimativa.</p>
      )}
      <p className='meta-nota-fontes'>
        {compra ? (
          <>
            <a href={fonteCaixa} target='_blank' rel='noreferrer'>
              CAIXA · custos da compra
            </a>
            <a href={fonteCvm} target='_blank' rel='noreferrer'>
              CVM · reserva de emergência
            </a>
          </>
        ) : (
          <a href={fonteLocacao} target='_blank' rel='noreferrer'>
            Lei do Inquilinato · art. 38
          </a>
        )}
      </p>
    </aside>
  );
}

function ValoresEconomia({ mensal, diario }) {
  return (
    <dl>
      <div>
        <dt>Por mês</dt>
        <dd>{moeda(mensal)}</dd>
      </div>
      <div>
        <dt>Por dia</dt>
        <dd>{moeda(diario)}</dd>
      </div>
    </dl>
  );
}

const novaMeta = {
  nome: '',
  fonte: 'personalizada',
  alvo: '',
  modo: 'prazo',
  data: '',
  aporte: '',
};

const diaEmMs = 86400000;
const diasPorMes = 30;
const formatarDia = dia => new Date(dia * diaEmMs).toISOString().slice(0, 10);

function calcularMeta(meta, resumo) {
  const agora = new Date();
  const hoje =
    Date.UTC(agora.getFullYear(), agora.getMonth(), agora.getDate()) / diaEmMs;
  const data =
    meta.data ||
    (Number(meta.meses) > 0
      ? formatarDia(hoje + Number(meta.meses) * diasPorMes)
      : '');
  const alvoSalvo = Number(meta.alvo);
  const alvo = meta.fonte === 'mudanca' && !(meta.id && alvoSalvo > 0)
    ? resumo.alvo
    : alvoSalvo;
  const aporte = !meta.aporte
    ? Math.max(0, resumo.agora ?? 0)
    : Number(meta.aporte);
  const falta = Math.max(0, centavos(alvo) - centavos(resumo.reserva));
  const dias = data ? Date.parse(data + 'T00:00:00Z') / diaEmMs - hoje : 0;
  const temAlvo = Number.isFinite(alvo) && alvo > 0;
  const diario = dias > 0 ? Math.ceil(falta / dias) / 100 : null;
  const mensal = dias > 0 ? Math.ceil((falta * diasPorMes) / dias) / 100 : null;
  const prazo =
    Number.isFinite(aporte) && centavos(aporte) > 0
      ? Math.ceil((falta * diasPorMes) / centavos(aporte))
      : null;

  return { hoje, data, alvo, aporte, falta, temAlvo, diario, mensal, prazo };
}

export default function MetasMudanca({
  usuario,
  dados,
  resumo,
  rotaPlano,
  rotaCustos,
  dataMudanca,
}) {
  const [params, setParams] = useSearchParams();
  const notificar = useAvisoPerfilA();
  const selecao = params.get('meta');
  const meta = dados.metas.find(item => String(item.id) === selecao);
  const rotaLista = new URLSearchParams(params);
  rotaLista.delete('meta');

  function rotaMeta(id) {
    const busca = new URLSearchParams(rotaLista);
    busca.set('meta', id);
    return '?' + busca;
  }

  if (meta || selecao === 'nova') {
    return (
      <>
        <Link className='meta-voltar' to={'?' + rotaLista}>
          <ArrowLeft size={17} aria-hidden='true' /> Todas as metas
        </Link>
        <EditorMeta
          key={selecao}
          inicial={meta ?? novaMeta}
          usuario={usuario}
          resumo={resumo}
          rotaPlano={rotaPlano}
          rotaCustos={rotaCustos}
          dataMudanca={dataMudanca}
          aoFinalizar={mensagem => {
            notificar(mensagem);
            setParams(rotaLista, { replace: true });
          }}
        />
      </>
    );
  }

  return (
    <section aria-label='Minhas metas' className='meta-cartoes'>
      {dados.metas.map(item => {
        const { alvo, falta, mensal, aporte, prazo } = calcularMeta(
          item,
          resumo
        );
        const valorMensal =
          falta === 0
            ? 0
            : item.modo === 'aporte'
              ? prazo == null
                ? null
                : aporte
              : mensal;
        const guardado = Math.min(resumo.reserva, alvo);
        return (
          <Link key={item.id} to={rotaMeta(item.id)} className='meta-cartao'>
            <div className='meta-cartao-imagem'>
              <img src={cofrinho} alt='' loading='lazy' />
            </div>
            <div className='meta-cartao-dados'>
              <h2>{item.nome}</h2>
              {alvo > 0 ? (
                <>
                  <strong>{moeda(alvo)}</strong>
                  <progress
                    value={guardado}
                    max={alvo}
                    aria-label={'Progresso de ' + item.nome}
                  />
                  <span>{moeda(guardado)} guardados</span>
                  {valorMensal != null && (
                    <p className='meta-cartao-mensal'>
                      <strong>{moeda(valorMensal)}</strong> por mês
                    </p>
                  )}
                </>
              ) : (
                <span>Valor a definir em Meu plano</span>
              )}
              <ArrowRight size={18} aria-hidden='true' />
            </div>
          </Link>
        );
      })}
      <Link className='meta-cartao-adicionar' to={rotaMeta('nova')}>
        <Plus size={38} strokeWidth={1.6} aria-hidden='true' /> Adicionar meta
      </Link>
    </section>
  );
}

function EditorMeta({
  inicial,
  usuario,
  resumo,
  rotaPlano,
  rotaCustos,
  dataMudanca,
  aoFinalizar,
}) {
  const servidor = useDadosServidor();
  const [salvando, setSalvando] = useState(false);
  const [rascunho, setRascunho] = useState(inicial);
  const [erro, setErro] = useState('');
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);
  const metaDaMudanca = rascunho.fonte === 'mudanca';
  const estimativaSalva =
    inicial.fonte === 'mudanca' && inicial.id && Number(inicial.alvo) > 0;
  const estimativa = estimativaSalva
    ? inicial.estimativaMudanca
    : resumo.estimativaMudanca;
  const metaParaCalculo = metaDaMudanca
    ? { ...rascunho, alvo: estimativaSalva ? inicial.alvo : '' }
    : rascunho;
  const { hoje, data, alvo, aporte, falta, temAlvo, diario, mensal, prazo } =
    calcularMeta(metaParaCalculo, resumo);

  function preencher(evento) {
    const { name, value } = evento.target;
    setRascunho(atual => ({
      ...atual,
      [name]: value,
      ...(name === 'data' && { meses: undefined }),
    }));
    setErro('');
  }

  async function salvar(evento) {
    evento.preventDefault();
    if (salvando) return;
    setSalvando(true);
    setErro('');
    try {
      if (!rascunho.nome.trim()) throw new Error('Dê um nome para a meta.');
      if (!temAlvo)
        throw new Error('Informe um valor maior que zero para a meta.');
      validarValor(alvo, 'a meta');
      if (rascunho.modo === 'prazo' && falta > 0 && mensal == null)
        throw new Error('Escolha uma data futura.');
      if (rascunho.modo === 'aporte' && falta > 0 && prazo == null)
        throw new Error('Informe quanto você pode guardar por mês.');
      if (rascunho.modo === 'aporte') validarValor(aporte, 'o valor mensal');
      const meta = {
          ...rascunho,
          alvo,
          estimativaMudanca: metaDaMudanca ? estimativa : undefined,
          data,
          meses: undefined,
          nome: rascunho.nome.trim(),
          aporte: rascunho.modo === 'aporte' ? aporte : null,
        };
      if (servidor) {
        const { id, nome, fonte, modo, estimativaMudanca } = meta;
        await salvarMetaMudanca(id, { nome, fonte, modo, alvo, data: data || null, aporte: meta.aporte, estimativaMudanca });
        await servidor.atualizar();
      } else alterarDinheiro(usuario, registro => {
        meta.id ??= proximoId(registro.metas);
        registro.metas = rascunho.id
          ? registro.metas.map(item => (item.id === meta.id ? meta : item))
          : [...registro.metas, meta];
      });
      aoFinalizar('Meta salva.');
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setSalvando(false);
    }
  }

  function fecharConfirmacao() {
    setConfirmarExclusao(false);
    setErro('');
  }

  async function remover() {
    if (salvando) return;
    setSalvando(true);
    setErro('');
    try {
      if (servidor) {
        await salvarMetaMudanca(rascunho.id);
        await servidor.atualizar();
      } else alterarDinheiro(usuario, registro => {
        registro.metas = registro.metas.filter(item => item.id !== rascunho.id);
      });
      aoFinalizar('Meta excluída.');
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className='dinheiro-metas'>
      <form className='dinheiro-painel dinheiro-form-meta' onSubmit={salvar}>
        <header className='dinheiro-painel-topo'>
          <h2>{rascunho.id ? 'Editar meta' : 'Nova meta'}</h2>
          {rascunho.id && (
            <button
              type='button'
              className='meta-excluir'
              aria-label='Excluir meta'
              title='Excluir meta'
              aria-haspopup='dialog'
              onClick={() => {
                setErro('');
                setConfirmarExclusao(true);
              }}
            >
              <Trash2 size={19} aria-hidden='true' />
            </button>
          )}
        </header>
        <label>
          Nome da meta
          <input
            name='nome'
            value={rascunho.nome}
            onChange={preencher}
            maxLength={100}
            required
          />
        </label>
        <label>
          Valor que quero atingir
          <select name='fonte' value={rascunho.fonte} onChange={preencher}>
            <option value='personalizada'>Definir meu valor</option>
            <option value='mudanca'>Usar o plano da mudança</option>
          </select>
        </label>
        {rascunho.fonte === 'personalizada' ? (
          <label>
            Valor da meta (R$)
            <input
              type='number'
              name='alvo'
              min='.01'
              max='9999999999.99'
              step='.01'
              value={rascunho.alvo}
              onChange={preencher}
              required
            />
          </label>
        ) : (
          <p>
            {estimativaSalva
              ? 'Valor definido ao salvar a meta: ' + moeda(alvo) + '.'
              : alvo > 0
                ? 'Meta estimada de ' + moeda(alvo) + '.'
                : 'Cadastre os custos previstos em Meu plano.'}{' '}
            {!estimativaSalva && <Link to={rotaPlano}>Abrir Meu plano</Link>}
          </p>
        )}
        <fieldset className='meta-modos'>
          <legend>Como você quer planejar?</legend>
          {[
            ['prazo', 'Tenho uma data', CalendarDays],
            ['aporte', 'Tenho um valor mensal', Wallet],
          ].map(([valor, rotulo, Icone]) => (
            <label key={valor}>
              <input
                type='radio'
                name='modo'
                value={valor}
                checked={rascunho.modo === valor}
                onChange={preencher}
              />
              <Icone size={19} aria-hidden='true' /> {rotulo}
            </label>
          ))}
        </fieldset>
        {rascunho.modo === 'prazo' ? (
          <div className='meta-data'>
            <label>
              Até quando quer juntar?
              <input
                type='date'
                name='data'
                value={data}
                onChange={preencher}
              />
            </label>
            {dataMudanca &&
              dataMudanca > formatarDia(hoje) &&
              data !== dataMudanca && (
                <button
                  type='button'
                  className='meta-usar-data'
                  onClick={() =>
                    preencher({ target: { name: 'data', value: dataMudanca } })
                  }
                >
                  Usar a data da mudança ({dataCurta(dataMudanca)})
                </button>
              )}
          </div>
        ) : (
          <label>
            Quanto pode guardar por mês? (R$)
            <input
              type='number'
              name='aporte'
              min='.01'
              max='9999999999.99'
              step='.01'
              placeholder={aporte > 0 ? String(aporte) : '0,00'}
              value={rascunho.aporte}
              onChange={preencher}
            />
            <small>
              Em branco, o cálculo usa o saldo atual de Meu dinheiro.
            </small>
          </label>
        )}
        {erro && !confirmarExclusao && <p role='alert'>{erro}</p>}
        <footer>
          <BotaoCasa type='submit' disabled={salvando}>Salvar meta</BotaoCasa>
        </footer>
      </form>
      <div className='dinheiro-meta-coluna'>
        <section
          className='dinheiro-meta-resultado meta-cofrinho'
          aria-labelledby='meta-cofrinho-titulo'
        >
          <div className='meta-cofrinho-topo'>
            <div>
              <h2 id='meta-cofrinho-titulo'>
                {rascunho.nome.trim() || 'Seu cofrinho'}
              </h2>
              <strong>{moeda(resumo.reserva)}</strong>
              <p>Reserva disponível</p>
            </div>
            <img src={cofrinho} alt='' width='384' height='384' />
          </div>
          {metaDaMudanca && estimativa && (
            <NotaEstimativa
              estimativa={estimativa}
              rotaCustos={estimativaSalva ? undefined : rotaCustos}
            />
          )}
          {temAlvo && (
            <div className='meta-progresso'>
              <progress
                value={Math.min(resumo.reserva, alvo)}
                max={alvo}
                aria-label='Progresso da meta'
              />
              <p>
                <span>{moeda(falta / 100)} para juntar</span>
                <span>Meta de {moeda(alvo)}</span>
              </p>
            </div>
          )}
          <div className='meta-previsao' aria-live='polite'>
            {!temAlvo ? (
              <p>Informe o valor da meta para ver a projeção.</p>
            ) : falta === 0 ? (
              <>
                <strong>Sua reserva já cobre a meta</strong>
                <ValoresEconomia mensal={0} diario={0} />
              </>
            ) : rascunho.modo === 'prazo' ? (
              mensal == null ? (
                <p>Escolha uma data futura para calcular quanto guardar.</p>
              ) : (
                <>
                  <p>
                    Para chegar lá até <strong>{dataCurta(data)}</strong>
                  </p>
                  <ValoresEconomia mensal={mensal} diario={diario} />
                  {resumo.renda != null && mensal > resumo.agora && (
                    <p>
                      O valor mensal supera o que sobra hoje em Meu dinheiro.
                    </p>
                  )}
                </>
              )
            ) : prazo == null ? (
              <p>Informe quanto pode guardar por mês.</p>
            ) : (
              <>
                <p>Tempo estimado para atingir a meta</p>
                <strong>
                  {prazo.toLocaleString('pt-BR')} {prazo === 1 ? 'dia' : 'dias'}
                </strong>
                <p>
                  {prazo === diasPorMes
                    ? 'Cerca de 1 mês'
                    : 'Cerca de ' +
                      (prazo / diasPorMes).toLocaleString('pt-BR', {
                        maximumFractionDigits: 2,
                      }) +
                      ' meses'}
                </p>
                <ValoresEconomia
                  mensal={aporte}
                  diario={Math.ceil(centavos(aporte) / diasPorMes) / 100}
                />
                {prazo <= 365000 && (
                  <p>
                    Previsão para {dataCurta(formatarDia(hoje + prazo))},
                    guardando {moeda(aporte)} por mês.
                  </p>
                )}
              </>
            )}
            <small>
              Estimativa em meses de 30 dias, com economia distribuída ao longo
              do período.
            </small>
          </div>
        </section>
      </div>
      {confirmarExclusao && (
        <DialogoFinancas
          titulo='Excluir meta?'
          Icone={Trash2}
          destrutivo
          aoFechar={fecharConfirmacao}
        >
          <p className='text-(--texto-apoio)'>
            A meta “{inicial.nome}” será removida da sua lista.
          </p>
          {erro && (
            <p role='alert' className='mt-3 text-(--vermelho-alerta)'>
              {erro}
            </p>
          )}
          <div className='finance-dialog-actions'>
            <AcaoFinancas secundario onClick={fecharConfirmacao}>
              Cancelar
            </AcaoFinancas>
            <AcaoFinancas classe='finance-dialog-delete' disabled={salvando} onClick={remover}>
              Excluir meta
            </AcaoFinancas>
          </div>
        </DialogoFinancas>
      )}
    </div>
  );
}
