import { useState } from 'react';
import { alterarBancoCompras, inserir } from '../../app/dados/bancoMvp';
import { DialogoCasa } from '../casa/components/casaUi';
import { normalizarTexto } from './content';
import { medidaProduto, unidadesProduto } from './catalogoProdutos';

const limite = 99999999.99;
function decimal(valor) {
  const bruto = String(valor ?? '')
    .trim()
    .replace(',', '.');
  return /^\d+(\.\d{1,2})?$/.test(bruto) ? Number(bruto) : NaN;
}

export default function AdicionarProdutoDespensa({
  produtos,
  casaId,
  aoFechar,
  aoSalvar,
}) {
  const [personalizado, setPersonalizado] = useState(false);
  const [busca, setBusca] = useState('');
  const [produtoId, setProdutoId] = useState('');
  const [unidade, setUnidade] = useState('un');
  const [erro, setErro] = useState('');
  const selecionado = produtos.find(p => String(p.id) === produtoId);
  const filtrados = produtos.filter(p =>
    normalizarTexto([p.nome, p.marca].filter(Boolean).join(' ')).includes(
      normalizarTexto(busca)
    )
  );
  const disponiveis =
    selecionado && !filtrados.some(p => p.id === selecionado.id)
      ? [selecionado, ...filtrados]
      : filtrados;

  function salvar(evento) {
    evento.preventDefault();
    const soCatalogo = evento.nativeEvent.submitter?.value === 'catalogo';
    const dados = new FormData(evento.currentTarget);
    const texto = chave => String(dados.get(chave) ?? '').trim();
    try {
      const quantidade = soCatalogo ? null : decimal(texto('quantidade'));
      if (
        !soCatalogo &&
        (!Number.isFinite(quantidade) || quantidade <= 0 || quantidade > limite)
      )
        throw new Error(
          'Informe uma quantidade maior que zero, com até duas casas decimais.'
        );
      alterarBancoCompras(db => {
        let produto = db.produto.find(p => String(p.id) === produtoId);
        if (personalizado) {
          const nome = texto('nome');
          const marca = texto('marca');
          const tamanho = texto('tamanho') ? decimal(texto('tamanho')) : null;
          if (!nome) throw new Error('Informe o nome do produto.');
          if (
            tamanho !== null &&
            (!Number.isFinite(tamanho) || tamanho <= 0 || tamanho > limite)
          )
            throw new Error('Informe um tamanho de embalagem válido.');
          produto =
            db.produto.find(
              p =>
                normalizarTexto(p.nome) === normalizarTexto(nome) &&
                normalizarTexto(p.marca || '') === normalizarTexto(marca) &&
                (p.tamanho == null ? null : Number(p.tamanho)) === tamanho &&
                p.unidade === unidade
            ) ??
            inserir(
              'produto',
              { nome, marca: marca || null, tamanho, unidade, imagem: null },
              db
            );
        }
        if (!produto) throw new Error('Selecione um produto do catálogo.');
        if (soCatalogo) return;
        const estoque = db.estoque_item.find(
          item => item.casa_id === casaId && item.produto_id === produto.id
        );
        const total = Number(
          (Number(estoque?.quantidade ?? 0) + quantidade).toFixed(2)
        );
        if (total > limite)
          throw new Error('A quantidade total excede o limite do estoque.');
        if (estoque) estoque.quantidade = total;
        else
          inserir(
            'estoque_item',
            { casa_id: casaId, produto_id: produto.id, quantidade },
            db
          );
      });
      aoSalvar(
        soCatalogo ? 'Produto disponível no catálogo.' : 'Estoque atualizado.'
      );
    } catch (falha) {
      setErro(falha.message);
    }
  }

  return (
    <DialogoCasa titulo='Adicionar produto' aoFechar={aoFechar}>
      <form className='cozinha-editor despensa-form' onSubmit={salvar}>
        <div
          className='despensa-form-modos'
          role='group'
          aria-label='Origem do produto'
        >
          <button
            type='button'
            aria-pressed={!personalizado}
            onClick={() => {
              setPersonalizado(false);
              setErro('');
            }}
          >
            Escolher do catálogo
          </button>
          <button
            type='button'
            aria-pressed={personalizado}
            onClick={() => {
              setPersonalizado(true);
              setErro('');
            }}
          >
            Criar personalizado
          </button>
        </div>
        {personalizado ? (
          <div className='despensa-form-campos'>
            <label>
              Nome do produto
              <input name='nome' maxLength={150} required />
            </label>
            <label>
              Marca (opcional)
              <input name='marca' maxLength={100} />
            </label>
            <label>
              Unidade de medida
              <select
                value={unidade}
                onChange={e => setUnidade(e.target.value)}
              >
                {unidadesProduto.map(([id, rotulo]) => (
                  <option key={id} value={id}>
                    {rotulo}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Tamanho da embalagem (opcional)
              <input
                name='tamanho'
                inputMode='decimal'
                placeholder='Ex.: 500'
              />
            </label>
          </div>
        ) : (
          <>
            <label>
              Buscar no catálogo
              <input
                type='search'
                value={busca}
                onChange={e => setBusca(e.target.value)}
                placeholder='Nome ou marca do produto'
              />
            </label>
            <label>
              Produto
              <select
                value={produtoId}
                onChange={e => setProdutoId(e.target.value)}
                required
              >
                <option value=''>Selecione um produto</option>
                {disponiveis.map(p => (
                  <option key={p.id} value={p.id}>
                    {[
                      p.nome,
                      p.marca,
                      p.tamanho && `${p.tamanho} ${p.unidade || ''}`,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </option>
                ))}
              </select>
            </label>
            {!filtrados.length && (
              <p>
                Nenhum produto encontrado. Você pode cadastrar um personalizado.
              </p>
            )}
          </>
        )}
        <label>
          Quantidade a adicionar (
          {medidaProduto(personalizado ? { unidade } : selecionado)})
          <input
            name='quantidade'
            inputMode='decimal'
            placeholder='Ex.: 1,5'
            required
          />
        </label>
        <p>
          Se o produto já estiver na despensa, essa quantidade será somada ao
          estoque.
        </p>
        {erro && (
          <p role='alert' className='cozinha-erro'>
            {erro}
          </p>
        )}
        <div className='cozinha-editor-acoes'>
          {personalizado && (
            <button
              type='submit'
              value='catalogo'
              formNoValidate
              className='cozinha-botao'
            >
              Salvar só no catálogo
            </button>
          )}
          <button type='submit' className='mvp-primario'>
            Adicionar à despensa
          </button>
        </div>
      </form>
    </DialogoCasa>
  );
}
