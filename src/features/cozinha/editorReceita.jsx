import { medidaProduto } from './catalogoProdutos';
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { salvarReceita, tiposReceita } from './receitasDados';

export default function EditorReceita({
  receita,
  itens,
  produtos,
  usuario,
  voltar,
  aoSalvar,
}) {
  const [ingredientes, setIngredientes] = useState(() =>
    itens.map(item => ({ ...item, chave: item.id }))
  );
  const [erro, setErro] = useState('');
  const visibilidade = receita?.status === 'publicada' ? 'privada' : 'rascunho';

  function atualizarIngrediente(chave, campo, valor) {
    setIngredientes(lista =>
      lista.map(item =>
        item.chave === chave ? { ...item, [campo]: valor } : item
      )
    );
  }

  function enviar(evento) {
    evento.preventDefault();
    const campos = new FormData(evento.currentTarget);
    const nome = campos.get('nome').trim();
    const preparo = campos.get('preparo').trim();
    const imagem = campos.get('imagem').trim();
    const modo = campos.get('visibilidade');

    if (!nome || !preparo) {
      setErro('Preencha o nome e o modo de preparo.');
      return;
    }
    if (imagem && !/^https?:\/\//i.test(imagem)) {
      setErro(
        'Informe um endereço de imagem que comece com https:// ou http://.'
      );
      return;
    }
    if (ingredientes.some(item => !item.produto_id && !item.nome_item.trim())) {
      setErro('Informe um nome ou escolha um produto para cada ingrediente.');
      return;
    }

    try {
      const id = salvarReceita(
        {
          ...(receita && { id: receita.id }),
          nome,
          preparo,
          descricao: campos.get('descricao').trim(),
          tipo: campos.get('tipo') || null,
          imagem: imagem || null,
          status: modo === 'rascunho' ? 'rascunho' : 'publicada',
        },
        ingredientes,
        usuario
      );
      aoSalvar(id);
    } catch (falha) {
      setErro(falha.message);
    }
  }

  return (
    <form className='receitas-editor' onSubmit={enviar}>
      <h1>{receita ? 'Editar receita' : 'Nova receita'}</h1>
      <fieldset>
        <legend>Sobre a receita</legend>
        <div className='receitas-campos'>
          <label>
            Nome da receita
            <input
              name='nome'
              defaultValue={receita?.nome}
              required
              maxLength={150}
            />
          </label>
          <label>
            Categoria
            <select name='tipo' defaultValue={receita?.tipo ?? ''}>
              <option value=''>Sem categoria</option>
              {Object.entries(tiposReceita).map(([id, nome]) => (
                <option value={id} key={id}>
                  {nome}
                </option>
              ))}
            </select>
          </label>
          <label>
            Descrição (opcional)
            <textarea
              name='descricao'
              defaultValue={receita?.descricao}
              rows={2}
            />
          </label>
          <label>
            Link da foto (opcional)
            <input
              name='imagem'
              type='url'
              defaultValue={receita?.imagem}
              placeholder='https://…'
              maxLength={500}
            />
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Ingredientes</legend>
        {ingredientes.map((item, indice) => (
          <fieldset className='receitas-ingrediente' key={item.chave}>
            <legend>Ingrediente {indice + 1}</legend>
            <label>
              Produto do catálogo
              <select
                value={item.produto_id ?? ''}
                onChange={e =>
                  atualizarIngrediente(item.chave, 'produto_id', e.target.value)
                }
              >
                <option value=''>Inserir manualmente</option>
                {produtos.map(produto => (
                  <option key={produto.id} value={produto.id}>
                    {produto.nome}
                    {produto.marca ? ' (' + produto.marca + ')' : ''}
                    {produto.tamanho
                      ? ` · ${produto.tamanho} ${produto.unidade || ''}`
                      : ''}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {item.produto_id
                ? 'Nome alternativo (opcional)'
                : 'Nome do ingrediente'}
              <input
                value={item.nome_item}
                onChange={e =>
                  atualizarIngrediente(item.chave, 'nome_item', e.target.value)
                }
                placeholder={
                  item.produto_id ? undefined : 'Ex.: farinha de trigo'
                }
                required={!item.produto_id}
                maxLength={150}
              />
            </label>
            <label>
              {item.produto_id
                ? `Quantidade (${medidaProduto(produtos.find(produto => String(produto.id) === String(item.produto_id)))})`
                : 'Quantidade'}
              <input
                type='number'
                inputMode='decimal'
                min='0.01'
                max='99999999.99'
                step='0.01'
                required
                value={item.quantidade}
                onChange={e =>
                  atualizarIngrediente(item.chave, 'quantidade', e.target.value)
                }
              />
            </label>
            <button
              type='button'
              className='receitas-icone'
              aria-label={`Remover ingrediente ${indice + 1}`}
              onClick={() =>
                setIngredientes(lista =>
                  lista.filter(i => i.chave !== item.chave)
                )
              }
            >
              <Trash2 size={18} aria-hidden='true' />
            </button>
          </fieldset>
        ))}
        <button
          type='button'
          className='receitas-botao'
          onClick={() => {
            const novo = {
              chave: crypto.randomUUID(),
              nome_item: '',
              quantidade: '',
              produto_id: '',
            };
            setIngredientes(lista => [...lista, novo]);
          }}
        >
          <Plus size={17} aria-hidden='true' /> Adicionar ingrediente
        </button>
      </fieldset>

      <fieldset>
        <legend>Preparo e visibilidade</legend>
        <label>
          Modo de preparo
          <textarea
            name='preparo'
            defaultValue={receita?.preparo}
            placeholder='Use uma linha para cada passo.'
            rows={5}
            required
          />
        </label>
        <label>
          Visibilidade
          <select name='visibilidade' defaultValue={visibilidade}>
            <option value='rascunho'>Rascunho</option>
            <option value='privada'>Privada — só você pode ver</option>
          </select>
        </label>
        {receita?.publica && (
          <p>Ao salvar, sua receita sai do catálogo público.</p>
        )}
      </fieldset>

      {erro && (
        <p className='receitas-erro' role='alert'>
          {erro}
        </p>
      )}
      <div className='receitas-acoes'>
        <button type='submit' className='receitas-botao receitas-primario'>
          Salvar receita
        </button>
        <Link className='receitas-botao' to={voltar}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}
