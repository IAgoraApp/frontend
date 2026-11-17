import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  alterarBanco,
  dataCurta,
  hoje,
  inserir,
  moeda,
  salvarRegistro,
  useBancoMvp,
} from '../../app/dados/bancoMvp';
import {
  ColecaoMvp,
  PaginaMvp,
  ResumoMvp,
  VazioMvp,
} from '../../shared/ui/mvp';

export default function CozinhaA() {
  const { b, casa, perfil } = useBancoMvp();
  const [params, setParams] = useSearchParams();
  const [busca, setBusca] = useState('');
  const visao = params.get('visao') || 'inicio';
  const listas = b.compras.filter(c => c.casa_id === casa.id);
  const lista =
    listas.find(c => c.id === Number(params.get('lista'))) ?? listas[0];
  const estoque = b.estoque_item.filter(e => e.casa_id === casa.id);
  const favoritas = b.receita_favorita.filter(
    f => f.user_id === perfil.user_id
  );
  const receitas = b.receitas.filter(
    r =>
      (r.user_id === perfil.user_id ||
        (r.publica && r.status === 'publicada')) &&
      (visao !== 'favoritas' || favoritas.some(f => f.receita_id === r.id)) &&
      r.nome.toLowerCase().includes(busca.toLowerCase())
  );
  const receita = receitas.find(r => r.id === Number(params.get('receita')));
  const produto = id => b.produto.find(p => p.id === id);
  const itens = b.compra_item.filter(i => i.compras_id === lista?.id);
  const titulo =
    {
      despensa: 'Minha despensa',
      compras: 'Lista de compras',
      favoritas: 'Receitas favoritas',
    }[visao] || 'O que vamos preparar?';
  function favoritar(r) {
    alterarBanco(db => {
      const atual = db.receita_favorita.find(
        f => f.receita_id === r.id && f.user_id === perfil.user_id
      );
      if (atual)
        db.receita_favorita = db.receita_favorita.filter(
          f => f.id !== atual.id
        );
      else
        inserir(
          'receita_favorita',
          { user_id: perfil.user_id, receita_id: r.id },
          db
        );
    });
  }
  return (
    <PaginaMvp
      titulo={titulo}
      descricao='Receitas, ingredientes e compras no mesmo lugar.'
    >
      {visao === 'despensa' ? (
        <>
          <ResumoMvp
            itens={[
              ['Produtos na despensa', estoque.length],
              ['Listas de compras', listas.length],
            ]}
          />
          <ColecaoMvp
            titulo='Produtos em casa'
            colecao='estoque_item'
            registros={estoque.map(e => ({
              ...e,
              nome: produto(e.produto_id)?.nome,
            }))}
            padrao={{ casa_id: casa.id }}
            campos={[
              {
                nome: 'produto_id',
                rotulo: 'Produto',
                numero: true,
                opcoes: b.produto.map(p => [p.id, `${p.nome} — ${p.marca}`]),
              },
              { nome: 'quantidade', rotulo: 'Quantidade', tipo: 'number' },
            ]}
            detalhe={e =>
              `${e.quantidade} unidades de ${produto(e.produto_id)?.tamanho} ${produto(e.produto_id)?.unidade}`
            }
            onSave={v => {
              const existente = estoque.find(
                e => e.produto_id === v.produto_id && e.id !== v.id
              );
              if (existente && v.id)
                throw new Error(
                  'Esse produto já está na despensa. Edite o registro existente.'
                );
              const { nome: _nome, ...registro } = v;
              void _nome;
              salvarRegistro(
                'estoque_item',
                existente
                  ? { ...existente, quantidade: v.quantidade }
                  : registro
              );
            }}
          />
        </>
      ) : visao === 'compras' ? (
        <>
          <ColecaoMvp
            titulo='Suas listas'
            colecao='compras'
            registros={listas}
            campos={[{ nome: 'nome', rotulo: 'Nome da lista' }]}
            padrao={{ casa_id: casa.id, criacao: hoje() }}
            detalhe={c =>
              `${dataCurta(c.criacao)} · ${b.compra_item.filter(i => i.compras_id === c.id).length} itens`
            }
            acoes={c => (
              <Link
                className='mvp-link'
                to={`/cozinha?visao=compras&lista=${c.id}`}
              >
                {c.id === lista?.id ? 'Lista aberta' : 'Abrir lista'}
              </Link>
            )}
          />
          {lista && (
            <>
              <ResumoMvp
                itens={[
                  [
                    'Itens comprados',
                    `${itens.filter(i => i.comprado).length} de ${itens.length}`,
                  ],
                  [
                    'Total previsto',
                    moeda(
                      itens.reduce(
                        (s, i) => s + i.quantidade * (i.valor || 0),
                        0
                      )
                    ),
                  ],
                ]}
              />
              <ColecaoMvp
                key={lista.id}
                titulo={lista.nome}
                colecao='compra_item'
                registros={itens}
                padrao={{
                  compras_id: lista.id,
                  produto_id: null,
                  comprado: false,
                  valor: 0,
                }}
                campos={[
                  { nome: 'nome_item', rotulo: 'Produto' },
                  {
                    nome: 'quantidade',
                    rotulo: 'Quantidade',
                    tipo: 'number',
                    min: 0.01,
                  },
                  {
                    nome: 'valor',
                    rotulo: 'Valor unitário (R$)',
                    tipo: 'number',
                  },
                ]}
                detalhe={i =>
                  `${i.quantidade} × ${moeda(i.valor)} · ${i.comprado ? 'Comprado' : 'A comprar'}`
                }
                acoes={i => (
                  <button
                    type='button'
                    onClick={() =>
                      salvarRegistro('compra_item', {
                        ...i,
                        comprado: !i.comprado,
                      })
                    }
                  >
                    {i.comprado ? 'Desmarcar' : 'Marcar comprado'}
                  </button>
                )}
              />
            </>
          )}
        </>
      ) : (
        <>
          <div className='mvp-busca'>
            <input
              aria-label='Buscar receitas'
              placeholder='Buscar uma receita pelo nome'
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
          </div>
          {receita && (
            <section className='mvp-painel'>
              <div className='mvp-painel-topo'>
                <h2>{receita.nome}</h2>
                <button
                  type='button'
                  className='mvp-link'
                  onClick={() => setParams({ visao })}
                >
                  Fechar receita
                </button>
              </div>
              <div className='mvp-conteudo'>
                <p>{receita.descricao}</p>
                <h3>Ingredientes</h3>
                {b.receita_item
                  .filter(i => i.receita_id === receita.id)
                  .map(i => (
                    <p key={i.id}>
                      {i.nome_item} — {i.quantidade}{' '}
                      {produto(i.produto_id)?.unidade || ''}
                    </p>
                  ))}
                <h3>Modo de preparo</h3>
                <p>{receita.preparo}</p>
              </div>
              {receita.user_id === perfil.user_id && (
                <ColecaoMvp
                  titulo='Ingredientes da minha receita'
                  colecao='receita_item'
                  registros={b.receita_item.filter(
                    i => i.receita_id === receita.id
                  )}
                  padrao={{ receita_id: receita.id, produto_id: null }}
                  campos={[
                    { nome: 'nome_item', rotulo: 'Ingrediente' },
                    {
                      nome: 'produto_id',
                      rotulo: 'Produto do catálogo (opcional)',
                      numero: true,
                      obrigatorio: false,
                      opcoes: b.produto.map(p => [
                        p.id,
                        `${p.nome} (${p.unidade})`,
                      ]),
                    },
                    {
                      nome: 'quantidade',
                      rotulo: 'Quantidade',
                      tipo: 'number',
                      min: 0.01,
                    },
                  ]}
                  detalhe={i =>
                    `${i.quantidade} ${produto(i.produto_id)?.unidade || ''}`
                  }
                />
              )}
            </section>
          )}
          <div className='mvp-grade'>
            <section className='mvp-painel'>
              <div className='mvp-painel-topo'>
                <h2>
                  {visao === 'favoritas'
                    ? 'Suas favoritas'
                    : 'Receitas disponíveis'}
                </h2>
              </div>
              {!receitas.length && (
                <VazioMvp>
                  Nenhuma receita encontrada. Favorite uma receita para vê-la
                  aqui.
                </VazioMvp>
              )}
              {receitas.map(r => (
                <div className='mvp-registro' key={r.id}>
                  <div>
                    <Link
                      className='mvp-link'
                      to={`/cozinha?visao=${visao}&receita=${r.id}`}
                    >
                      {r.nome}
                    </Link>
                    <p className='mvp-detalhe'>
                      {r.descricao}
                      <br />
                      {r.user_id === perfil.user_id
                        ? 'Sua receita'
                        : 'Receita pública'}{' '}
                      · {r.status}
                    </p>
                  </div>
                  <div className='mvp-acoes'>
                    <button
                      type='button'
                      aria-pressed={favoritas.some(f => f.receita_id === r.id)}
                      onClick={() => favoritar(r)}
                    >
                      {favoritas.some(f => f.receita_id === r.id)
                        ? 'Remover favorita'
                        : 'Favoritar'}
                    </button>
                  </div>
                </div>
              ))}
            </section>
            <ColecaoMvp
              titulo='Minhas receitas'
              colecao='receitas'
              registros={receitas.filter(r => r.user_id === perfil.user_id)}
              padrao={{
                user_id: perfil.user_id,
                publica: false,
                status: 'rascunho',
              }}
              campos={[
                { nome: 'nome', rotulo: 'Nome da receita' },
                { nome: 'descricao', rotulo: 'Descrição' },
                {
                  nome: 'tipo',
                  rotulo: 'Refeição',
                  opcoes: [
                    ['almoco', 'Almoço'],
                    ['jantar', 'Jantar'],
                    ['cafe_da_manha', 'Café da manhã'],
                    ['sobremesa', 'Sobremesa'],
                  ],
                },
                {
                  nome: 'preparo',
                  rotulo: 'Modo de preparo',
                  tipo: 'textarea',
                },
                {
                  nome: 'status',
                  rotulo: 'Situação',
                  opcoes: [
                    ['rascunho', 'Rascunho'],
                    ['publicada', 'Publicada'],
                    ['fazer', 'A fazer'],
                    ['fazendo', 'Fazendo'],
                    ['feita', 'Feita'],
                  ],
                },
              ]}
              detalhe={r => r.descricao}
            />
          </div>
        </>
      )}
    </PaginaMvp>
  );
}
