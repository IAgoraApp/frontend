import { useState } from 'react';
import { Check, CreditCard } from 'lucide-react';
import { dataCurta, moeda } from '../../../app/dados/bancoMvp';
import { Botao, Titulo } from '../../../shared/ui';
import { EditorMvp } from '../../../shared/ui/mvp';
import { DialogoCasa } from '../../casa/components/casaUi';
import {
  atualizarCobranca,
  atualizarMetodo,
  cadastrarMetodoTeste,
  cancelarAssinatura,
  criarCobranca,
  emAndamento,
  salvarPlano,
} from '../perfilCobrancas';

const rotulos = {
  ativa: 'Ativa',
  pendente: 'Pendente',
  atrasada: 'Atrasada',
  cancelada: 'Cancelada',
  expirada: 'Expirada',
  pago: 'Pago',
  cancelado: 'Cancelado',
  recusado: 'Recusado',
};
const painel =
  'min-w-0 rounded-2xl border border-(--borda-suave) bg-white p-4 sm:p-6';
const nomeMetodo = m => m?.apelido || m?.bandeira || 'Cartão';

function Situacao({ valor }) {
  const positiva = valor === 'ativa' || valor === 'pago';
  return (
    <span
      className={
        'inline-flex rounded-full px-2.5 py-1 text-xs font-bold ' +
        (positiva
          ? 'bg-[#e7f5ed] text-(--verde-sucesso)'
          : 'bg-(--laranja-fundo) text-[#9d2c08]')
      }
    >
      {rotulos[valor] ?? valor}
    </span>
  );
}

export default function CobrancasPerfilA({ b, userId, visao, aoSalvar }) {
  const [modal, setModal] = useState(null);
  const [erro, setErro] = useState('');
  const assinaturas = b.assinatura
    .filter(a => a.user_id === userId)
    .sort((a, z) => z.inicio.localeCompare(a.inicio));
  const atual = assinaturas.find(a => emAndamento.includes(a.status));
  const planoAtual = b.plano_assinatura.find(p => p.id === atual?.plano_id);
  const pagamentos = b.pagamento
    .filter(p => p.user_id === userId)
    .sort((a, z) => z.criado_em.localeCompare(a.criado_em));
  const metodos = b.metodo_pagamento.filter(m => m.user_id === userId);
  const ativos = metodos.filter(m => m.ativo);
  const principal = ativos.find(m => m.principal) ?? ativos[0];
  const pendente = pagamentos.find(
    p => p.assinatura_id === atual?.id && p.status === 'pendente'
  );
  const registro = modal?.registro;

  function abrir(tipo, registro) {
    setErro('');
    setModal({ tipo, registro });
  }
  function executar(operacao, mensagem) {
    try {
      operacao();
      setModal(null);
      setErro('');
      aoSalvar(mensagem);
    } catch (falha) {
      setErro(falha.message);
    }
  }

  return (
    <div className='grid gap-4'>
      {visao === 'assinatura' ? (
        <>
          <section className='rounded-2xl bg-(--azul-titulo) p-5 text-white sm:p-6'>
            <div className='flex flex-wrap items-center justify-between gap-4'>
              <div>
                <p className='text-sm text-[#d8e5ee]'>Assinatura atual</p>
                <Titulo classe='mt-1 text-2xl font-extrabold text-white sm:text-3xl'>
                  {planoAtual?.nome ?? 'Sem assinatura'}
                </Titulo>
                {atual && (
                  <div className='mt-2 flex flex-wrap items-center gap-3'>
                    <Situacao valor={atual.status} />
                    <strong>{moeda(planoAtual?.preco)}</strong>
                  </div>
                )}
                {atual?.proxima_cobranca && (
                  <p className='mt-2 text-sm text-[#d8e5ee]'>
                    Próxima cobrança em {dataCurta(atual.proxima_cobranca)}
                  </p>
                )}
              </div>
              <Botao
                type='button'
                variante='contorno'
                classe='text-sm'
                onClick={() => abrir('planos')}
              >
                {atual ? 'Alterar plano' : 'Ver planos'}
              </Botao>
            </div>
            {atual && (
              <div className='mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/25 pt-3'>
                {pendente ? (
                  <button
                    type='button'
                    className='min-h-10 cursor-pointer text-sm font-bold text-[#ffcfb8] hover:underline'
                    onClick={() => abrir('pagamento', pendente)}
                  >
                    Ver cobrança pendente
                  </button>
                ) : (
                  ['pendente', 'atrasada'].includes(atual.status) && (
                    <button
                      type='button'
                      className='min-h-10 cursor-pointer text-sm font-bold text-[#ffcfb8] hover:underline'
                      onClick={() => abrir('cobranca', atual)}
                    >
                      Gerar cobrança de teste
                    </button>
                  )
                )}
                <button
                  type='button'
                  className='min-h-10 cursor-pointer text-sm font-bold text-[#ffcfb8] hover:underline'
                  onClick={() => abrir('cancelar', atual)}
                >
                  Cancelar assinatura
                </button>
              </div>
            )}
          </section>
          <section className={painel}>
            <Titulo classe='mb-3 text-xl font-extrabold'>
              Histórico de assinaturas
            </Titulo>
            {assinaturas.length ? (
              <ul className='divide-y divide-(--borda-suave)'>
                {assinaturas.map(a => (
                  <li key={a.id}>
                    <button
                      type='button'
                      className='flex min-h-14 w-full cursor-pointer flex-wrap items-center justify-between gap-2 rounded-lg px-2 py-2 text-left hover:bg-(--azul-fundo)'
                      onClick={() => abrir('assinatura', a)}
                    >
                      <span>
                        <strong className='block'>
                          {b.plano_assinatura.find(p => p.id === a.plano_id)
                            ?.nome ?? 'Plano'}
                        </strong>
                        <small className='text-(--texto-apoio)'>
                          Desde {dataCurta(a.inicio)}
                        </small>
                      </span>
                      <Situacao valor={a.status} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='text-sm text-(--texto-apoio)'>
                Seu histórico aparecerá depois da primeira contratação.
              </p>
            )}
          </section>
        </>
      ) : (
        <>
          <section className={painel}>
            <div className='mb-3 flex flex-wrap items-center justify-between gap-2'>
              <Titulo classe='text-xl font-extrabold'>
                Métodos de pagamento
              </Titulo>
              <Botao
                type='button'
                variante='contorno'
                classe='text-sm'
                onClick={() => abrir('novo-metodo')}
              >
                Adicionar cartão de teste
              </Botao>
            </div>
            {metodos.length ? (
              <ul className='grid gap-2 sm:grid-cols-2'>
                {metodos.map(m => (
                  <li key={m.id}>
                    <button
                      type='button'
                      className='flex h-full min-h-16 w-full cursor-pointer items-center gap-3 rounded-xl border border-(--borda-suave) px-3 py-2 text-left hover:bg-(--azul-fundo)'
                      onClick={() => abrir('metodo', m)}
                    >
                      <span className='grid size-9 shrink-0 place-items-center rounded-lg bg-(--laranja-fundo) text-[#9d2c08]'>
                        <CreditCard size={19} aria-hidden='true' />
                      </span>
                      <span className='min-w-0 flex-1'>
                        <strong className='block wrap-anywhere'>
                          {nomeMetodo(m)}
                        </strong>
                        <small className='text-(--texto-apoio)'>
                          {m.bandeira} · •••• {m.ultimos_digitos}
                        </small>
                      </span>
                      {(!m.ativo || m.principal) && (
                        <span className='text-xs font-bold text-(--texto-apoio)'>
                          {m.ativo ? 'Principal' : 'Desativado'}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='text-sm text-(--texto-apoio)'>
                Nenhum método cadastrado.
              </p>
            )}
          </section>
          <section className={painel}>
            <Titulo classe='mb-3 text-xl font-extrabold'>
              Histórico de cobranças
            </Titulo>
            {pagamentos.length ? (
              <ul className='divide-y divide-(--borda-suave)'>
                {pagamentos.map(p => (
                  <li key={p.id}>
                    <button
                      type='button'
                      className='flex min-h-14 w-full cursor-pointer flex-wrap items-center justify-between gap-2 rounded-lg px-2 py-2 text-left hover:bg-(--azul-fundo)'
                      onClick={() => abrir('pagamento', p)}
                    >
                      <span>
                        <strong className='block'>
                          {p.assinatura_id ? 'Assinatura' : 'Publicação'} ·{' '}
                          {moeda(p.valor)}
                        </strong>
                        <small className='text-(--texto-apoio)'>
                          {dataCurta(p.criado_em)}
                        </small>
                      </span>
                      <Situacao valor={p.status} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='text-sm text-(--texto-apoio)'>
                Nenhuma cobrança registrada.
              </p>
            )}
          </section>
        </>
      )}
      {modal && (
        <DialogoCasa
          titulo={
            {
              planos: 'Planos disponíveis',
              confirmar: 'Confirmar plano',
              cancelar: 'Cancelar assinatura?',
              cobranca: 'Gerar cobrança de teste',
              pagamento: 'Detalhes da cobrança',
              assinatura: 'Detalhes da assinatura',
              metodo: 'Método de pagamento',
              'novo-metodo': 'Adicionar cartão de teste',
              'editar-metodo': 'Editar apelido',
            }[modal.tipo]
          }
          aoFechar={() => setModal(null)}
        >
          {modal.tipo === 'planos' && (
            <div className='grid gap-3'>
              {b.plano_assinatura
                .filter(p => p.ativo)
                .map(p => (
                  <section
                    className='rounded-xl border border-(--borda-suave) p-4'
                    key={p.id}
                  >
                    <div className='flex flex-wrap justify-between gap-2'>
                      <h3 className='font-titulo text-lg font-bold'>
                        {p.nome}
                      </h3>
                      <strong>{moeda(p.preco)}</strong>
                    </div>
                    {p.descricao && (
                      <p className='mt-1 text-sm text-(--texto-apoio)'>
                        {p.descricao}
                      </p>
                    )}
                    <ul className='my-2 grid gap-1 text-sm'>
                      {p.beneficios?.map(item => (
                        <li key={item} className='flex items-center gap-1.5'>
                          <Check size={15} aria-hidden='true' />
                          {item}
                        </li>
                      ))}
                    </ul>
                    {p.id === atual?.plano_id ? (
                      <p className='text-sm font-bold text-(--verde-sucesso)'>
                        Seu plano atual
                      </p>
                    ) : (
                      <Botao
                        type='button'
                        variante='contorno'
                        classe='text-sm'
                        onClick={() => abrir('confirmar', p)}
                      >
                        Escolher {p.nome}
                      </Botao>
                    )}
                  </section>
                ))}
            </div>
          )}
          {modal.tipo === 'confirmar' && (
            <>
              <p>
                O plano <strong>{registro.nome}</strong> fica pendente até a
                confirmação da cobrança de teste.
              </p>
              <div className='mt-4 flex flex-wrap justify-end gap-2'>
                <Botao
                  type='button'
                  variante='contorno'
                  onClick={() => abrir('planos')}
                >
                  Voltar
                </Botao>
                <Botao
                  type='button'
                  onClick={() =>
                    executar(
                      () => salvarPlano(userId, registro.id),
                      'Plano selecionado. Gere uma cobrança para concluir o teste.'
                    )
                  }
                >
                  Confirmar plano
                </Botao>
              </div>
            </>
          )}
          {modal.tipo === 'cancelar' && (
            <>
              <p>
                O cancelamento encerra a assinatura e cancela as cobranças
                pendentes. Pagamentos anteriores ficam no histórico.
              </p>
              <div className='mt-4 flex flex-wrap justify-end gap-2'>
                <Botao
                  type='button'
                  variante='contorno'
                  onClick={() => setModal(null)}
                >
                  Manter assinatura
                </Botao>
                <Botao
                  type='button'
                  classe='bg-(--vermelho-alerta)!'
                  onClick={() =>
                    executar(
                      () => cancelarAssinatura(userId, registro.id),
                      'Assinatura cancelada no ambiente de teste.'
                    )
                  }
                >
                  Confirmar cancelamento
                </Botao>
              </div>
            </>
          )}
          {modal.tipo === 'cobranca' && (
            <div className='perfil-editor'>
              <p className='mb-4 text-sm text-(--texto-apoio)'>
                Cobrança simulada de {moeda(planoAtual?.preco)}.
              </p>
              {Number(planoAtual?.preco) > 0 && !ativos.length ? (
                <Botao type='button' onClick={() => abrir('novo-metodo')}>
                  Adicionar cartão de teste
                </Botao>
              ) : (
                <EditorMvp
                  cabecalho={false}
                  campos={
                    Number(planoAtual?.preco) > 0
                      ? [
                          {
                            nome: 'metodo_id',
                            rotulo: 'Método de pagamento',
                            numero: true,
                            opcoes: ativos.map(m => [
                              m.id,
                              nomeMetodo(m) + ' · •••• ' + m.ultimos_digitos,
                            ]),
                          },
                        ]
                      : []
                  }
                  inicial={{
                    metodo_id:
                      Number(planoAtual?.preco) > 0 ? principal?.id : null,
                  }}
                  rotuloSalvar='Gerar cobrança'
                  onClose={() => setModal(null)}
                  onSave={v => {
                    criarCobranca(userId, registro.id, v.metodo_id);
                    aoSalvar('Cobrança de teste gerada.');
                  }}
                />
              )}
            </div>
          )}
          {modal.tipo === 'assinatura' && (
            <dl className='grid gap-3 text-sm'>
              <div>
                <dt>Plano</dt>
                <dd className='font-bold'>
                  {b.plano_assinatura.find(p => p.id === registro.plano_id)
                    ?.nome ?? 'Plano'}
                </dd>
              </div>
              <div>
                <dt>Situação</dt>
                <dd>
                  <Situacao valor={registro.status} />
                </dd>
              </div>
              <div>
                <dt>Início</dt>
                <dd>{dataCurta(registro.inicio)}</dd>
              </div>
              {registro.cancelada_em && (
                <div>
                  <dt>Cancelada em</dt>
                  <dd>{dataCurta(registro.cancelada_em)}</dd>
                </div>
              )}
            </dl>
          )}
          {modal.tipo === 'pagamento' && (
            <>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <strong className='font-titulo text-2xl'>
                  {moeda(registro.valor)}
                </strong>
                <Situacao valor={registro.status} />
              </div>
              <dl className='mt-3 grid gap-2 text-sm text-(--texto-apoio)'>
                <div>
                  <dt>Criada em</dt>
                  <dd className='font-bold'>{dataCurta(registro.criado_em)}</dd>
                </div>
                {registro.pago_em && (
                  <div>
                    <dt>Paga em</dt>
                    <dd className='font-bold'>{dataCurta(registro.pago_em)}</dd>
                  </div>
                )}
                {registro.metodo_id && (
                  <div>
                    <dt>Método</dt>
                    <dd>
                      {nomeMetodo(
                        metodos.find(m => m.id === registro.metodo_id)
                      )}
                    </dd>
                  </div>
                )}
              </dl>
              {registro.status === 'pendente' &&
                registro.gateway === 'mock' &&
                registro.assinatura_id && (
                  <div className='mt-4 flex flex-wrap justify-end gap-2'>
                    <Botao
                      type='button'
                      variante='contorno'
                      onClick={() =>
                        executar(
                          () => atualizarCobranca(userId, registro.id, false),
                          'Cobrança cancelada.'
                        )
                      }
                    >
                      Cancelar cobrança
                    </Botao>
                    <Botao
                      type='button'
                      onClick={() =>
                        executar(
                          () => atualizarCobranca(userId, registro.id, true),
                          'Pagamento de teste confirmado.'
                        )
                      }
                    >
                      Confirmar pagamento de teste
                    </Botao>
                  </div>
                )}
            </>
          )}
          {modal.tipo === 'metodo' && (
            <>
              <p className='font-bold'>
                {nomeMetodo(registro)} · {registro.bandeira} ••••{' '}
                {registro.ultimos_digitos}
              </p>
              {registro.validade_mes && registro.validade_ano && (
                <p className='mt-1 text-sm text-(--texto-apoio)'>
                  Validade {String(registro.validade_mes).padStart(2, '0')}/
                  {registro.validade_ano}
                </p>
              )}
              {registro.ativo ? (
                <div className='mt-4 flex flex-wrap gap-2'>
                  <Botao
                    type='button'
                    variante='contorno'
                    onClick={() => abrir('editar-metodo', registro)}
                  >
                    Editar apelido
                  </Botao>
                  {!registro.principal && (
                    <Botao
                      type='button'
                      variante='contorno'
                      onClick={() =>
                        executar(
                          () =>
                            atualizarMetodo(userId, registro.id, 'principal'),
                          'Método definido como principal.'
                        )
                      }
                    >
                      Definir como principal
                    </Botao>
                  )}
                  <Botao
                    type='button'
                    variante='contorno'
                    onClick={() =>
                      executar(
                        () => atualizarMetodo(userId, registro.id, 'desativar'),
                        'Método desativado.'
                      )
                    }
                  >
                    Desativar
                  </Botao>
                </div>
              ) : (
                <p className='mt-2 text-sm text-(--texto-apoio)'>
                  Método desativado.
                </p>
              )}
            </>
          )}
          {['novo-metodo', 'editar-metodo'].includes(modal.tipo) && (
            <div className='perfil-editor'>
              {modal.tipo === 'novo-metodo' && (
                <p className='mb-4 text-sm text-(--texto-apoio)'>
                  Use somente dados fictícios. O cartão é simulado.
                </p>
              )}
              <EditorMvp
                cabecalho={false}
                inicial={registro ?? {}}
                campos={[
                  { nome: 'apelido', rotulo: 'Apelido', limite: 100 },
                  ...(modal.tipo === 'novo-metodo'
                    ? [
                        {
                          nome: 'bandeira',
                          rotulo: 'Bandeira',
                          opcoes: [
                            ['Visa', 'Visa'],
                            ['Mastercard', 'Mastercard'],
                            ['Elo', 'Elo'],
                          ],
                        },
                        {
                          nome: 'ultimos_digitos',
                          rotulo: 'Quatro dígitos fictícios',
                          limite: 4,
                        },
                      ]
                    : []),
                ]}
                rotuloSalvar={
                  modal.tipo === 'novo-metodo'
                    ? 'Adicionar cartão'
                    : 'Salvar apelido'
                }
                onClose={() => setModal(null)}
                onSave={dados => {
                  if (modal.tipo === 'novo-metodo')
                    cadastrarMetodoTeste(userId, dados);
                  else
                    atualizarMetodo(
                      userId,
                      registro.id,
                      'apelido',
                      dados.apelido
                    );
                  aoSalvar(
                    modal.tipo === 'novo-metodo'
                      ? 'Cartão de teste adicionado.'
                      : 'Apelido atualizado.'
                  );
                }}
              />
            </div>
          )}
          {erro && (
            <p role='alert' className='mt-3 text-sm text-(--vermelho-alerta)'>
              {erro}
            </p>
          )}
        </DialogoCasa>
      )}
    </div>
  );
}
