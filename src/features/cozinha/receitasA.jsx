import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  Heart,
  Pencil,
  Plus,
  Search,
  ShoppingBasket,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { removerRegistro } from '../../app/dados/bancoMvp';
import { PaginaMvp, VazioMvp } from '../../shared/ui/mvp';
import { normalizarTexto } from './content';
import {
  criarListaDaReceita,
  ingredientesNaDespensa,
} from './ingredientesEstoque';
import EditorReceita from './editorReceita';
import {
  fotoReceita,
  marcarReceita,
  receitaPublica,
  situacoesPreparo,
  tiposReceita,
} from './receitasDados';
import './receitasA.css';

const visoes = {
  inicio: ['Receitas', 'Explore o catálogo e guarde o que você quer preparar.'],
  minhas: [
    'Minhas receitas',
    'Organize suas receitas privadas e retome seus rascunhos.',
  ],
  plano: [
    'Meu plano de preparo',
    'Veja o que está na fila, o que você começou e o que já preparou.',
  ],
  favoritas: [
    'Receitas favoritas',
    'Encontre as receitas que você marcou com um coração.',
  ],
};
const colecoes = [
  ['minhas', 'Criadas por mim'],
  ['plano', 'Plano de preparo', ChefHat],
  ['favoritas', 'Favoritas', Heart],
];
const abas = { preparo: 'plano', favoritas: 'favoritas' };

const consultaGrade = '(min-width: 1100px)';

function inscreverGrade(ouvir) {
  const tela = window.matchMedia(consultaGrade);
  tela.addEventListener('change', ouvir);
  return () => tela.removeEventListener('change', ouvir);
}

function receitasPorPagina() {
  return window.matchMedia(consultaGrade).matches ? 4 : 2;
}

function caminho(visao, extra = {}) {
  const aba = Object.keys(abas).find(chave => abas[chave] === visao);
  const destino = aba ? { visao: 'minhas', aba } : { visao };
  return '/cozinha?' + new URLSearchParams({ ...destino, ...extra });
}

function Foto({ receita, destaque = false }) {
  const [fontesComErro, setFontesComErro] = useState([]);
  const foto = fotoReceita(receita, fontesComErro.includes(receita.imagem));

  return (
    <div className='receitas-foto'>
      {foto && !fontesComErro.includes(foto.endereco) ? (
        <>
          <img
            src={foto.endereco}
            alt=''
            loading={destaque ? 'eager' : 'lazy'}
            onError={() =>
              setFontesComErro(fontes => [...fontes, foto.endereco])
            }
          />
          {foto.ilustrativa && (
            <span className='receitas-ilustrativa'>Imagem ilustrativa</span>
          )}
        </>
      ) : (
        <ChefHat size={48} strokeWidth={1.25} aria-hidden='true' />
      )}
    </div>
  );
}

function ReceitaCard({
  receita,
  visao,
  favorita,
  preparo,
  propria,
  aoFavoritar,
  aoPlanejar,
}) {
  const foto = fotoReceita(receita);
  return (
    <article className='receitas-card'>
      <Link
        className='receitas-card-link'
        to={caminho(visao, { receita: receita.id })}
      >
        <Foto key={foto?.endereco} receita={receita} />
        <div className='receitas-card-texto'>
          <div className='receitas-meta'>
            {tiposReceita[receita.tipo] && (
              <span>{tiposReceita[receita.tipo]}</span>
            )}
            {propria && (
              <span>
                {receitaPublica(receita)
                  ? 'Pública'
                  : receita.status === 'rascunho'
                    ? 'Rascunho'
                    : 'Privada'}
              </span>
            )}
          </div>
          <h2>{receita.nome}</h2>
          {receita.descricao && <p>{receita.descricao}</p>}
        </div>
      </Link>
      <div className='receitas-card-acoes'>
        {preparo ? (
          <span className='receitas-situacao' data-status={preparo}>
            {situacoesPreparo[preparo]}
          </span>
        ) : (
          <button
            className='receitas-acao-texto'
            type='button'
            onClick={aoPlanejar}
            aria-label={`Salvar para depois: ${receita.nome}`}
          >
            <Bookmark size={17} aria-hidden='true' /> Salvar para depois
          </button>
        )}
        {(receitaPublica(receita) || favorita) && (
          <button
            type='button'
            className='receitas-icone'
            aria-pressed={favorita}
            onClick={aoFavoritar}
            aria-label={`Favoritar: ${receita.nome}`}
          >
            <Heart
              size={20}
              fill={favorita ? 'currentColor' : 'none'}
              aria-hidden='true'
            />
          </button>
        )}
      </div>
    </article>
  );
}

function Detalhe({
  receita,
  itens,
  visao,
  aoCriarLista,
  propria,
  favorita,
  preparo,
  aoFavoritar,
  aoPlanejar,
  aoExcluir,
}) {
  const [confirmar, setConfirmar] = useState(false);
  const passos = receita.preparo
    .split(/\r?\n/)
    .map(passo => passo.trim())
    .filter(Boolean);
  const temFaltantes = itens.some(item => item.faltando > 0);
  const foto = fotoReceita(receita);
  return (
    <article className='receitas-detalhe'>
      <Link to={caminho(visao)} className='receitas-acao-texto'>
        <ArrowLeft size={18} aria-hidden='true' /> Voltar
      </Link>
      <div
        className={
          foto ? 'receitas-detalhe-topo com-foto' : 'receitas-detalhe-topo'
        }
      >
        <div>
          {tiposReceita[receita.tipo] && (
            <p className='receitas-meta'>{tiposReceita[receita.tipo]}</p>
          )}
          <h1>{receita.nome}</h1>
          {receita.descricao && <p>{receita.descricao}</p>}
          <div className='receitas-acoes'>
            {(receitaPublica(receita) || favorita) && (
              <button
                type='button'
                className='receitas-botao'
                onClick={aoFavoritar}
                aria-pressed={favorita}
              >
                <Heart
                  size={18}
                  fill={favorita ? 'currentColor' : 'none'}
                  aria-hidden='true'
                />{' '}
                Favoritar
              </button>
            )}
            {propria && (
              <Link
                className='receitas-botao'
                to={caminho(visao, { editar: receita.id })}
              >
                <Pencil size={16} aria-hidden='true' /> Editar receita
              </Link>
            )}
          </div>
        </div>
        {foto && <Foto key={foto.endereco} receita={receita} destaque />}
      </div>
      <section className='receitas-plano' aria-label='Plano de preparo'>
        <div>
          <h2>Plano de preparo</h2>
          <p>
            {preparo
              ? 'Atualize o andamento desta receita.'
              : 'Guarde esta receita para preparar quando quiser.'}
          </p>
        </div>
        <div className='receitas-acoes'>
          {preparo ? (
            <>
              <label className='receitas-status'>
                <span>Andamento</span>
                <select
                  value={preparo}
                  onChange={evento => aoPlanejar(evento.target.value)}
                >
                  {Object.entries(situacoesPreparo).map(([id, nome]) => (
                    <option key={id} value={id}>
                      {nome}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className='receitas-botao'
                type='button'
                onClick={() => aoPlanejar(null)}
              >
                Retirar do plano
              </button>
            </>
          ) : (
            <>
              <button
                className='receitas-botao'
                type='button'
                onClick={() => aoPlanejar('fazer')}
              >
                <Bookmark size={17} aria-hidden='true' /> Salvar para depois
              </button>
              <button
                className='receitas-botao receitas-primario'
                type='button'
                onClick={() => aoPlanejar('fazendo')}
              >
                Começar preparo
              </button>
            </>
          )}
        </div>
      </section>
      <div
        className='receitas-leitura-conteudo'
        tabIndex={0}
        role='region'
        aria-label='Ingredientes e modo de preparo'
      >
        <div className='receitas-instrucoes'>
          <section>
            <h2>Ingredientes</h2>
            {itens.length ? (
              <ul>
                {itens.map(item => (
                  <li className='receitas-ingrediente-estoque' key={item.id}>
                    <div>
                      <span>{item.nome}</span>
                      <small data-faltando={item.faltando > 0}>
                        {item.faltando > 0
                          ? `Falta: ${item.faltando.toLocaleString('pt-BR')} ${item.unidade || ''}`.trim()
                          : 'Na despensa'}
                      </small>
                    </div>
                    <strong>
                      {Number(item.quantidade).toLocaleString('pt-BR')}{' '}
                      {item.unidade}
                    </strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum ingrediente cadastrado.</p>
            )}
            {temFaltantes && (
              <button
                type='button'
                className='receitas-botao receitas-primario receitas-criar-lista'
                onClick={aoCriarLista}
              >
                <ShoppingBasket size={17} aria-hidden='true' /> Criar lista com
                o que falta
              </button>
            )}
          </section>
          <section>
            <h2>Modo de preparo</h2>
            <ol>
              {passos.map((passo, indice) => (
                <li key={indice}>{passo}</li>
              ))}
            </ol>
          </section>
        </div>
        {propria && (
          <div className='receitas-exclusao'>
            {confirmar ? (
              <>
                <p>Excluir esta receita e seus ingredientes?</p>
                <button
                  type='button'
                  className='receitas-botao receitas-perigo'
                  onClick={aoExcluir}
                >
                  Confirmar exclusão
                </button>
                <button
                  type='button'
                  className='receitas-botao'
                  onClick={() => setConfirmar(false)}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                type='button'
                className='receitas-acao-texto receitas-perigo'
                onClick={() => setConfirmar(true)}
              >
                <Trash2 size={17} aria-hidden='true' /> Excluir receita
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default function ReceitasA({ banco, casaId, usuario }) {
  const [params, setParams] = useSearchParams();
  const navegar = useNavigate();
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('');
  const [pagina, setPagina] = useState(1);
  const tamanhoPagina = useSyncExternalStore(inscreverGrade, receitasPorPagina);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const topo = useRef(null);
  const visaoAtual = params.get('visao');
  const aba = params.has('favoritas') ? 'favoritas' : params.get('aba');
  const destino =
    visaoAtual === 'minhas' && Object.hasOwn(abas, aba)
      ? abas[aba]
      : visaoAtual;
  const visao = Object.hasOwn(visoes, destino) ? destino : 'inicio';
  const id = params.get('receita');
  const editar = params.get('editar');
  const minhas = banco.receitas.filter(r => r.user_id === usuario);
  const publicas = banco.receitas.filter(receitaPublica);
  const disponiveis = banco.receitas.filter(
    r => r.user_id === usuario || receitaPublica(r)
  );
  const receita = disponiveis.find(r => r.id === Number(id));
  const editada = minhas.find(r => r.id === Number(editar));
  const favoritas = new Set(
    banco.receita_favorita
      .filter(item => item.user_id === usuario)
      .map(item => item.receita_id)
  );
  const plano = new Map(
    banco.receita_usuario
      .filter(item => item.user_id === usuario)
      .map(item => [item.receita_id, item.status])
  );
  const origem = {
    inicio: publicas,
    minhas,
    favoritas: disponiveis.filter(r => favoritas.has(r.id)),
    plano: disponiveis.filter(r => plano.has(r.id)),
  }[visao];
  const resultados = origem.filter(
    r =>
      normalizarTexto(r.nome + ' ' + (r.descricao || '')).includes(
        normalizarTexto(busca)
      ) &&
      (!filtro || (visao === 'plano' ? plano.get(r.id) : r.tipo) === filtro)
  );
  const totalPaginas = Math.max(
    1,
    Math.ceil(resultados.length / tamanhoPagina)
  );
  const paginaAtual = Math.min(pagina, totalPaginas);
  const comeco = (paginaAtual - 1) * tamanhoPagina;
  const lista = resultados.slice(comeco, comeco + tamanhoPagina);

  useEffect(() => {
    if (id || editar) topo.current?.focus();
  }, [id, editar]);

  function executar(acao, mensagem) {
    try {
      acao();
      setErro('');
      setAviso(mensagem);
    } catch (falha) {
      setAviso('');
      setErro(falha.message);
    }
  }

  function favoritar(r) {
    executar(
      () =>
        marcarReceita('receita_favorita', r.id, usuario, !favoritas.has(r.id)),
      favoritas.has(r.id)
        ? 'Receita removida dos favoritos.'
        : 'Receita adicionada aos favoritos.'
    );
  }

  function planejar(r, status) {
    executar(
      () => marcarReceita('receita_usuario', r.id, usuario, status),
      status
        ? `Plano atualizado: ${situacoesPreparo[status]}.`
        : 'Receita retirada do plano.'
    );
  }

  return (
    <PaginaMvp cabecalho={false}>
      <div
        className={
          receita && !editar
            ? 'receitas-tela receitas-leitura'
            : editar
              ? 'receitas-tela'
              : 'receitas-tela receitas-listagem'
        }
        ref={topo}
        tabIndex={-1}
      >
        <p className='sr-only' role='status'>
          {aviso}
        </p>
        {erro && (
          <p className='receitas-erro' role='alert'>
            {erro}
          </p>
        )}
        {editar && (editar === 'nova' || editada) ? (
          <EditorReceita
            key={editar}
            receita={editada}
            itens={banco.receita_item
              .filter(i => i.receita_id === editada?.id)
              .map(i => ({ ...i, nome_item: i.nome_item ?? '' }))}
            produtos={banco.produto}
            usuario={usuario}
            voltar={caminho(visao, editada ? { receita: editada.id } : {})}
            aoSalvar={receitaId => {
              setAviso('Receita salva.');
              setParams({ visao: 'minhas', receita: receitaId });
            }}
          />
        ) : receita ? (
          <Detalhe
            key={receita.id}
            receita={receita}
            itens={ingredientesNaDespensa(
              banco.receita_item.filter(i => i.receita_id === receita.id),
              banco.produto,
              banco.estoque_item.filter(i => i.casa_id === casaId)
            )}
            aoCriarLista={() =>
              executar(() => {
                const listaId = criarListaDaReceita(receita, casaId);
                navegar(`/cozinha?visao=compras&lista=${listaId}`);
              }, 'Lista de compras criada.')
            }
            visao={visao}
            propria={receita.user_id === usuario}
            favorita={favoritas.has(receita.id)}
            preparo={plano.get(receita.id)}
            aoFavoritar={() => favoritar(receita)}
            aoPlanejar={status => planejar(receita, status)}
            aoExcluir={() =>
              executar(() => {
                removerRegistro('receitas', receita.id);
                setParams({ visao: 'minhas' });
              }, 'Receita excluída.')
            }
          />
        ) : (
          <>
            <header className='receitas-topo'>
              <div>
                <h1>{visoes[visao][0]}</h1>
                <p>{visoes[visao][1]}</p>
              </div>
              <div className='receitas-criacao'>
                <Link
                  className='receitas-botao receitas-criar-ia'
                  aria-label='Criar receita com IA'
                  to='/ia'
                  state={{
                    rascunho:
                      'Ajude-me a criar uma receita simples. Pergunte quais ingredientes tenho e sugira uma receita com quantidades e modo de preparo.',
                  }}
                >
                  <Sparkles size={16} aria-hidden='true' /> <span>Com IA</span>
                </Link>
                <Link
                  to={caminho(visao, { editar: 'nova' })}
                  className='receitas-botao receitas-primario'
                >
                  <Plus size={20} aria-hidden='true' /> Nova receita
                </Link>
              </div>
            </header>
            {visao !== 'inicio' && (
              <nav
                className='receitas-colecoes'
                aria-label='Coleções de receitas'
              >
                {colecoes.map(([destino, rotulo, Icone]) => (
                  <Link
                    key={destino}
                    className='receitas-botao'
                    to={caminho(destino)}
                    aria-current={visao === destino ? 'page' : undefined}
                  >
                    {Icone && <Icone size={17} aria-hidden='true' />} {rotulo}
                  </Link>
                ))}
              </nav>
            )}
            {!!(id || editar) && (
              <p role='alert' className='receitas-erro'>
                Essa receita não está disponível.
              </p>
            )}
            <div className='receitas-filtros'>
              <label className='receitas-busca'>
                <Search size={19} aria-hidden='true' />
                <input
                  type='search'
                  aria-label='Buscar receitas'
                  placeholder='Buscar por nome ou descrição'
                  value={busca}
                  onChange={evento => {
                    setBusca(evento.target.value);
                    setPagina(1);
                  }}
                />
              </label>
              <select
                aria-label={
                  visao === 'plano'
                    ? 'Filtrar por andamento'
                    : 'Filtrar por categoria'
                }
                value={filtro}
                onChange={evento => {
                  setFiltro(evento.target.value);
                  setPagina(1);
                }}
              >
                <option value=''>
                  {visao === 'plano' ? 'Todos os andamentos' : 'Categorias'}
                </option>
                {Object.entries(
                  visao === 'plano'
                    ? { ...situacoesPreparo, fazendo: 'Em preparo' }
                    : tiposReceita
                ).map(([chave, nome]) => (
                  <option key={chave} value={chave}>
                    {nome}
                  </option>
                ))}
              </select>
            </div>
            {lista.length > 0 && (
              <div className='receitas-grade'>
                {lista.map(r => (
                  <ReceitaCard
                    key={r.id}
                    receita={r}
                    visao={visao}
                    propria={visao === 'minhas'}
                    favorita={favoritas.has(r.id)}
                    preparo={plano.get(r.id)}
                    aoFavoritar={() => favoritar(r)}
                    aoPlanejar={() => planejar(r, 'fazer')}
                  />
                ))}
              </div>
            )}
            {totalPaginas > 1 && (
              <nav
                className='receitas-paginacao'
                aria-label='Páginas de receitas'
              >
                <button
                  type='button'
                  className='receitas-icone'
                  aria-label='Página anterior'
                  disabled={paginaAtual === 1}
                  onClick={() => setPagina(paginaAtual - 1)}
                >
                  <ChevronLeft size={20} aria-hidden='true' />
                </button>
                <span aria-live='polite'>
                  Página {paginaAtual} de {totalPaginas}
                </span>
                <button
                  type='button'
                  className='receitas-icone'
                  aria-label='Próxima página'
                  disabled={paginaAtual === totalPaginas}
                  onClick={() => setPagina(paginaAtual + 1)}
                >
                  <ChevronRight size={20} aria-hidden='true' />
                </button>
              </nav>
            )}
            {!resultados.length && (
              <VazioMvp>
                {busca.trim() || filtro
                  ? 'Nenhuma receita corresponde à busca. Tente outro termo ou filtro.'
                  : {
                      inicio: 'Não há receitas públicas para explorar.',
                      minhas:
                        'Use Nova receita para escrever sua primeira receita.',
                      favoritas:
                        'Toque no coração de uma receita para encontrá-la aqui.',
                      plano:
                        'Use Salvar para depois em uma receita para adicioná-la ao seu plano.',
                    }[visao]}
              </VazioMvp>
            )}
          </>
        )}
      </div>
    </PaginaMvp>
  );
}
