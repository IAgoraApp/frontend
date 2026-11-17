import { Link } from 'react-router-dom';
import { House, CalendarDays, Wallet, Store, Sparkles } from 'lucide-react';
import { dataCurta, moeda, useBancoMvp } from '../../app/dados/bancoMvp';
import { PaginaMvp, ResumoMvp, VazioMvp } from '../../shared/ui/mvp';
export default function InicioA() {
  const { b, perfil, casa, tarefas, limpezas, transacoes } = useBancoMvp();
  const pendencias = b.execucao_tarefa.filter(
    e => tarefas.some(t => t.id === e.tarefa_id) && e.status === 'pendente'
  );
  const contas = transacoes.filter(
    t => t.status === 'pendente' && t.tipo === 'despesa'
  );
  const saldo =
    b.conta_financeira
      .filter(c => c.user_id === perfil.user_id)
      .reduce((s, c) => s + c.saldo_inicial, 0) +
    transacoes
      .filter(t => t.status === 'pago')
      .reduce((s, t) => s + (t.tipo === 'receita' ? t.valor : -t.valor), 0);
  return (
    <PaginaMvp
      titulo={`Seu canto em dia, ${perfil.nome.split(' ')[0]}.`}
      descricao={`${casa.nome}. Veja o que precisa da sua atenção.`}
    >
      <ResumoMvp
        itens={[
          ['Tarefas pendentes', pendencias.length, 'Execuções da sua rotina'],
          [
            'Contas a pagar',
            moeda(contas.reduce((s, c) => s + c.valor, 0)),
            `${contas.length} lançamentos pendentes`,
          ],
          [
            'Saldo das contas',
            moeda(saldo),
            'Saldo inicial + movimentos pagos',
          ],
          ['Cuidados da casa', limpezas.length, 'Atividades cadastradas'],
        ]}
      />
      <nav className='mvp-atalhos' aria-label='Acessos rápidos'>
        {[
          [House, 'Minha casa', '/casa'],
          [CalendarDays, 'Minha rotina', '/rotina'],
          [Wallet, 'Finanças', '/financas'],
          [Store, 'Encontrar ajuda', '/marketplace'],
          [Sparkles, 'Conversar com a IA', '/ia'],
        ].map(([Icone, nome, rota]) => (
          <Link key={rota} to={rota}>
            <Icone size={19} />
            {nome}
          </Link>
        ))}
      </nav>
      <div className='mvp-grade'>
        <section className='mvp-painel'>
          <div className='mvp-painel-topo'>
            <h2>Próximas tarefas</h2>
            <Link className='mvp-link' to='/rotina'>
              Ver rotina
            </Link>
          </div>
          {!pendencias.length && (
            <VazioMvp>Você está em dia com as execuções de tarefas.</VazioMvp>
          )}
          {pendencias
            .slice()
            .sort((a, c) => a.data_prevista.localeCompare(c.data_prevista))
            .slice(0, 5)
            .map(e => (
              <div className='mvp-registro' key={e.id}>
                <strong>{tarefas.find(t => t.id === e.tarefa_id)?.nome}</strong>
                <span className='mvp-detalhe'>
                  {dataCurta(e.data_prevista)}
                </span>
              </div>
            ))}
        </section>
        <section className='mvp-painel'>
          <div className='mvp-painel-topo'>
            <h2>Contas para acompanhar</h2>
            <Link className='mvp-link' to='/financas'>
              Ver finanças
            </Link>
          </div>
          {!contas.length && <VazioMvp>Nenhuma conta pendente.</VazioMvp>}
          {contas.map(c => (
            <div className='mvp-registro' key={c.id}>
              <div>
                <strong>{c.descricao}</strong>
                <p className='mvp-detalhe'>
                  Vence em {dataCurta(c.vencimento)}
                </p>
              </div>
              <strong>{moeda(c.valor)}</strong>
            </div>
          ))}
        </section>
        <section className='mvp-painel'>
          <div className='mvp-painel-topo'>
            <h2>Cuidados do seu canto</h2>
            <Link className='mvp-link' to='/limpeza'>
              Organizar limpeza
            </Link>
          </div>
          {limpezas.slice(0, 4).map(l => (
            <div className='mvp-registro' key={l.id}>
              <strong>{l.nome}</strong>
              <span className='mvp-detalhe'>{dataCurta(l.proxima_vez)}</span>
            </div>
          ))}
        </section>
        <section className='mvp-painel'>
          <div className='mvp-painel-topo'>
            <h2>Suas metas</h2>
            <Link className='mvp-link' to='/financas?visao=metas'>
              Acompanhar
            </Link>
          </div>
          {b.meta_financeira
            .filter(m => m.user_id === perfil.user_id)
            .map(m => (
              <div className='mvp-conteudo' key={m.id}>
                <h3>{m.nome}</h3>
                <progress
                  aria-label={`Progresso de ${m.nome}`}
                  value={m.valor_atual}
                  max={m.valor_alvo || 1}
                />
                <p className='mvp-detalhe'>
                  {moeda(m.valor_atual)} de {moeda(m.valor_alvo)}
                </p>
              </div>
            ))}
        </section>
      </div>
    </PaginaMvp>
  );
}
