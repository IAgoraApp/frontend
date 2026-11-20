import { useState } from 'react';
import { Link } from 'react-router-dom';
import { dataCurta, moeda } from '../../../app/dados/bancoMvp';
import { EditorMvp, VazioMvp } from '../../../shared/ui/mvp';

export default function PublicacoesEmpresa({
  b,
  empresa,
  servico,
  executar,
  operacoes,
}) {
  const [agora] = useState(Date.now);
  const publicacoes = b.publicacao_servico
    .filter(p => p.servico_id === servico.id)
    .toReversed();
  const planos = b.plano_publicacao.filter(p => p.ativo);
  const metodos = b.metodo_pagamento.filter(
    m => m.ativo && m.user_id === empresa.user_id
  );
  const podePublicar = empresa.validado && servico.validado && servico.ativo;
  const aberta = publicacoes.some(p => p.status === 'pendente');
  const vigente = publicacoes.find(
    p => p.status === 'ativa' && Date.parse(p.fim) > agora
  );

  return (
    <section className='mvp-painel grid gap-4'>
      <div className='mvp-painel-topo'>
        <h2>Publicações</h2>
      </div>
      {!publicacoes.length && (
        <VazioMvp>Ainda não há publicações para este serviço.</VazioMvp>
      )}
      {!podePublicar && (
        <p className='text-sm text-(--texto-apoio)'>
          Para publicar, o perfil e o serviço precisam estar aprovados e o
          serviço precisa estar ativo.
        </p>
      )}
      {podePublicar && !aberta && !vigente && !!planos.length && (
        <EditorMvp
          cabecalho={false}
          mostrarCancelar={false}
          rotuloSalvar='Contratar publicação'
          campos={[
            {
              nome: 'plano',
              rotulo: 'Plano de publicação',
              numero: true,
              opcoes: planos.map(p => [
                p.id,
                `${p.nome} · ${p.duracao_dias} dias · ${moeda(p.preco)}`,
              ]),
            },
          ]}
          onSave={({ plano }) => operacoes.contratar(plano)}
        />
      )}
      {!!publicacoes.length && (
        <ul className='divide-y divide-(--borda-suave)'>
          {publicacoes.map(p => {
            const expirada = p.status === 'ativa' && Date.parse(p.fim) <= agora;
            const agenda = p.status === 'ativa' && Date.parse(p.inicio) > agora;
            const status = expirada
              ? 'Encerrada'
              : agenda
                ? 'Agendada'
                : ({
                    ativa: 'Ativa',
                    pendente: 'Pendente',
                    cancelada: 'Cancelada',
                  }[p.status] ?? p.status);
            const cobranca = b.pagamento.find(
              c =>
                c.publicacao_id === p.id &&
                c.user_id === empresa.user_id &&
                c.status === 'pendente'
            );
            const plano = b.plano_publicacao.find(
              plano => plano.id === p.plano_id
            );
            return (
              <li key={p.id} className='grid gap-2 py-3'>
                <div className='mercado-a-cartao-meta'>
                  <strong>{plano?.nome ?? 'Plano de publicação'}</strong>
                  <span className='mercado-a-nota'>{status}</span>
                </div>
                <p>
                  {moeda(p.valor)}
                  {p.inicio &&
                    ` · ${dataCurta(p.inicio)} a ${dataCurta(p.fim)}`}
                </p>
                {p.status === 'pendente' &&
                  (cobranca ? (
                    <Link
                      className='mvp-link justify-self-start'
                      to='/empresa/perfil?visao=pagamentos'
                    >
                      Ver cobrança em Pagamentos
                    </Link>
                  ) : metodos.length ? (
                    <EditorMvp
                      cabecalho={false}
                      mostrarCancelar={false}
                      rotuloSalvar='Gerar cobrança de teste'
                      campos={[
                        {
                          nome: 'metodo',
                          rotulo: 'Método de pagamento',
                          numero: true,
                          opcoes: metodos.map(m => [m.id, m.apelido || m.tipo]),
                        },
                      ]}
                      onSave={({ metodo }) => operacoes.cobrar(p.id, metodo)}
                    />
                  ) : (
                    <Link
                      className='mvp-link justify-self-start'
                      to='/empresa/perfil?visao=pagamentos'
                    >
                      Cadastrar método de pagamento
                    </Link>
                  ))}
                <div className='mercado-a-contato-acoes'>
                  {podePublicar &&
                    !aberta &&
                    plano?.ativo &&
                    (p === vigente ||
                      (!vigente && p === publicacoes[0] && expirada)) && (
                      <button
                        className='mvp-link'
                        type='button'
                        onClick={() =>
                          executar(
                            () => operacoes.contratar(null, p.id),
                            'Renovação criada.'
                          )
                        }
                      >
                        Renovar publicação
                      </button>
                    )}
                  {['pendente', 'ativa'].includes(p.status) && !expirada && (
                    <button
                      className='mvp-link'
                      type='button'
                      onClick={() => operacoes.confirmarCancelamento(p.id)}
                    >
                      Cancelar publicação
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
