import { useState } from 'react';
import { Archive, Minus, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { alterarBancoCompras, inserir } from '../../app/dados/bancoMvp';
import { DialogoCasa } from '../casa/components/casaUi';
import { PaginaMvp } from '../../shared/ui/mvp';
import { normalizarTexto } from './content';
import { EditorCozinha } from './organizacaoCozinha';

export default function DespensaA({ banco, casaId }) {
  const [busca, setBusca] = useState('');
  const [remocao, setRemocao] = useState(null);
  const [erroRemocao, setErroRemocao] = useState('');
  const [editor, setEditor] = useState(null);
  const [erro, setErro] = useState('');
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

  function pedirRemocao(item) {
    setErroRemocao('');
    setRemocao(item);
  }

  function remover(item) {
    alterarBancoCompras(db => {
      const atual = db.estoque_item.find(
        e => e.id === item.id && e.casa_id === casaId
      );
      if (
        !atual ||
        atual.produto_id !== item.produto_id ||
        atual.quantidade !== item.quantidade
      )
        throw new Error(
          'O estoque mudou. Feche o aviso e atualize a quantidade novamente.'
        );
      db.estoque_item = db.estoque_item.filter(e => e !== atual);
    });
  }

  function ajustar(item, delta) {
    try {
      let removerAoZerar;

      alterarBancoCompras(db => {
        const atual = db.estoque_item.find(
          e => e.id === item.id && e.casa_id === casaId
        );
        if (!atual) throw new Error('O produto não está mais na despensa.');
        const quantidade = Math.min(
          99999999.99,
          Number((atual.quantidade + delta).toFixed(2))
        );
        if (quantidade <= 0) removerAoZerar = atual;
        else atual.quantidade = quantidade;
      });
      setErro('');
      if (removerAoZerar) pedirRemocao(removerAoZerar);
    } catch (falha) {
      setErro(falha.message);
    }
  }

  function salvar(item) {
    if (
      !Number.isFinite(item.quantidade) ||
      item.quantidade < 0 ||
      item.quantidade > 99999999.99
    )
      throw new Error('Informe uma quantidade de estoque válida.');

    const quantidade = Number(item.quantidade.toFixed(2));
    if (quantidade === 0) {
      const atual = estoque.find(e => e.id === item.id);
      if (!atual)
        throw new Error(
          'Informe uma quantidade maior que zero para adicionar o produto.'
        );
      pedirRemocao(atual);
      return;
    }

    alterarBancoCompras(db => {
      const duplicado = db.estoque_item.find(
        e =>
          e.casa_id === casaId &&
          e.produto_id === item.produto_id &&
          e.id !== item.id
      );
      if (item.id && duplicado)
        throw new Error(
          'Esse produto já está na despensa. Edite a quantidade dele.'
        );
      const atual = item.id
        ? db.estoque_item.find(e => e.id === item.id && e.casa_id === casaId)
        : duplicado;
      if (item.id && !atual)
        throw new Error('O produto não está mais na despensa.');
      const registro = {
        casa_id: casaId,
        produto_id: item.produto_id,
        quantidade,
      };
      if (atual) Object.assign(atual, registro);
      else inserir('estoque_item', registro, db);
    });
  }

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
            onClick={() => setEditor({ quantidade: 1 })}
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
        {erro && (
          <p className='cozinha-erro' role='alert'>
            {erro}
          </p>
        )}
        {itens.length ? (
          <ul className='despensa-grade'>
            {itens.map(item => {
              const produto = produtos.get(item.produto_id);
              const nome = produto?.nome || 'Produto indisponível';
              return (
                <li
                  key={item.id}
                  className='despensa-produto'
                  data-vazio={item.quantidade === 0}
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
                      aria-label={`Editar ${nome}`}
                      onClick={() => setEditor({ ...item, nome })}
                    >
                      <Pencil size={17} aria-hidden='true' />
                    </button>
                  </div>
                  <h2>{nome}</h2>
                  {produto?.marca && <p>{produto.marca}</p>}
                  <div className='despensa-produto-rodape'>
                    <span>
                      {item.quantidade === 0 ? 'Sem estoque' : 'Em estoque'}
                    </span>
                    <div
                      className='despensa-quantidade'
                      role='group'
                      aria-label={`Quantidade de ${nome}`}
                    >
                      <button
                        type='button'
                        aria-label={
                          item.quantidade === 0
                            ? `Remover ${nome} do estoque`
                            : `Diminuir ${nome}`
                        }
                        onClick={() => ajustar(item, -1)}
                      >
                        {item.quantidade === 0 ? (
                          <Trash2 size={16} aria-hidden='true' />
                        ) : (
                          <Minus size={16} aria-hidden='true' />
                        )}
                      </button>
                      <output>
                        {Number(item.quantidade).toLocaleString('pt-BR')}
                      </output>
                      <button
                        type='button'
                        aria-label={`Aumentar ${nome}`}
                        onClick={() => ajustar(item, 1)}
                      >
                        <Plus size={16} aria-hidden='true' />
                      </button>
                    </div>
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
        {remocao && (
          <DialogoCasa
            titulo='Remover do estoque?'
            aoFechar={() => setRemocao(null)}
          >
            <div className='cozinha-editor'>
              <p>
                Ao zerar a quantidade de{' '}
                <strong>
                  {produtos.get(remocao.produto_id)?.nome || 'este produto'}
                </strong>
                , você pode removê-lo da despensa. Quer remover?
              </p>
              {erroRemocao && (
                <p className='cozinha-erro' role='alert'>
                  {erroRemocao}
                </p>
              )}
              <div className='cozinha-editor-acoes'>
                <button
                  type='button'
                  className='cozinha-botao'
                  onClick={() => setRemocao(null)}
                >
                  Manter produto
                </button>
                <button
                  type='button'
                  className='cozinha-botao cozinha-perigo'
                  onClick={() => {
                    try {
                      remover(remocao);
                      setRemocao(null);
                    } catch (falha) {
                      setErroRemocao(falha.message);
                    }
                  }}
                >
                  Remover produto
                </button>
              </div>
            </div>
          </DialogoCasa>
        )}
        {editor && (
          <EditorCozinha
            titulo={
              editor.id ? 'Editar produto da despensa' : 'Adicionar produto'
            }
            inicial={editor}
            campos={[
              {
                nome: 'produto_id',
                rotulo: 'Produto',
                numero: true,
                opcoes: banco.produto.map(p => [
                  p.id,
                  [
                    p.nome,
                    p.marca,
                    p.tamanho ? `${p.tamanho} ${p.unidade || ''}` : '',
                  ]
                    .filter(Boolean)
                    .join(' / '),
                ]),
              },
              {
                nome: 'quantidade',
                rotulo: 'Quantidade em estoque',
                tipo: 'number',
                min: 0,
              },
            ]}
            aoSalvar={salvar}
            aoExcluir={editor.id ? () => remover(editor) : undefined}
            aoFechar={() => setEditor(null)}
          />
        )}
      </div>
    </PaginaMvp>
  );
}
