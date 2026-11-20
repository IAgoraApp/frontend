import { useDadosServidor } from '../../app/dados/contextoServidor';
import { salvarEstoque } from './cozinhaApi';
import { useAvisoPerfilA } from '../../app/avisos/avisosPerfilA';
import { useState } from 'react';
import { Archive, Pencil, Plus, Search, X } from 'lucide-react';
import { alterarBancoCompras, useBancoMvp } from '../../app/dados/bancoMvp';
import { PaginaMvp } from '../../shared/ui/mvp';
import { normalizarTexto } from './content';
import { EditorCozinha } from './organizacaoCozinha';
import AdicionarProdutoDespensa from './adicionarProdutoDespensa';
import { medidaProduto } from './catalogoProdutos';
import './organizacaoCozinha.css';

export default function DespensaA() {
  const { b: banco, casa } = useBancoMvp();
  const casaId = casa?.id;
  const servidor = useDadosServidor();
  const [busca, setBusca] = useState('');
  const notificar = useAvisoPerfilA();
  const [editor, setEditor] = useState(null);
  const [adicionando, setAdicionando] = useState(false);
  const produtos = new Map(banco.produto.map(p => [p.id, p]));
  const estoque = banco.estoque_item.filter(item => item.casa_id === casaId);
  const itens = estoque
    .filter(item => {
      const produto = produtos.get(item.produto_id);
      return normalizarTexto(
        [produto?.nome, produto?.marca].filter(Boolean).join(' ')
      ).includes(normalizarTexto(busca));
    })
    .sort((a, b) =>
      (produtos.get(a.produto_id)?.nome || '').localeCompare(
        produtos.get(b.produto_id)?.nome || '',
        'pt-BR'
      )
    );

  async function remover(item) {
    if (servidor) {
      await salvarEstoque(item.id);
      await servidor.atualizar();
    } else alterarBancoCompras(db => {
      const atual = db.estoque_item.find(
        e => e.id === item.id && e.casa_id === casaId
      );
      if (!atual || atual.quantidade !== item.quantidade)
        throw new Error('O estoque mudou. Reabra o produto antes de remover.');
      db.estoque_item = db.estoque_item.filter(e => e !== atual);
    });
    notificar('Produto removido da despensa.');
  }

  async function salvar(item) {
    if (
      !Number.isFinite(item.quantidade) ||
      item.quantidade < 0 ||
      item.quantidade > 99999999.99
    )
      throw new Error('Informe uma quantidade de estoque válida.');
    if (servidor) {
      await salvarEstoque(item.id, { quantidade: Number(item.quantidade.toFixed(2)) });
      await servidor.atualizar();
    } else alterarBancoCompras(db => {
      const atual = db.estoque_item.find(
        e => e.id === item.id && e.casa_id === casaId
      );
      if (!atual) throw new Error('O produto não está mais na despensa.');
      if (atual.quantidade !== editor.quantidade)
        throw new Error(
          'O estoque mudou. Reabra o produto para editar a quantidade.'
        );
      atual.quantidade = Number(item.quantidade.toFixed(2));
    });
    notificar('Quantidade atualizada.');
  }

  if (!casaId)
    return (
      <PaginaMvp
        titulo='Minha despensa'
        descricao='Cadastre sua casa para começar a organizar a despensa.'
      />
    );

  return (
    <PaginaMvp cabecalho={false}>
      <div className='cozinha-organizacao'>
        <header className='cozinha-topo'>
          <div>
            <h1>Minha despensa</h1>
            <p>Acompanhe os produtos e ajuste as quantidades conforme usar.</p>
          </div>
          <button
            className='mvp-primario'
            type='button'
            onClick={() => setAdicionando(true)}
          >
            <Plus size={18} aria-hidden='true' /> Adicionar produto
          </button>
        </header>
        <div className='cozinha-prateleira'>
          <div className='cozinha-busca'>
            <Search size={19} aria-hidden='true' />
            <input
              type='search'
              aria-label='Buscar na despensa'
              placeholder='Buscar por produto ou marca'
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
            {busca && (
              <button
                type='button'
                className='cozinha-icone'
                aria-label='Limpar busca'
                onClick={e => {
                  e.currentTarget.previousElementSibling.focus();
                  setBusca('');
                }}
              >
                <X size={17} aria-hidden='true' />
              </button>
            )}
          </div>
          <span className='cozinha-contagem' role='status'>
            {itens.length} {itens.length === 1 ? 'produto' : 'produtos'}
          </span>
        </div>
        {itens.length ? (
          <ul className='despensa-grade'>
            {itens.map(item => {
              const produto = produtos.get(item.produto_id);
              const nome = produto?.nome || 'Produto indisponível';
              return (
                <li
                  key={item.id}
                  className='despensa-produto'
                  data-vazio={Number(item.quantidade) === 0}
                >
                  <div className='despensa-produto-topo'>
                    <span className='despensa-embalagem'>
                      <Archive size={17} aria-hidden='true' />
                      {produto?.tamanho && produto?.unidade && (
                        <span>
                          {produto.tamanho} {produto.unidade}
                        </span>
                      )}
                    </span>
                    <button
                      type='button'
                      className='cozinha-icone'
                      aria-label={`Editar quantidade de ${nome}`}
                      onClick={() => setEditor({ ...item, nome })}
                    >
                      <Pencil size={17} aria-hidden='true' />
                    </button>
                  </div>
                  <h2>{nome}</h2>
                  {produto?.marca && <p>{produto.marca}</p>}
                  <div className='despensa-produto-rodape'>
                    <span>
                      {Number(item.quantidade) === 0
                        ? 'Sem estoque'
                        : 'Em estoque'}
                    </span>
                    <output className='despensa-quantidade'>
                      {Number(item.quantidade).toLocaleString('pt-BR')}{' '}
                      {medidaProduto(produto)}
                    </output>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className='cozinha-vazio'>
            {estoque.length
              ? 'Nenhum produto corresponde à busca.'
              : 'Use Adicionar produto para começar a organizar a despensa.'}
          </p>
        )}
        {adicionando && (
          <AdicionarProdutoDespensa
            produtos={banco.produto}
            casaId={casaId}
            aoFechar={() => setAdicionando(false)}
            aoSalvar={mensagem => {
              setAdicionando(false);
              notificar(mensagem);
            }}
          />
        )}
        {editor && (
          <EditorCozinha
            titulo={`Estoque de ${editor.nome}`}
            inicial={editor}
            campos={[
              {
                nome: 'quantidade',
                rotulo: `Quantidade em estoque (${medidaProduto(produtos.get(editor.produto_id))})`,
                tipo: 'number',
                min: 0,
              },
            ]}
            aoSalvar={salvar}
            aoExcluir={() => remover(editor)}
            aoFechar={() => setEditor(null)}
          />
        )}
      </div>
    </PaginaMvp>
  );
}
