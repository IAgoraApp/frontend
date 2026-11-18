import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Pencil,
  Plus,
  ShoppingBasket,
} from 'lucide-react';
import {
  alterarBancoCompras,
  dataCurta,
  hoje,
  inserir,
} from '../../app/dados/bancoMvp';
import { PaginaMvp } from '../../shared/ui/mvp';
import { EditorCozinha } from './organizacaoCozinha';

const rotaCompras = '/cozinha?visao=compras';
const camposLista = [{ nome: 'nome', rotulo: 'Nome da lista' }];

export default function ComprasA({ banco, casaId }) {
  const [params, setParams] = useSearchParams();
  const [editor, setEditor] = useState(null);
  const [erro, setErro] = useState('');
  const listas = banco.compras.filter(item => item.casa_id === casaId);
  const lista = listas.find(item => item.id === Number(params.get('lista')));
  const itens = banco.compra_item.filter(item => item.compras_id === lista?.id);
  const produtos = new Map(banco.produto.map(item => [item.id, item]));
  const nomeItem = item =>
    item.nome_item || produtos.get(item.produto_id)?.nome || 'Item sem nome';
  const feitos = itens.filter(item => item.comprado).length;
  const camposItem = [
    { nome: 'nome_item', rotulo: 'Nome do item', obrigatorio: false },
    {
      nome: 'produto_id',
      rotulo: 'Produto do catálogo',
      obrigatorio: false,
      numero: true,
      opcoes: banco.produto.map(p => [
        p.id,
        p.marca ? `${p.nome} / ${p.marca}` : p.nome,
      ]),
    },
    { nome: 'quantidade', rotulo: 'Quantidade', tipo: 'number', min: 1 },
  ];

  function salvarLista(valores) {
    if (valores.nome.length > 150)
      throw new Error('Use até 150 caracteres no nome da lista.');
    let id = valores.id;
    alterarBancoCompras(db => {
      if (id) {
        const existente = db.compras.find(
          item => item.id === id && item.casa_id === casaId
        );
        if (!existente) throw new Error('A lista não está mais disponível.');
        existente.nome = valores.nome;
      } else {
        id = inserir(
          'compras',
          { casa_id: casaId, nome: valores.nome, criacao: hoje() },
          db
        ).id;
      }
    });
    setParams({ visao: 'compras', lista: id });
  }

  function salvarItem(valores) {
    alterarBancoCompras(db => {
      if (
        !db.compras.some(
          item => item.id === lista.id && item.casa_id === casaId
        )
      )
        throw new Error('A lista não está mais disponível.');
      if (!valores.nome_item && !valores.produto_id)
        throw new Error('Informe o nome ou escolha um produto do catálogo.');
      if (valores.nome_item?.length > 150)
        throw new Error('Use até 150 caracteres no nome do item.');
      if (
        !Number.isInteger(valores.quantidade) ||
        valores.quantidade < 1 ||
        valores.quantidade > 2147483647
      )
        throw new Error('Informe uma quantidade inteira válida.');
      const dados = {
        compras_id: lista.id,
        produto_id: valores.produto_id || null,
        nome_item: valores.nome_item || null,
        quantidade: valores.quantidade,
      };
      if (valores.id) {
        const existente = db.compra_item.find(
          item => item.id === valores.id && item.compras_id === lista.id
        );
        if (!existente) throw new Error('O item não está mais disponível.');
        Object.assign(existente, dados);
      } else {
        inserir('compra_item', { ...dados, comprado: false }, db);
      }
    });
  }

  function executar(acao) {
    try {
      acao();
      setErro('');
      return true;
    } catch (falha) {
      setErro(falha.message);
      return false;
    }
  }

  function alternar(item, comprado) {
    executar(() =>
      alterarBancoCompras(db => {
        const existente = db.compra_item.find(
          e => e.id === item.id && e.compras_id === lista.id
        );
        if (!existente) throw new Error('O item não está mais disponível.');
        existente.comprado = comprado;
      })
    );
  }

  function excluirLista() {
    alterarBancoCompras(db => {
      db.compras = db.compras.filter(
        item => item.id !== lista.id || item.casa_id !== casaId
      );
      db.compra_item = db.compra_item.filter(
        item => item.compras_id !== lista.id
      );
    });
    setParams({ visao: 'compras' });
  }

  return (
    <PaginaMvp cabecalho={false}>
      <div className='cozinha-organizacao'>
        {lista && (
          <Link to={rotaCompras} className='cozinha-voltar'>
            <ArrowLeft size={17} aria-hidden='true' /> Todas as listas
          </Link>
        )}
        <header className='cozinha-topo'>
          <div>
            <h1>{lista?.nome || 'Listas de compras'}</h1>
            <p>
              {lista
                ? `Criada em ${dataCurta(lista.criacao)}`
                : 'Separe as compras por ocasião e marque os itens conforme for comprando.'}
            </p>
          </div>
          <button
            className={lista ? 'cozinha-botao' : 'mvp-primario'}
            type='button'
            onClick={() => setEditor({ tipo: 'lista', valores: lista || {} })}
          >
            {lista ? (
              <Pencil size={17} aria-hidden='true' />
            ) : (
              <Plus size={18} aria-hidden='true' />
            )}
            {lista ? 'Editar lista' : 'Nova lista'}
          </button>
        </header>
        {erro && (
          <p className='cozinha-erro' role='alert'>
            {erro}
          </p>
        )}
        {lista ? (
          <section
            className='compras-checklist'
            aria-label='Checklist da lista'
          >
            <div className='compras-checklist-resumo'>
              <div>
                <strong>
                  {feitos} de {itens.length} comprados
                </strong>
                <progress
                  aria-label='Itens comprados'
                  value={feitos}
                  max={itens.length || 1}
                />
              </div>
            </div>
            <div className='compras-checklist-formas'>
              <form
                onSubmit={evento => {
                  evento.preventDefault();
                  const form = evento.currentTarget;
                  const nome = new FormData(form).get('item').trim();
                  if (
                    executar(() =>
                      salvarItem({ nome_item: nome, quantidade: 1 })
                    )
                  )
                    form.reset();
                }}
              >
                <input
                  name='item'
                  aria-label='Nome do novo item'
                  placeholder='Ex.: tomate'
                  required
                  maxLength={150}
                />
                <button className='mvp-primario' type='submit'>
                  <Plus size={17} aria-hidden='true' /> Adicionar
                </button>
              </form>
              <button
                className='cozinha-botao'
                type='button'
                onClick={() =>
                  setEditor({ tipo: 'item', valores: { quantidade: 1 } })
                }
              >
                Adicionar com detalhes
              </button>
            </div>
            {itens.length ? (
              <ul className='compras-itens'>
                {itens.map(item => (
                  <li key={item.id} data-comprado={item.comprado}>
                    <label>
                      <input
                        type='checkbox'
                        checked={item.comprado}
                        onChange={evento =>
                          alternar(item, evento.target.checked)
                        }
                      />
                      <span>
                        <strong>{nomeItem(item)}</strong>
                        <small>
                          {item.quantidade}{' '}
                          {item.quantidade === 1 ? 'unidade' : 'unidades'}
                        </small>
                      </span>
                    </label>
                    <button
                      type='button'
                      className='cozinha-icone'
                      aria-label={`Editar ${nomeItem(item)}`}
                      onClick={() => setEditor({ tipo: 'item', valores: item })}
                    >
                      <Pencil size={17} aria-hidden='true' />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='cozinha-vazio'>
                Adicione o primeiro item desta lista.
              </p>
            )}
          </section>
        ) : (
          <>
            {params.has('lista') && (
              <p className='cozinha-vazio'>Esta lista não está disponível.</p>
            )}
            {listas.length ? (
              <ul className='compras-grade'>
                {listas.map(registro => {
                  const linhas = banco.compra_item.filter(
                    item => item.compras_id === registro.id
                  );
                  const comprados = linhas.filter(item => item.comprado).length;
                  return (
                    <li key={registro.id}>
                      <Link
                        to={`${rotaCompras}&lista=${registro.id}`}
                        className='compras-cartao'
                      >
                        <div className='compras-cartao-topo'>
                          <span className='compras-cartao-icone'>
                            <ShoppingBasket size={20} aria-hidden='true' />
                          </span>
                          <h2>{registro.nome}</h2>
                          <span
                            className='compras-cartao-abrir'
                            aria-hidden='true'
                          >
                            <ArrowUpRight size={18} />
                          </span>
                        </div>
                        <ul className='compras-previa'>
                          {linhas.slice(0, 3).map(item => (
                            <li key={item.id} data-comprado={item.comprado}>
                              <span aria-hidden='true'>
                                {item.comprado && <Check size={13} />}
                              </span>
                              {nomeItem(item)}
                            </li>
                          ))}
                          {linhas.length > 3 && (
                            <li>
                              Mais {linhas.length - 3}{' '}
                              {linhas.length === 4 ? 'item' : 'itens'}
                            </li>
                          )}
                          {!linhas.length && <li>Lista vazia</li>}
                        </ul>
                        <div className='compras-cartao-rodape'>
                          <span>
                            {linhas.length
                              ? `${comprados} de ${linhas.length} comprados`
                              : '0 itens'}
                          </span>
                          <span
                            className='compras-cartao-progresso'
                            aria-hidden='true'
                          >
                            <span
                              style={{
                                width: `${linhas.length ? (comprados / linhas.length) * 100 : 0}%`,
                              }}
                            />
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className='cozinha-vazio'>
                Use Nova lista para planejar suas próximas compras.
              </p>
            )}
          </>
        )}
        {editor?.tipo === 'lista' && (
          <EditorCozinha
            titulo={editor.valores.id ? 'Editar lista' : 'Nova lista'}
            inicial={editor.valores}
            campos={camposLista}
            aoSalvar={salvarLista}
            aoExcluir={editor.valores.id ? excluirLista : undefined}
            aoFechar={() => setEditor(null)}
          />
        )}
        {editor?.tipo === 'item' && lista && (
          <EditorCozinha
            titulo={editor.valores.id ? 'Editar item' : 'Adicionar item'}
            inicial={editor.valores}
            campos={camposItem}
            aoSalvar={salvarItem}
            aoExcluir={
              editor.valores.id
                ? () =>
                    alterarBancoCompras(db => {
                      db.compra_item = db.compra_item.filter(
                        item =>
                          item.id !== editor.valores.id ||
                          item.compras_id !== lista.id
                      );
                    })
                : undefined
            }
            aoFechar={() => setEditor(null)}
          />
        )}
      </div>
    </PaginaMvp>
  );
}
