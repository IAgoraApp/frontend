import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  dataCurta,
  hoje,
  moeda,
  salvarRegistro,
  useBancoMvp,
} from '../../app/dados/bancoMvp';
import { AbasMvp, ColecaoMvp, PaginaMvp, ResumoMvp } from '../../shared/ui/mvp';

export default function FinancasA() {
  const { b, perfil, transacoes } = useBancoMvp();
  const [params] = useSearchParams();
  const [mes, setMes] = useState(hoje().slice(0, 7));
  const [filtro, setFiltro] = useState('todos');
  const visao = params.get('visao') || 'lancamentos';
  const minhas = colecao =>
    b[colecao].filter(r => r.user_id === perfil.user_id);
  const categorias = minhas('categoria_financas');
  const contas = minhas('conta_financeira');
  const registros = transacoes.filter(t => t.competencia?.startsWith(mes));
  const receitas = registros
    .filter(t => t.tipo === 'receita' && t.status === 'pago')
    .reduce((s, t) => s + t.valor, 0);
  const despesas = registros
    .filter(t => t.tipo === 'despesa' && t.status === 'pago')
    .reduce((s, t) => s + t.valor, 0);
  const saldo =
    contas.reduce((s, c) => s + c.saldo_inicial, 0) +
    transacoes
      .filter(t => t.status === 'pago')
      .reduce((s, t) => s + (t.tipo === 'receita' ? t.valor : -t.valor), 0);
  const categoriaCampo = {
    nome: 'categoria_id',
    rotulo: 'Categoria',
    numero: true,
    opcoes: categorias.map(c => [c.id, c.nome]),
  };
  return (
    <PaginaMvp
      titulo='Seu dinheiro, às claras.'
      descricao='Contas, lançamentos e objetivos com os seus registros.'
    >
      <ResumoMvp
        itens={[
          ['Saldo das contas', moeda(saldo), 'Todos os movimentos pagos'],
          ['Receitas recebidas', moeda(receitas), `Competência ${mes}`],
          ['Despesas pagas', moeda(despesas), `Competência ${mes}`],
          [
            'Pendente no mês',
            moeda(
              registros
                .filter(t => t.tipo === 'despesa' && t.status === 'pendente')
                .reduce((s, t) => s + t.valor, 0)
            ),
          ],
        ]}
      />
      <AbasMvp
        caminho='/financas'
        atual={visao}
        itens={[
          ['lancamentos', 'Lançamentos'],
          ['contas', 'Contas'],
          ['orcamentos', 'Orçamentos'],
          ['metas', 'Metas'],
          ['categorias', 'Categorias'],
          ['recorrencias', 'Recorrências'],
        ]}
      />
      {['lancamentos', 'orcamentos'].includes(visao) && (
        <div className='mvp-busca'>
          <label>
            Mês de competência{' '}
            <input
              aria-label='Mês de competência'
              type='month'
              required
              value={mes}
              onChange={e => {
                if (e.target.value) setMes(e.target.value);
              }}
            />
          </label>
          {visao === 'lancamentos' && (
            <select
              aria-label='Situação dos lançamentos'
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
            >
              <option value='todos'>Todas as situações</option>
              <option value='pendente'>Pendentes</option>
              <option value='pago'>Pagos ou recebidos</option>
            </select>
          )}
        </div>
      )}
      {visao === 'contas' ? (
        <ColecaoMvp
          titulo='Contas financeiras'
          colecao='conta_financeira'
          registros={contas}
          padrao={{ user_id: perfil.user_id }}
          podeExcluir={false}
          campos={[
            { nome: 'nome', rotulo: 'Nome' },
            {
              nome: 'tipo',
              rotulo: 'Tipo',
              opcoes: [
                ['corrente', 'Conta corrente'],
                ['poupanca', 'Poupança'],
                ['carteira', 'Carteira'],
              ],
            },
            {
              nome: 'saldo_inicial',
              rotulo: 'Saldo inicial (R$)',
              tipo: 'number',
              min: -100000000,
            },
          ]}
          detalhe={c =>
            `Saldo: ${moeda(c.saldo_inicial + transacoes.filter(t => t.conta_id === c.id && t.status === 'pago').reduce((s, t) => s + (t.tipo === 'receita' ? t.valor : -t.valor), 0))}\nSaldo inicial: ${moeda(c.saldo_inicial)}`
          }
        />
      ) : visao === 'categorias' ? (
        <ColecaoMvp
          titulo='Categorias financeiras'
          colecao='categoria_financas'
          registros={categorias}
          padrao={{ user_id: perfil.user_id, icone: 'wallet', cor: '#102a43' }}
          podeExcluir={false}
          campos={[
            { nome: 'nome', rotulo: 'Nome' },
            { nome: 'cor', rotulo: 'Cor', tipo: 'color' },
          ]}
          detalhe={c =>
            `${transacoes.filter(t => t.categoria_id === c.id).length} lançamentos`
          }
        />
      ) : visao === 'metas' ? (
        <ColecaoMvp
          titulo='Metas financeiras'
          colecao='meta_financeira'
          registros={minhas('meta_financeira')}
          padrao={{ user_id: perfil.user_id, status: 'ativa', valor_atual: 0 }}
          campos={[
            { nome: 'nome', rotulo: 'Objetivo' },
            {
              nome: 'valor_atual',
              rotulo: 'Valor guardado (R$)',
              tipo: 'number',
            },
            {
              nome: 'valor_alvo',
              rotulo: 'Valor desejado (R$)',
              tipo: 'number',
              min: 0.01,
            },
            {
              nome: 'prazo',
              rotulo: 'Prazo',
              tipo: 'date',
              obrigatorio: false,
            },
            {
              nome: 'status',
              rotulo: 'Situação',
              opcoes: [
                ['ativa', 'Ativa'],
                ['concluida', 'Concluída'],
                ['cancelada', 'Cancelada'],
              ],
            },
          ]}
          detalhe={m => (
            <>
              <progress
                aria-label={`Progresso de ${m.nome}`}
                value={m.valor_atual}
                max={m.valor_alvo || 1}
              />
              <p>
                {moeda(m.valor_atual)} de {moeda(m.valor_alvo)} · {m.status}
                <br />
                {dataCurta(m.prazo)}
              </p>
            </>
          )}
        />
      ) : visao === 'orcamentos' ? (
        <ColecaoMvp
          titulo='Limites por categoria'
          colecao='orcamento'
          registros={minhas('orcamento')
            .filter(o => o.mes.startsWith(mes))
            .map(o => ({
              ...o,
              nome: categorias.find(c => c.id === o.categoria_id)?.nome,
            }))}
          padrao={{ user_id: perfil.user_id, mes: `${mes}-01` }}
          campos={[
            categoriaCampo,
            { nome: 'limite', rotulo: 'Limite mensal (R$)', tipo: 'number' },
          ]}
          detalhe={o => {
            const gasto = registros
              .filter(
                t => t.tipo === 'despesa' && t.categoria_id === o.categoria_id
              )
              .reduce((s, t) => s + t.valor, 0);
            return `${moeda(gasto)} em despesas / limite de ${moeda(o.limite)}\n${gasto > o.limite ? 'Limite ultrapassado' : `${moeda(o.limite - gasto)} disponíveis`}`;
          }}
          onSave={v => {
            if (
              minhas('orcamento').some(
                o =>
                  o.categoria_id === v.categoria_id &&
                  o.mes === v.mes &&
                  o.id !== v.id
              )
            )
              throw new Error(
                'Já existe orçamento para esta categoria neste mês.'
              );
            const { nome, ...registro } = v;
            void nome;
            salvarRegistro('orcamento', registro);
          }}
        />
      ) : visao === 'recorrencias' ? (
        <ColecaoMvp
          titulo='Lançamentos recorrentes'
          colecao='recorrencia_financeira'
          registros={minhas('recorrencia_financeira')}
          padrao={{ user_id: perfil.user_id, ativa: true, fim_em: null }}
          campos={[
            { nome: 'descricao', rotulo: 'Descrição' },
            {
              nome: 'tipo',
              rotulo: 'Tipo',
              opcoes: [
                ['receita', 'Receita'],
                ['despesa', 'Despesa'],
              ],
            },
            {
              nome: 'valor_previsto',
              rotulo: 'Valor previsto (R$)',
              tipo: 'number',
              min: 0.01,
            },
            {
              nome: 'frequencia',
              rotulo: 'Frequência',
              opcoes: [
                ['mensal', 'Mensal'],
                ['semanal', 'Semanal'],
                ['anual', 'Anual'],
              ],
            },
            { nome: 'inicio_em', rotulo: 'Início', tipo: 'date' },
            { nome: 'fim_em', rotulo: 'Fim', tipo: 'date', obrigatorio: false },
          ]}
          podeExcluir={false}
          detalhe={r =>
            `${moeda(r.valor_previsto)} · ${r.frequencia} · ${r.ativa ? 'Ativa' : 'Pausada'}`
          }
          onSave={v => {
            if (v.fim_em && v.fim_em < v.inicio_em)
              throw new Error(
                'A data final deve ser igual ou posterior à data inicial.'
              );
            salvarRegistro('recorrencia_financeira', v);
          }}
          acoes={r => (
            <button
              type='button'
              onClick={() =>
                salvarRegistro('recorrencia_financeira', {
                  ...r,
                  ativa: !r.ativa,
                })
              }
            >
              {r.ativa ? 'Pausar' : 'Ativar'}
            </button>
          )}
        />
      ) : (
        <ColecaoMvp
          titulo='Lançamentos do mês'
          colecao='transacao_financeira'
          registros={registros.filter(
            t => filtro === 'todos' || t.status === filtro
          )}
          padrao={{
            user_id: perfil.user_id,
            competencia: `${mes}-01`,
            status: 'pendente',
            pago_em: null,
            recorrencia_id: null,
          }}
          campos={[
            { nome: 'descricao', rotulo: 'Descrição' },
            {
              nome: 'tipo',
              rotulo: 'Tipo',
              opcoes: [
                ['receita', 'Receita'],
                ['despesa', 'Despesa'],
              ],
            },
            { nome: 'valor', rotulo: 'Valor (R$)', tipo: 'number', min: 0.01 },
            categoriaCampo,
            {
              nome: 'conta_id',
              rotulo: 'Conta',
              numero: true,
              opcoes: contas.map(c => [c.id, c.nome]),
            },
            { nome: 'competencia', rotulo: 'Competência', tipo: 'date' },
            { nome: 'vencimento', rotulo: 'Vencimento', tipo: 'date' },
          ]}
          detalhe={t =>
            `${moeda(t.valor)} · ${t.tipo === 'receita' ? 'Receita' : 'Despesa'} · ${t.status === 'pago' ? 'Pago / recebido' : 'Pendente'}\n${categorias.find(c => c.id === t.categoria_id)?.nome} · ${contas.find(c => c.id === t.conta_id)?.nome} · Vence ${dataCurta(t.vencimento)}`
          }
          acoes={t => (
            <button
              type='button'
              onClick={() =>
                salvarRegistro('transacao_financeira', {
                  ...t,
                  status: t.status === 'pago' ? 'pendente' : 'pago',
                  pago_em: t.status === 'pago' ? null : hoje(),
                })
              }
            >
              {t.status === 'pago'
                ? 'Voltar a pendente'
                : t.tipo === 'receita'
                  ? 'Receber'
                  : 'Pagar'}
            </button>
          )}
        />
      )}
    </PaginaMvp>
  );
}
